import { NextResponse, NextRequest } from "next/server";
import { getTokenFromRequest } from "@/utils/auth";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  const token = getTokenFromRequest(request);
  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized - No token provided" },
      { status: 401 }
    );
  }
  const { email, newRole } = await request.json();

  try {
    const updatedUser = await db.user.update({
      where: { email },
      data: { role: newRole },
    });

    return NextResponse.json({ updatedUser }, { status: 200 });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ error }, { status: 200 });
  }
}
