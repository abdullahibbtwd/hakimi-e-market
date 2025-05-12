// // import { NextResponse, NextRequest } from "next/server";
// // import { db } from "@/lib/db";
// // import { verifyJWT, getTokenFromRequest } from "@/utils/auth";
// // import { UserRole } from "@prisma/client";



// // export async function DELETE( request: NextRequest,
// //   { params }: { params: { id: string } }) {
// //   try {
// //     const token = getTokenFromRequest(request);
// //     if (!token) {
// //       return NextResponse.json(
// //         { error: "Unauthorized - No token provided" },
// //         { status: 401 }
// //       );
// //     }

// //     const { payload } = await verifyJWT(token);
// //     const userId = payload.userId;
// //     const Userrole = await db.user.findUnique({
// //       where: {
// //         id: userId,
// //       },
// //       select: {
// //         role: true,
// //       },
// //     });

// //     if (Userrole?.role === UserRole.USER) {
// //       return NextResponse.json({ error: "Forbidden" }, { status: 403 });
// //     }
// //     const bannerId = params.id;

// //     if (!bannerId) {
// //       return NextResponse.json(
// //         { error: "Product ID is required" },
// //         { status: 400 }
// //       );
// //     }

// //     // Attempt to delete the product
// //     const deletedBanner = await db.banner.delete({
// //       where: {
// //         id: bannerId,
// //       },
// //     });
// //     if (!deletedBanner) {
// //       return NextResponse.json({ error: "Product not found" }, { status: 404 });
// //     }

// //     return NextResponse.json(
// //       { message: "Banner  deleted successfully", deletedBanner },
// //       { status: 200 }
// //     );
// //   } catch (error: unknown) {
// //     console.error("Error deleting product:", error);
// //   }
// // }
// import { NextResponse, NextRequest } from "next/server";
// import { db } from "@/lib/db";
// import { verifyJWT, getTokenFromRequest } from "@/utils/auth";
// import { UserRole } from "@prisma/client";

// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
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
//     const userRole = await db.user.findUnique({
//       where: { id: userId },
//       select: { role: true },
//     });

//     if (userRole?.role === UserRole.USER) {
//       return NextResponse.json({ error: "Forbidden" }, { status: 403 });
//     }

//     const bannerId = params.id;
//     if (!bannerId) {
//       return NextResponse.json(
//         { error: "Banner ID is required" },
//         { status: 400 }
//       );
//     }

//     const deletedBanner = await db.banner.delete({
//       where: { id: bannerId },
//     });

//     return NextResponse.json(
//       { message: "Banner deleted successfully", deletedBanner },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error deleting banner:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }