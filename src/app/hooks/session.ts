'use client'
import { useState, useEffect } from 'react';


export interface User {
  id: string;
  email: string;
  name: string;
  role: string; 
  createdAt?: Date;
  updatedAt?: Date;
  password?: string | null;
 
}

interface SessionState {
  user: User | null;
  isSpecificUser: boolean;
  isSuperAdmin:boolean;
  loading: boolean;
  error: string | null;
}
export function useSession() {
  const [session, setSession] = useState<SessionState>({
    user: null,
    isSpecificUser: false,
    isSuperAdmin:false,
    loading: true,
    error: null
  });
 
 const logout = async () => {
  try {
    const res = await fetch('/api/logout', {
      method: 'POST',
      credentials: 'include'
    });
    
    if (!res.ok) throw new Error('Logout failed');
    
   
    setSession({
      user: null,
      isSpecificUser: false,
      isSuperAdmin:false,
      loading: false,
      error: null
    });
    

    window.location.reload();
    
  } catch (error ) {
    if (error instanceof Error) {
      setSession(prev => ({
      ...prev,
      error: error.message
    }));
    } else {
      console.error('An unknown error occurred:', error);
    }
    
  }
};

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch('/api/login', {
          credentials: 'include',
          cache: 'no-store'
        });

        if (!res.ok) throw new Error('Session check failed');
        
        const data = await res.json();

        console.log(data)

        setSession({
          user: data.user || null,
          isSpecificUser: data.user?.role  === "ADMIN",
          isSuperAdmin:data.user?.role === "SUPERADMIN",
          loading: false,
          error: null
        });

      } catch (error) {
        if (error instanceof Error) {
          setSession({
          user: null,
          isSpecificUser: false,
          isSuperAdmin:false,
          loading: false,
          error: error.message
        });
        } else {
          console.error('An unknown error occurred:', error);
        }
       
      }
    };

    fetchSession();
  }, []);

  return  {...session, logout};
}