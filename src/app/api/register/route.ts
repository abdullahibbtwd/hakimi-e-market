import { db } from "@/lib/db";
import bcrypt from "bcryptjs"
import { NextResponse,NextRequest } from "next/server";

const saltRounds = 10; 


export const POST = async  (request:NextRequest) => {
    try{

    
    const {name, email,password} = await request.json();


    if (!name || !email || !password) {
        return NextResponse.json({ error: "Please provide name, email, and password" }, { status: 400 });
      }
  
      const existingUser = await db.user.findUnique({
        where: { email },
      });
  
      if (existingUser) {
        return NextResponse.json({ error: "User with this email already exists" }, { status: 409 });
      }

      const hashedPassword = await bcrypt.hash(password, saltRounds);


      const newUser = await db.user.create({
        data: {
          name,
          email,
          password: hashedPassword, 
        },
      });
  
      const {  password: userPassword, ...userWithoutPassword } = newUser;
  
      return NextResponse.json(userWithoutPassword, { status: 201 });
    }catch (error) {
        console.error("Error during registration:", error);
        return NextResponse.json({ error: "Failed to register user" }, { status: 500 });
      } finally {
        await db.$disconnect();
      }
}