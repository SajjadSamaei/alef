"use client";
import { useUpdatePassword } from "@/utils/query/profile/useUpdatePassword";
import { useUpdateUserData } from "@/utils/query/profile/useUpdateUserData";
import { Notification } from "@/components/ui/notification";
import { useState, useEffect } from "react";
import {
  Listbox,
  ListboxLabel,
  ListboxOption,
} from "@/components/ui/catalyst/listbox";
import {
  Field,
  FieldGroup,
  Fieldset,
  Label,
  ErrorMessage,
} from "@/components/ui/catalyst/fieldset";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { Input } from "@/components/ui/catalyst/input";
import { Button } from "@/components/ui/catalyst/button";
import Failed from "@/components/ui/Failed";
import { isPersianText, isEnglishText } from "@/utils/helpers/strings-numbers";

export function UpdateProfile({ userData, onNotify, onClose }) {
  const {
    id: userId,
    admin_role: adminPrivilege,
    display_name_farsi: rawFarsiName,
    display_name: rawEnglishName,
  } = userData;

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [nameFarsi, setNameFarsi] = useState("");
  const [nameFarsiError, setNameFarsiError] = useState(false);
  const [nameEnglishError, setNameEnglishError] = useState(false);
  const [nameEnglish, setNameEnglish] = useState("");
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    setNameFarsi(rawFarsiName);
    setNameEnglish(rawEnglishName);
  }, [userData, rawFarsiName, rawEnglishName]);

  const { mutate: updatePassword } = useUpdatePassword();
  const { mutate: updateUserData } = useUpdateUserData();

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setPasswordError(false);
    if (validatePassword()) {
      updatePassword(password, {
        onSuccess: () => {
          setLoading(false);
          onNotify("حساب کاربری بروز شد", true);
          onClose();
        },
        onError: () => {
          setMessage("خطا رخ داد");
        },
      });
    } else {
      setLoading(false);
    }
  };

  const handleUpdateUserData = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setNameFarsiError(false);
    setNameEnglishError(false);
    if (validateUserData()) {
      updateUserData(
        {
          userId,
          nameFarsi,
          nameEnglish,
        },
        {
          onSuccess: () => {
            setLoading(false);
            onNotify("حساب کاربری بروز شد", true);
            onClose();
          },
          onError: (error) => {
            setLoading(false);
            setMessage("مشکلی در بروزرسانی بوجود آمد");
          },
        },
      );
    } else {
      setLoading(false);
    }
  };

  // Validation

  const validatePassword = () => {
    let isValid = true;

    if (password !== rePassword) {
      setPasswordError(true);
      isValid = false;
    } else {
      setPasswordError(false);
    }
    if (password === "" || rePassword === "") {
      setPasswordError(true);
      isValid = false;
    } else {
      setPasswordError(false);
    }
    setIsValid(isValid);
    return isValid;
  };

  const validateUserData = () => {
    let isValid = true;
    if (nameFarsi === "" || !isPersianText(nameFarsi)) {
      setNameFarsiError(true);
      isValid = false;
    } else {
      setNameFarsiError(false);
    }

    if (nameEnglish === "" || !isEnglishText(nameEnglish)) {
      setNameEnglishError(true);
      isValid = false;
    } else {
      setNameEnglishError(false);
    }

    setIsValid(isValid);
    return isValid;
  };

  const handleAlertClose = () => {
    setMessage("");
  };

  const handleRefresh = async () => {
    await refetchProfiles();
    await refetchTotalItems();
  };

  const handleNotification = (message, isPositive) => {
    setIsSuccess(isPositive);
    setMessage(message);
  };

  const handleCloseEditDialog = () => {
    setIsEditOpen(false);
    handleRefresh();
    setTimeout(() => {
      setMessage("");
    }, 5000); // Auto-hide notification after 5 seconds
  };

  return (
    <div dir="rtl">
      <div className="flex w-full justify-center">
        <div className="w-full max-w-md">
          <TabGroup>
            <TabList className="flex items-center justify-between gap-4">
              <Tab className="rounded-full px-3 py-1 text-sm/6 font-semibold text-zinc-950 focus:outline-hidden data-focus:outline-1 data-focus:outline-zinc-950 data-hover:bg-zinc-950/5 data-selected:bg-[#d3e3fd] data-selected:shadow-2xs data-selected:drop-shadow-xs data-selected:data-hover:bg-zinc-950/10 dark:text-white dark:data-focus:outline-white dark:data-hover:bg-white/5 dark:data-selected:bg-white/10 dark:data-selected:shadow-none dark:data-selected:drop-shadow-none dark:data-selected:data-hover:bg-white/10">
                اطلاعات کاربر
              </Tab>
              <Tab className="rounded-full px-3 py-1 text-sm/6 font-semibold text-zinc-950 focus:outline-hidden data-focus:outline-1 data-focus:outline-zinc-950 data-hover:bg-zinc-950/5 data-selected:bg-[#d3e3fd] data-selected:shadow-2xs data-selected:drop-shadow-xs data-selected:data-hover:bg-zinc-950/10 dark:text-white dark:data-focus:outline-white dark:data-hover:bg-white/5 dark:data-selected:bg-white/10 dark:data-selected:shadow-none dark:data-selected:drop-shadow-none dark:data-selected:data-hover:bg-white/10">
                رمز عبور
              </Tab>
            </TabList>
            <TabPanels className="mt-3">
              {/* Update User Data */}
              <TabPanel>
                <form onSubmit={handleUpdateUserData}>
                  <Fieldset className="mt-4">
                    <FieldGroup>
                      <Field>
                        <Label>نام و نام خانوادگی به فارسی</Label>
                        <Input
                          name="name-fa"
                          type="text"
                          value={nameFarsi}
                          onChange={(e) => setNameFarsi(e.target.value)}
                          placeholder="نام و نام خانوادگی"
                          invalid={nameFarsiError}
                        />
                        {nameFarsiError && (
                          <ErrorMessage>
                            لطفا نام را به فارسی وارد کنید
                          </ErrorMessage>
                        )}
                      </Field>
                      <Field>
                        <Label>نام و نام خانوادگی به لاتین</Label>
                        <Input
                          onChange={(e) => setNameEnglish(e.target.value)}
                          name="name-en"
                          type="text"
                          value={nameEnglish}
                          aria-label="Full name"
                          placeholder="Full Name"
                          invalid={nameEnglishError}
                        />
                        {nameEnglishError && (
                          <ErrorMessage>
                            لطفا نام انگلیسی را وارد کنید
                          </ErrorMessage>
                        )}
                      </Field>
                      <Field className="flex grow flex-col items-center justify-center">
                        <Button
                          color="teal"
                          className="w-full"
                          type="submit"
                          disabled={loading}
                        >
                          {loading ? "در حال بروزرسانی..." : "بروزرسانی"}
                        </Button>
                      </Field>
                    </FieldGroup>
                  </Fieldset>
                </form>
              </TabPanel>
              {/* Update Password */}
              <TabPanel>
                <form onSubmit={handleUpdatePassword}>
                  <Fieldset className="mt-4">
                    <FieldGroup>
                      <Field>
                        <Label>رمز عبور جدید</Label>
                        <Input
                          name="password"
                          type="password"
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="رمز عبور جدید را وارد کنید"
                          required
                          invalid={passwordError}
                        />
                      </Field>
                      <Field>
                        <Input
                          onChange={(e) => setRePassword(e.target.value)}
                          name="re-password"
                          type="password"
                          aria-label="Password"
                          placeholder="رمز عبور را دوباره تکرار کنید"
                          invalid={passwordError}
                          required
                        />
                        {passwordError && (
                          <ErrorMessage>
                            مشکلی در تغییر رمز عبور بوجود آمد
                          </ErrorMessage>
                        )}
                      </Field>
                      <Field className="flex grow flex-col items-center justify-center">
                        <Button
                          color="blue"
                          className="w-full"
                          type="submit"
                          disabled={loading}
                        >
                          {loading
                            ? "در حال تغییر رمز عبور"
                            : "تغییر رمز کاربر"}
                        </Button>
                      </Field>
                    </FieldGroup>
                  </Fieldset>
                </form>
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </div>
      </div>
      {message && <Failed message={message} onClose={handleAlertClose} />}
    </div>
  );
}
