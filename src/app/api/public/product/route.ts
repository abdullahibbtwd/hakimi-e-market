import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(){
  try{
          const products = await db.product.findMany({});
          return NextResponse.json({ products }, { status: 200 });
  }catch(error){
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}