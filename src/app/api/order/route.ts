import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import { verifyJWT, getTokenFromRequest } from "@/utils/auth";

export async function POST(request: NextRequest) {
  try {
    // Parse the request payload
    const { addressId, items, total } = await request.json();

    // Validate authentication
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized - No token provided" },
        { status: 401 }
      );
    }

    const { payload } = await verifyJWT(token);
    const userId = payload.userId;
    if (!userId || !addressId || !items || !Array.isArray(items) || total == null) {
      return NextResponse.json(
        { error: "Invalid or missing order data" },
        { status: 400 }
      );
    }

    // Begin transaction
    const result = await db.$transaction(async (tx) => {
      // Create the order
      const order = await tx.order.create({
        data: {
          userId,
          addressId,
          total,
          status: "PENDING", 
        },
      });

      // Create order items and validate stock
      const orderItems = await Promise.all(
        items.map(async (item: { productId: string; quantity: number }) => {
          const product = await tx.product.findUnique({
            where: { id: item.productId },
          });

          if (!product) {
            throw new Error(`Product ${item.productId} not found`);
          }

          if (item.quantity > product.Stock) {
            throw new Error(`Insufficient stock for ${product.name}`);
          }

          // Deduct stock
          await tx.product.update({
            where: { id: item.productId },
            data: { Stock: product.Stock - item.quantity },
          });

          // Create order item
          return tx.orderItem.create({
            data: {
              orderId: order.id,
              productId: item.productId,
              quantity: item.quantity,
              price: product.price,
            },
          });
        })
      );
      
      const cart = await tx.cart.findUnique({
        where: { userId },
        include: { items: true },
      });
    
      if (!cart) {
        throw new Error("Cart not found for the user.");
      }
      // Clear user's cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id }, // Assuming `cart` is fetched earlier
      });
    
      // Then delete the cart
      await tx.cart.delete({
        where: { userId },
      });
      return { order, orderItems };
    });

    return NextResponse.json(
      { ...result, message: "Order created successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the order" },
      { status: 500 }
    );
  }
}
