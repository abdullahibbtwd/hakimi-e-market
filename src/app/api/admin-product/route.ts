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

        const products = await db.product.findMany({
        where: {
          userId: userId, 
        },
        
        select: {
          id: true,
          name: true,
          offerPrice: true,
          category: true,
          imageUrl: true,
        },
      });
      return NextResponse.json({ products }, { status: 200 });
      
  
      
    } catch (error){
      console.error('Error fetching products:', error);
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
  }
  