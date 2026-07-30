"use server";

import { login } from "@payloadcms/next/auth";
import config from "@payload-config";
import { revalidatePath } from "next/cache";

// A helper function to safely stringify unknown errors
function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "An unknown error occurred";
}

export async function loginAction(data: {
  email: string;
  password: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    // The login function from @payloadcms/next/auth handles setting the cookie
    await login({
      collection: "users",
      config,
      ...data, // Spread email and password directly
    });
  } catch (error) {
    // Return a structured error object
    return { success: false, error: getErrorMessage(error) };
  }

  // Revalidate the path to ensure the new logged-in state is reflected
  // This is good practice after a successful authentication
  revalidatePath("/admin");

  return { success: true };
}
