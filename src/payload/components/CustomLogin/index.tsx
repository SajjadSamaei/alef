"use client";

import React, { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";

// Your UI Components
import { Button } from "@/components/ui/catalyst/ts/button";
import { Checkbox, CheckboxField } from "@/components/ui/catalyst/checkbox";
import { Field, Label } from "@/components/ui/catalyst/fieldset";
import { Heading } from "@/components/ui/catalyst/heading";
import { Input } from "@/components/ui/catalyst/ts/input";
import { Strong, Text, TextLink } from "@/components/ui/catalyst/text";
import { Logo } from "@/components/chegall/chegall-logo";

// Our Payload Server Action
import { loginAction } from "./hooks/login-action"; // Adjust path if needed

// Define the shape of our form data
interface FormValues {
  email: string;
  password: string;
  remember?: boolean;
}

export const CustomLogin: React.FC = () => {
  // Renamed to CustomLogin for clarity
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setError(null);

    const result = await loginAction(data);

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      // On successful login, redirect to the admin dashboard
      router.push("/admin");
    }
  };

  return (
    // Use the handleSubmit function to process the form
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid w-full max-w-sm grid-cols-1 gap-8"
    >
      <div className="flex items-center justify-center">
        <Logo className="h-12" />
      </div>

      <Heading className="flex items-center justify-center">
        ورود به چگال
      </Heading>

      {/* Display a global error message if it exists */}
      {error && (
        <Text className="text-center text-red-500">
          <Strong className="">{error}</Strong>
        </Text>
      )}

      <Field className="">
        <Label className="">ایمیل</Label>
        {/* Register the input with react-hook-form */}
        <Input
          type="email"
          {...register("email", { required: "Email is required" })}
        />
      </Field>

      <Field className="">
        <Label className="">رمزعبور</Label>
        {/* Register the input with react-hook-form */}
        <Input
          type="password"
          {...register("password", { required: "Password is required" })}
        />
      </Field>

      <div className="flex items-center justify-between">
        <CheckboxField className="">
          {/* Register the checkbox */}
          <Checkbox className="" {...register("remember")} />
          <Label className="">من را بیاد بسپر</Label>
        </CheckboxField>
        <Text className="">
          <TextLink className="" href="#">
            <Strong className="">فراموشی رمزعبور</Strong>
          </TextLink>
        </Text>
      </div>

      {/* Disable button and show loading text when submitting */}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "در حال ورود..." : "ورود"}
      </Button>

      <Text className="">
        Don’t have an account?{" "}
        <TextLink className="" href="#">
          <Strong className="">Sign up</Strong>
        </TextLink>
      </Text>
    </form>
  );
};
