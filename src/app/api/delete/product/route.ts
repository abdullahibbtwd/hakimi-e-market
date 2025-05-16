// app/api/delete-banner/route.ts
import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import { verifyJWT, getTokenFromRequest } from "@/utils/auth";
import { UserRole } from "@prisma/client";

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const { id } = await request.json(); 
    
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized - No token provided" },
        { status: 401 }
      );
    }

    const { payload } = await verifyJWT(token);
    const userId = payload.userId;
    const userRole = await db.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (userRole?.role === UserRole.USER) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!id) {
      return NextResponse.json(
        { error: "Banner ID is required" },
        { status: 400 }
      );
    }

    const deletedProduct = await db.product.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Banner deleted successfully", deletedProduct
        
       },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting banner:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}