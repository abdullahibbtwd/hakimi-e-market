import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import { verifyJWT, getTokenFromRequest } from "@/utils/auth";
import { UserRole } from "@prisma/client";

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
    const   userId  = payload.userId;

    const user = await db.user.findUnique({
      where:{
        id:userId
      },
    select:{
      role:true
    }
    })

    if(user?.role === UserRole.SUPERADMIN){
     const orders = await db.order.findMany({
    include: {
      address:true,
      user: true,
      orderItems: { include: { product: true } },
    },
  });
  return NextResponse.json({ orders }, { status: 201 });
    }else if(user?.role === UserRole.ADMIN){
      const orders = await db.order.findMany({
        where: {
          orderItems: {
            some: {
              product: {
                userId: userId 
              }
            }
          }
        },
        include: {
          address:true,
          user: true,
          orderItems: { include: { product: true } },
        },
      });
      return NextResponse.json({ orders }, { status: 201 });
    }
    
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching orders" },
      { status: 500 }
    );
  }
}
