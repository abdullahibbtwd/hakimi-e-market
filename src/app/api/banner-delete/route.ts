import { db } from "@/lib/db";
import { NextResponse,NextRequest } from "next/server";

export async function DELETE(req:NextRequest) {
    const id = await req.nextUrl.searchParams.get("id");
    const blog = await db.banner.findUnique({
        where:{
            id:id
        },
        select:{
            id:true
        }
    });
    await db.banner.delete({
        where:{
            id:blog?.id
        }
    })
    return NextResponse.json({ msg: "Deleted" });
  }
  