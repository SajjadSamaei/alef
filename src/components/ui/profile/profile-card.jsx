"use client";
import { useProfileContext } from "@/utils/providers/profile/ProfileContext";
import { useFetchUser } from "@/utils/query/profile/useFetchUser";
import { useFetchUserProfile } from "@/utils/query/profile/useFetchUserProfile";
import { useState, useEffect } from "react";
import { UpdateProfile } from "@/components/ui/profile/update-profile";
import { Heading } from "@/components/ui/catalyst/heading";
import ToggleTheme from "@/components/ui/ToggleTheme";
import { Notification } from "@/components/ui/notification";
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
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import {
  ArrowRightStartOnRectangleIcon,
  PencilSquareIcon,
  EllipsisVerticalIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import { DialogWrapper } from "@/components/ui/dialog-wrapper";
import { timestampToShamsi } from "@/utils/helpers/date-time";
import { toIndiaDigits } from "@/utils/helpers/strings-numbers";
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from "@/components/ui/catalyst/dropdown";

export function ProfileCard() {
  const { nameFarsi, emailAddress, role, createdAt } = useProfileContext();

  // const [nameFarsi, setNameFarsi] = useState("");
  // const [emailAddress, setEmailAddress] = useState("");
  // const [role, setRole] = useState("");
  // const [createdAt, setCreatedAt] = useState("");
  const [message, setMessage] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { refetch: refetchUser } = useFetchUser();

  const { data: user } = useFetchUser();
  const { data: userProfile, refetch: refetchUserProfile } =
    useFetchUserProfile();

  const handleRefresh = async () => {
    await refetchUser();
    await refetchUserProfile();
  };

  // useEffect(() => {
  //   setNameFarsi(rawFarsiName);
  //   setEmailAddress(rawEnglishName);
  //   setRole();
  // }, [userData]);

  const handleCloseEditDialog = () => {
    setIsEditOpen(false);
    handleRefresh();
    setTimeout(() => {
      setMessage("");
    }, 5000); // Auto-hide notification after 5 seconds
  };

  const handleNotification = (message, isPositive) => {
    setIsSuccess(isPositive);
    setMessage(message);
  };

  return (
    <>
      {/* Edit User */}
      <DialogWrapper
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="ویرایش حساب کاربری"
      >
        <UpdateProfile
          rowData={userProfile}
          onNotify={handleNotification}
          onClose={handleCloseEditDialog}
        />
      </DialogWrapper>
      <div className="flex w-full justify-center">
        <div className="w-full max-w-md">
          <Fieldset className="mb-8 lg:mb-4">
            <Field className="rounded-xl bg-[#f2f6fc] p-3 px-4 shadow-2xs ring-1 ring-zinc-950/5 drop-shadow-xs dark:bg-zinc-800 dark:ring-transparent">
              {/* <Field className="rounded-xl bg-zinc-50 p-3 px-4 py-6 shadow-md drop-shadow-xs dark:bg-white/5 dark:shadow-none dark:drop-shadow-none"> */}
              <div className="flex justify-between">
                <p className="min-w-0 text-xs leading-6 font-semibold text-zinc-700 dark:text-zinc-300">
                  <span className="truncate">{role}</span>
                </p>

                {/* <Button plain>
                  <ArrowRightStartOnRectangleIcon />
                </Button>
                <Button
                  plain
                  onClick={() => {
                    setIsEditOpen(true);
                  }}
                >
                  <PencilSquareIcon />
                </Button> */}

                <Dropdown>
                  <DropdownButton>
                    <EllipsisVerticalIcon />
                  </DropdownButton>
                  <DropdownMenu className="min-w-64" anchor="bottom end">
                    <DropdownItem href="/admin/profile">
                      <UserIcon />
                      <DropdownLabel>حساب من</DropdownLabel>
                    </DropdownItem>
                    <ToggleTheme />
                    <DropdownDivider />
                    <DropdownItem href="/logout">
                      <ArrowRightStartOnRectangleIcon />
                      <DropdownLabel>خروج</DropdownLabel>
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>

              <Heading
                className="mt-2 text-zinc-100 dark:text-zinc-50"
                level={2}
              >
                {nameFarsi ? nameFarsi : ""}
              </Heading>

              <div className="mt-3 flex items-center gap-x-2.5 text-xs leading-5 text-zinc-700 dark:text-zinc-400">
                <p className="truncate">{emailAddress ? emailAddress : ""}</p>
                <svg
                  viewBox="0 0 2 2"
                  className="h-0.5 w-0.5 flex-none fill-zinc-700 dark:fill-zinc-400"
                >
                  <circle cx={1} cy={1} r={1} />
                </svg>
                <p className="truncate">
                  {createdAt ? toIndiaDigits(timestampToShamsi(createdAt)) : ""}
                </p>
              </div>
            </Field>
          </Fieldset>
        </div>
        {message && <Notification isPositive={isSucess} message={message} />}
      </div>
    </>
  );
}
