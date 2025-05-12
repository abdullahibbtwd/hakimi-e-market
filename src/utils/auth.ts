import { jwtVerify, JWTVerifyResult } from 'jose'; // Use jose for modern JWT handling
import { NextRequest } from 'next/server';

// Define the type for your JWT payload.  Adjust this to match your actual payload.
interface JWTPayload {
  userId: string;
  role:string;
  iat: number;
  exp: number;
}

// Function to extract the token from the request
export  function getTokenFromRequest(req: NextRequest): string | undefined {
  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }

  // Check for cookie (adjust 'authToken' to your cookie name)
  const cookieHeader = req.headers.get('cookie');
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const [name, value] = cookie.trim().split('=');
      if (name === 'authToken') {
        acc[name] = value;
      }
      return acc;
    }, {} as { [key: string]: string });
    if (cookies.authToken) {
      return cookies.authToken;
    }
  }
  return undefined;
}

// Function to verify the JWT
export async function verifyJWT(token: string): Promise<JWTVerifyResult<JWTPayload>> {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET); // Use TextEncoder
  return await jwtVerify(token, secret);
}