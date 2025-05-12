import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
  
    cookies().delete('authToken');


    return NextResponse.json({ 
      success: true,
      message: 'Logged out successfully' 
    });
    
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Logout failed' },
      { status: 500 }
    );
  }
}