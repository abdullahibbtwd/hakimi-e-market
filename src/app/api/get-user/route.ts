import { verifyJWT, getTokenFromRequest } from "@/utils/auth";
import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";

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

            const user = await db.user.findUnique({
                where: {
                  id: userId,
                },
                select: {
                  role: true, 
                },
              });
          
              if (!user) {
                return NextResponse.json({ error: 'User not found' }, { status: 404 });
              }
          
              const userRole = user.role;

              if(userRole === 'SUPERADMIN'){
                const allUsers = await db.user.findMany({
                    select: { 
                      email: true,
                      name: true,
                      role: true,
                      products:true,
                      address:true,
                      orders:true,
                    },
                  });
                  return NextResponse.json({ users: allUsers }, { status: 200 });
              }else{
                return NextResponse.json({ role: userRole }, { status: 200 });
              }
   

    }catch(error){
        console.error(error)
    }
}