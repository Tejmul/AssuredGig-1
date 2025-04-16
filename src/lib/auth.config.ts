import type { NextAuthOptions, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import { User as PrismaUser } from "@prisma/client";

// Define the UserRole type if not available from Prisma
export type UserRole = "CLIENT" | "FREELANCER" | "ADMIN";

// Interface for user with password
interface UserWithPassword extends PrismaUser {
  password: string | null;
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string | null;
      email: string | null;
      image: string | null;
      role: UserRole;
      isTwoFactorEnabled: boolean;
      isOAuth: boolean;
    };
  }

  interface User extends PrismaUser {
    role: UserRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole;
  }
}

export const authOptions = {
  // @ts-ignore - Type mismatch between next-auth and @auth/prisma-adapter is a known issue
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin?error=AuthenticationFailed",
    signOut: "/",
  },
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        session.user.role = token.role as UserRole;
        session.user.isTwoFactorEnabled = false;
        session.user.isOAuth = false;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    }
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { 
          label: "Email", 
          type: "email",
          placeholder: "example@example.com"
        },
        password: { 
          label: "Password", 
          type: "password"
        }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Invalid credentials");
          }

          const user = await db.user.findUnique({
            where: { email: credentials.email.toLowerCase() }
          }) as UserWithPassword | null;

          if (!user || !user.password) {
            throw new Error("Invalid email or password");
          }

          const passwordsMatch = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!passwordsMatch) {
            throw new Error("Invalid email or password");
          }

          // Remove sensitive data from response
          const { password: _, ...userWithoutPassword } = user;
          
          // Return the user object with the correct type
          return userWithoutPassword as any;
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      }
    })
  ],
  debug: process.env.NODE_ENV === "development"
} satisfies NextAuthOptions; 