import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { getUserByEmail } from "./data/user";

const authConfig = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          scope: ["openid email profile", "https://mail.google.com/"].join(" "),
          access_type: "offline",
          prompt: "select_account",
        },
      },
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "user@example.com",
        },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (
          typeof credentials?.email !== "string" ||
          typeof credentials?.password !== "string" ||
          !credentials.email ||
          !credentials.password
        ) {
          return null;
        }

        const existingUser = await getUserByEmail(credentials.email);

        if (!existingUser || !existingUser.password) {
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          existingUser.password
        );

        if (!isValid) {
          return null;
        }

       
        if (!existingUser.emailVerified) {
          await fetch(`${process.env.NEXTAUTH_URL}/api/register`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: existingUser.name,
              email: existingUser.email,
              password: existingUser.password,
            }),
          });

          return null;
        }

        const userData = {
          id: existingUser.id.toString(),
          name: existingUser.name,
          email: existingUser.email,
          image: existingUser.image,
          
        };

        return userData;
      },
    }),
  ],

  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default authConfig;
