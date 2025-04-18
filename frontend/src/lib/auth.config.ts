import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getFromStorage, saveToStorage } from "./local-storage";

export type UserRole = "CLIENT" | "FREELANCER" | "ADMIN";

interface UserWithPassword {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: UserRole;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string | null;
      role: UserRole;
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    role: UserRole;
  }
}

// Mock users for server-side rendering
const mockUsers: UserWithPassword[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'CLIENT',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    role: 'FREELANCER',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        // Use mock users for server-side rendering
        const user = mockUsers.find((u) => u.email === credentials.email);

        if (!user) {
          throw new Error("User not found");
        }

        // In a real app, you would hash the password
        if (user.password !== credentials.password) {
          throw new Error("Invalid password");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
  },
}; 