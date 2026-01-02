// src/app/api/inquiries/route.ts

import { NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { AlefInquiry } from "@/src/payload-types";
import { z } from "zod";

const generalInquirySchema = z.object({
  type: z.literal("general"),
  name: z.string().min(2, "Name is required."),
  email: z.string().email("Invalid email address."),
  phone: z.string().min(1, "Phone number is required."),
  company: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters."),
  source: z.enum([
    "google",
    "social_media",
    "referral",
    "advertisement",
    "other",
  ]),
  inquiry_type: z.enum(["supply", "job", "general", "other"]),
});

const investorInquirySchema = z.object({
  type: z.literal("investor"),
  name: z.string().min(2, "Name is required."),
  email: z.string().email("Invalid email address."),
  phone: z.string().min(1, "Phone number is required."),
  investment_range: z.enum(["<5B", "5B-20B", "20B-100B", ">100B"]),
  investment_timeline: z.enum(["immediate", "1-3m", "3-6m", "researching"]),
  investor_message: z.string().optional(),
  investmentInterests: z.object({
    residential: z.boolean(),
    commercial: z.boolean(),
    industrial: z.boolean(),
    land: z.boolean(),
  }),
});

// export async function POST(req: Request) {
//   const payload = await getPayload({ config: configPromise });
//   const body = (await req.json()) as Partial<ChegallInquiry>; // Cast body to match your collection type

//   try {
//     // Use the Payload Local API to create a new document
//     const newInquiry = await payload.create({
//       collection: "chegall-inquiries", // The slug of your collection
//       data: {
//         ...body,
//       },
//     });

//     // Return a success response
//     return NextResponse.json(
//       { message: "Inquiry submitted successfully.", inquiry: newInquiry },
//       { status: 201 },
//     );
//   } catch (error) {
//     // Return an error response
//     console.error("Error submitting inquiry:", error);
//     const errorMessage =
//       error instanceof Error ? error.message : "An unknown error occurred";
//     return NextResponse.json(
//       { message: "Error submitting inquiry.", error: errorMessage },
//       { status: 500 },
//     );
//   }
// }

export async function POST(req: Request) {
  const body = await req.json();

  // --- Honeypot Check ---
  if (body["bot-field"]) {
    // It's a bot! Send a success response to trick it.
    return NextResponse.json({ message: "Success!" }, { status: 201 });
  }

  const payload = await getPayload({ config: configPromise });

  try {
    // Validate based on the 'type' field
    if (body.type === "general") {
      generalInquirySchema.parse(body);
    } else if (body.type === "investor") {
      investorInquirySchema.parse(body);
    } else {
      throw new Error("Invalid inquiry type.");
    }

    // If validation passes, create the document
    const newInquiry = await payload.create({
      collection: "alef-inquiries",
      data: body,
    });

    return NextResponse.json(
      { message: "Success!", inquiry: newInquiry },
      { status: 201 },
    );
  } catch (error) {
    // Zod errors are detailed, so we can return them to the client
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation failed", errors: error },
        { status: 400 },
      );
    }

    console.error(error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { message: "Error submitting inquiry.", error: errorMessage },
      { status: 500 },
    );
  }
}
