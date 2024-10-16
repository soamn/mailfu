import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/db";
import NextAuth from "next-auth";
import authConfig from "@/auth.config";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  logger: {
    error(code, ...message) {},
    warn(code, ...message) {},
    debug(code, ...message) {},
  },
  events: {
    async linkAccount({ user }) {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ account, profile, user }) {
      if (account?.provider === "credentials") {
        return true;
      }
      return true;
    },
    async session({ token, session }) {
      session.user.id = token.sub as string;
      session.user.refresh_token = token.refreshToken as string;
      session.user.access_token = token.accessToken as string;
      session.user.provider = token.provider as string;

      return session;
    },
    async jwt({ token, account }) {
      if (account && account.expires_in) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.provider = account.provider;
        token.expiresAt = account.expires_at;
      }

      return token;
    },
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
});
