import { NextResponse, NextRequest } from "next/server";
import { getTokenFromRequest } from "@/utils/auth";
import { db } from "@/lib/db";
import { OrderStatus } from "@prisma/client";

interface UpdateRequest {
    id: string;
    status: OrderStatus;
  }

  
export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized - No token provided" },
        { status: 401 }
      );
    }
     const { id, status } = await request.json() as UpdateRequest;
    
   
    if (!Object.values(OrderStatus).includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    const updatedOrder = await db.order.update({
      where: { id },
      data: { status },
      include: {
        user: true, 
      },
    });
    return NextResponse.json({ updatedOrder }, { status: 200 });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ error }, { status: 200 });
  }
}
