import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookie = await cookies();
    cookie.delete("authToken");

    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}
