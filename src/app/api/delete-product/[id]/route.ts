// import { NextResponse, NextRequest } from "next/server";
// import { db } from "@/lib/db";
// import { verifyJWT, getTokenFromRequest } from "@/utils/auth";
// import { UserRole } from "@prisma/client";

// interface RequestContext {
//   params: {
//     id: string;
//   };
// }

// export async function DELETE(request: NextRequest, context: RequestContext) {
//   try {
//     const token = getTokenFromRequest(request);
//     if (!token) {
//       return NextResponse.json(
//         { error: "Unauthorized - No token provided" },
//         { status: 401 }
//       );
//     }

//     const { payload } = await verifyJWT(token);
//     const userId = payload.userId;
//     const Userrole = await db.user.findUnique({
//       where: {
//         id: userId,
//       },
//       select: {
//         role: true,
//       },
//     });

//     if (Userrole?.role === UserRole.USER) {
//       return NextResponse.json({ error: "Forbidden" }, { status: 403 });
//     }
//     const productId = context.params.id;

//     if (!productId) {
//       return NextResponse.json(
//         { error: "Product ID is required" },
//         { status: 400 }
//       );
//     }

//     // Attempt to delete the product
//     const deletedProduct = await db.product.delete({
//       where: {
//         id: productId,
//       },
//     });
//     if (!deletedProduct) {
//       return NextResponse.json({ error: "Product not found" }, { status: 404 });
//     }

//     return NextResponse.json(
//       { message: "Product deleted successfully", deletedProduct },
//       { status: 200 }
//     );
//   } catch (error: unknown) {
//     console.error("Error deleting product:", error);
//   }
// }
