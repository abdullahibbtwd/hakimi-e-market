import { verifyJWT, getTokenFromRequest } from "@/utils/auth";
import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized - No token provided" },
        { status: 401 }
      );
    }

    const { payload } = await verifyJWT(token);
    const userId = payload.userId;
    const orders = await db.order.findMany({
      where: {
        userId: userId
      },
      include: {
        address:true,
        user: true,
        orderItems: { include: { product: true } },
      },
    });
    

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
