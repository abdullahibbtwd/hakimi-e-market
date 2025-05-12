import { NextResponse, NextRequest } from "next/server";
import { verifyJWT, getTokenFromRequest } from "@/utils/auth";
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

        const user = await db.user.findUnique({
            where: { id: userId },
            include: {
              cart: {
                include: {
                  items: {
                    include: {
                      product: true, 
                    },
                  },
                },
              },
            },
          });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        const cartItems = user.cart?.items || [];  

        return NextResponse.json({ cartItems }, { status: 200 });
    } catch (error) {
        console.error("Error fetching user cart:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
