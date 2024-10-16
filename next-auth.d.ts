import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      role: string;
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      refresh_token: string | null;
      access_token: string | null;
      accessTokenExpires: string | null;
      provider: string | null;
    };
  }
}
