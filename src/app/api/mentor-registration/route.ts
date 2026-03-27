import { NextRequest, NextResponse } from "next/server";
import { createMentorRegistration } from "@/lib/directus";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mentorId, name, email, message } = body;

    // Validate required fields
    if (!mentorId || !name || !email) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create the registration
    const result = await createMentorRegistration({
      mentorId: Number(mentorId),
      name,
      email,
      message,
    });

    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error in mentor registration API:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
