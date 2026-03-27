import { NextResponse } from "next/server";
import { createRegistration } from "@/lib/directus";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eventId, name, email } = body;

    // Validate required fields
    if (!eventId || !name || !email) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate event ID is a number
    const parsedEventId = parseInt(eventId, 10);
    if (isNaN(parsedEventId)) {
      return NextResponse.json(
        { success: false, error: "Invalid event ID" },
        { status: 400 }
      );
    }

    // Validate name length
    if (name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Name must be at least 2 characters" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Create the registration
    const result = await createRegistration({
      eventId: parsedEventId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
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
    console.error("Registration API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
