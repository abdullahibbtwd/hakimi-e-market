import { NextResponse, NextRequest } from "next/server";
import { verifyJWT, getTokenFromRequest } from "@/utils/auth";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
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
    const formData = await request.formData();
    const fullname = formData.get("fullname") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    const pincode = formData.get("pincode") as string;
    const area = formData.get("area") as string;
    const city = formData.get("city") as string;
    const state = formData.get("state") as string;

    if (
      !fullname ||
      !phoneNumber ||
      !pincode ||
      !area ||
      !city ||
      !state
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await db.address.create({
      data: {
        fullname,
        phoneNumber,
        pincode,
        area,
        city,
        state,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
    return NextResponse.json(
      { message: "Address Added Successfully." },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to add address" },
      { status: 500 }
    );
  }
}

export async function GET(request:NextRequest){
    try{
        const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized - No token provided" },
        { status: 401 }
      );
    }

    const { payload } = await verifyJWT(token);
    const userId = payload.userId;
    const address = await db.address.findMany({
        where: {
          userId: userId, 
        },
        
        select: {
          id: true,
          fullname: true,
          phoneNumber: true,
          pincode: true,
          area: true,
          city:true,
          state:true
        },
      });
      return NextResponse.json({ address }, { status: 200 });
    }catch(error){
        console.error('Error fetching products:', error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}