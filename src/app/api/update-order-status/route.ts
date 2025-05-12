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
  const { id, status } = await request.json();

  try {
    const updatedUser = await db.order.update({
      where: { id },
      data: { status: status },
    });

    return NextResponse.json({ updatedUser }, { status: 200 });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ error }, { status: 200 });
  }
}
