import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
// import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "./lib/db";
// import { serialize } from 'cookie';
// import jwt from 'jsonwebtoken';
// import bcrypt from "bcryptjs";


export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    // CredentialsProvider({
    //   credentials: {
    //     email: {},
    //     password: {},
    //   },
    //   async authorize(credentials) {
    //     if (credentials === null) return null;
    //     try {
    //       const user = await db.user.findUnique({
    //         where: {
    //           email: credentials?.email,
    //         },
    //       });
    //       if (user) {
    //         const isMatch = await bcrypt.compare(
    //           credentials.password,
    //           user.password
    //         );
    //         if (isMatch) {
    //           return user;
    //         } else {
    //           throw new Error("Credentil Doesnt Match");
    //         }
    //       } else {
    //       }
    //     } catch (error) {
    //       throw new Error(error);
    //     }
    //   },
    // }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,

      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({  profile}) {
      const existingUser = await db.user.findUnique({
        where: { email : profile?.email  || ''},
      });

      if (!existingUser) {
       
        await db.user.create({
          data: {
            email: profile?.email ||'', 
            name: profile?.name  ?? 'Unknown User', 
            password: 'google-login', 
          },
        });
      }

      
      return true;
    },
    // async session({ session, token, user }) {
    //     // Generate a custom token (JWT) for the session
    //     const secret = process.env.JWT_SECRET;
    //     const customToken = jwt.sign({ userId: token.sub }, secret, {
    //       expiresIn: '1h',
    //     });
  
    //     // Add the custom token to the session
    //     session.token = customToken;
  
    //     return session;
    //   },
    // },
    // events: {
    //   async signIn({ user, account, profile }) {
    //     // Generate the token after successful sign-in
    //     const secret = process.env.JWT_SECRET;
    //     const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '1h' });
  
    //     // Serialize and set the token as a cookie
    //     const cookie = serialize('authToken', token, {
    //       httpOnly: true,
    //       secure: process.env.NODE_ENV !== 'development',
    //       sameSite: 'strict',
    //       path: '/',
    //       maxAge: 60 * 60, // 1 hour
    //     });
  
    //     // Set the cookie in the response
    //     account.response?.setHeader('Set-Cookie', cookie);
    //   },
    // },
}
});
