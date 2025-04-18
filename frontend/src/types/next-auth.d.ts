import 'next-auth';
import { UserRole } from '@/lib/auth.config';
import NextAuth from "next-auth"

declare module 'next-auth' {
  interface Session {
    user: User & {
      id: string;
      name: string | null;
      email: string | null;
      role: UserRole;
      isTwoFactorEnabled: boolean;
      isOAuth: boolean;
    }
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    role: UserRole
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: UserRole
  }
} 