import { NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import { Role } from "@prisma/client";
import { getUserById } from "@/data/user";
import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";

interface ExtendedToken {
  id: string;
  name: string | null;
  email: string | null;
  role: Role;
}

interface ExtendedSession {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    role: Role;
  };
}

export const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  callbacks: {
    async session({ token, session }) {
      if (token) {
        (session as ExtendedSession).user.id = (token as ExtendedToken).id;
        (session as ExtendedSession).user.name = (token as ExtendedToken).name;
        (session as ExtendedSession).user.email = (token as ExtendedToken).email;
        (session as ExtendedSession).user.role = (token as ExtendedToken).role;
      }
      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      (token as ExtendedToken).id = existingUser.id;
      (token as ExtendedToken).name = existingUser.name;
      (token as ExtendedToken).email = existingUser.email;
      (token as ExtendedToken).role = existingUser.role;

      return token;
    },
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await db.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.password) return null;

        const passwordsMatch = await bcrypt.compare(
          credentials.password,
          user.password,
        );

        if (!passwordsMatch) return null;

        return user;
      }
    })
  ],
}; 