import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(){
    try{
            const banner = await db.banner.findMany({});
            return NextResponse.json({ banner }, { status: 200 });
    }catch(error){
      console.error('Error fetching products:', error);
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
  }