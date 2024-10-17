import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { getUserByEmail } from "@/data/user";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const { password, token } = data;
  if (!password || !token) {
    return NextResponse.json({
      status: 400,
      message: "Missing token ",
    });
  }
  const existingToken = await getPasswordResetTokenByToken(token);
  if (!existingToken) {
    return NextResponse.json({
      status: 400,
      message: "Invalid Token",
    });
  }
  const hasExpired = existingToken.expires < new Date().getTime();
  if (hasExpired) {
    return NextResponse.json({
      status: 400,
      message: "Token Expired",
    });
  }
  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) {
    return NextResponse.json({
      status: 400,
      message: "Email does not exist",
    });
  }
  const hashedpassword = await bcrypt.hash(password, 10);
  await prisma.user.update({
    where: { id: existingUser.id },
    data: { password: hashedpassword },
  });

  return NextResponse.json({
    status: 200,
    message: "Password was reset Successfuly",
  });
}
