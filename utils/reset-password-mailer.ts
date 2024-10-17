import nodemailer from "nodemailer";
import prisma from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { getPasswordResetTokenByEmail } from "@/data/password-reset-token";

export async function sendResetPasswordEmail(email: string) {
  const token = uuidv4();

  const expires = new Date().getTime() + 12 * 60 * 60 * 1000;
  const existingToken = await getPasswordResetTokenByEmail(email);

  if (existingToken) {
    await prisma.passwordResetToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const passwordResetToken = await prisma.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const ResetLink = `${process.env.NEXTAUTH_URL}auth/new-password?token=${passwordResetToken.token}`;
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Password Mail sent from malfu",
      html: `<p>Click the link create a new password for your email:</p><a href=" ${ResetLink}">Link</a>`,
    });
    return true;
  } catch {
    return null;
  }
}
