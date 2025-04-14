import { NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import { Role } from "@prisma/client";
import { getUserById } from "@/data/user";
import { getAccountByUserId } from "@/data/account";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import bcrypt from "bcryptjs";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

interface ExtendedToken {
  id: string;
  name: string | null;
  email: string | null;
  role: Role;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
}

interface ExtendedSession {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    role: Role;
    isTwoFactorEnabled: boolean;
    isOAuth: boolean;
  };
}

export const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      // Allow OAuth without email verification
      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserById(user.id);

      // For now, allow sign in without email verification
      // if (!existingUser?.emailVerified) return false;

      if (existingUser?.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

        if (!twoFactorConfirmation) return false;

        // Delete two factor confirmation for next sign in
        await db.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id }
        });
      }

      return true;
    },
    async session({ token, session }) {
      if (token) {
        (session as ExtendedSession).user.id = (token as ExtendedToken).id;
        (session as ExtendedSession).user.name = (token as ExtendedToken).name;
        (session as ExtendedSession).user.email = (token as ExtendedToken).email;
        (session as ExtendedSession).user.role = (token as ExtendedToken).role;
        (session as ExtendedSession).user.isTwoFactorEnabled = (token as ExtendedToken).isTwoFactorEnabled;
        (session as ExtendedSession).user.isOAuth = (token as ExtendedToken).isOAuth;
      }

      return session;
    },
    async jwt({ token, user, account, profile, trigger }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      const existingAccount = await getAccountByUserId(existingUser.id);

      (token as ExtendedToken).id = existingUser.id;
      (token as ExtendedToken).name = existingUser.name;
      (token as ExtendedToken).email = existingUser.email;
      (token as ExtendedToken).role = existingUser.role;
      (token as ExtendedToken).isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
      (token as ExtendedToken).isOAuth = !!existingAccount;

      return token;
    },
  },
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
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