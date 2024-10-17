import { getUserByEmail } from "@/data/user";
import { sendResetPasswordEmail } from "@/utils/reset-password-mailer";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const { email } = data;

  const existingUser = await getUserByEmail(email);
  if (!existingUser) {
    return NextResponse.json({
      status: 400,
      message: "Error processing the request ",
    });
  }
  if (existingUser && !existingUser.emailVerified) {
    return NextResponse.json({
      status: 400,
      message: "Please Verify your email first ",
    });
  }
  const resetPassword = await sendResetPasswordEmail(email);
  if (!resetPassword) {
    return NextResponse.json({
      status: 400,
      message: "There was an error Sending you the email",
    });
  }
  return NextResponse.json({
    status: 200,
    message: "Password Reset email has been sent ",
  });
}
