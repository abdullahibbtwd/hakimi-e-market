import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import { verifyJWT, getTokenFromRequest } from "@/utils/auth";

export async function POST(request: NextRequest) {
  try {
    const { productId, quantity } = await request.json();

    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized - No token provided" },
        { status: 401 }
      );
    }

    const { payload } = await verifyJWT(token);
    const userId = payload.userId;

   
    let cart = await db.cart.findUnique({
      where: { userId },
      include: { items: true }, 
    });

    if (!cart) {
      cart = await db.cart.create({
        data: { userId },
        include: { items: true },
      });
    }


    const existingCartItem = await db.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    if (existingCartItem) {
      
      await db.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity },
      });
    } else {
      
      await db.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }

    // Fetch the updated cart
    const updatedCart = await db.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: { product: true }, 
        },
      },
    });

    return NextResponse.json({ cart: updatedCart });
  } catch (error) {
    console.error("Error updating cart:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the request" },
      { status: 500 }
    );
  }
}
