import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/utils/vmailer";
import { getUserByEmail } from "@/data/user";
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, email, password } = data;
    const existingUser = await getUserByEmail(email);
    if (existingUser && !existingUser.emailVerified) {
      const vmail = await sendVerificationEmail(existingUser.email);
      if (!vmail) {
        return NextResponse.json({
          status: 400,
          message: "error sending Verifcation mail try again later",
        });
      }
      return NextResponse.json({
        status: 400,
        message:
          "User already exists Please Login After verifying Your email , ",
      });
    }
    if (existingUser && existingUser.emailVerified) {
      return NextResponse.json({
        status: 200,
        message: "Account Already exists ",
      });
    }
    const hashedpassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedpassword,
        emailVerified: null,
      },
    });
    if (user) {
      await sendVerificationEmail(user.email);
    }
    return NextResponse.json({
      status: 201,
      message: "A verification email has been sent",
    });
  } catch (error) {
    return NextResponse.json(
      { status: 500, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
