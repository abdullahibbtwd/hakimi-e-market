import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse, NextRequest } from 'next/server';
import { serialize } from 'cookie';
import jwt, { JwtPayload } from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'your-development-secret';

export async function POST(req: NextRequest) {
 
    try {
      const { email, password } = await req.json();
     
      const existingUser = await db.user.findUnique({
        where:{
            email
        }
      });

      if (!existingUser) {
        return NextResponse.json({ message: "User not Exist" },{status:200});
      }
      const checkedPassword = await bcrypt.compare(
        password,
        existingUser.password!
      );
      if (!checkedPassword) {
        return NextResponse.json(
          { message: "Incorrect password" },
          {status:200}
        );
      }
    
      const token = jwt.sign({ userId: existingUser.id,role:existingUser.role }, secret, { 
        expiresIn: '2h',
      });
  
      const cookie = serialize('authToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'development',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60,
      });
  
   
      return NextResponse.json({ message: "Login successfull"}, { status: 201 , headers: {'Set-Cookie': cookie} });
    }catch (error) {
      console.error("Login error:", error); 
      return NextResponse.json({ message: "Login failed"}, { status: 500 });
      }
  }

 
export async function GET(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const cookies = cookieHeader.split(';').reduce((acc: { [key: string]: string | undefined }, cookie) => {
      const [name, value] = cookie.trim().split('=');
      if (name && value) {
        acc[name] = value;
      }
      return acc;
    }, {});

    const token = cookies['authToken'];

    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    try {
      const decoded = jwt.verify(token, secret) as JwtPayload;

      if (!decoded?.userId) {
        return NextResponse.json({ user: null }, { status: 200 });
      }

      const user = await db.user.findUnique({
        where: {
          id: decoded.userId,
        },
        select: {
          email: true,
          name: true,
          role: true,
          id: true,
          cart:true
        },
      }) ;

      if (!user) {
        return NextResponse.json({ user: null }, { status: 200 });
      }

      return NextResponse.json({
        user: {
          email: user.email,
          name: user.name,
          role: user.role,
          id: user.id,
          cart:user.cart
        },
      }, { status: 201 });
    } catch  {
      return NextResponse.json({ user: null }, { status: 200 });
    }
  } catch (error) {
    console.error('Error in GET request:', error);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}