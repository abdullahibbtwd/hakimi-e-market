import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function DELETE(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  const productId = req.nextUrl.searchParams.get("productId");

  if (!userId || !productId) {
    return NextResponse.json({ message: "Missing userId or productId" }, { status: 400 });
  }

  try {
   
    const cart = await db.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });
    }

    
    const deletedCartItem = await db.cartItem.deleteMany({
      where: {
        cartId: cart.id,
        productId: productId,
      },
    });

    if (deletedCartItem.count === 0) {
      return NextResponse.json({ message: "Cart item not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Cart item deleted" }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error deleting cart item:", error);
  const errorMessage = error instanceof Error ? error.message : "Unknown error";
  return NextResponse.json(
    { message: "Internal server error", error: errorMessage },
    { status: 500 }
    );
  }
}
