import { getVerificationTokenByEmail } from "@/data/verification-token";
import nodemailer from "nodemailer";
import prisma from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
export async function sendVerificationEmail(email: string) {
  const token = uuidv4();
  const expires = new Date().getTime() + 3600 + 1000 ;
  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await prisma.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const verificationToken = await prisma.verificationToken.create({
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
  const verificationLink = `${process.env.NEXTAUTH_URL}api/verify?token=${verificationToken.token}`;
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verification Mail sent from malfu",
      html: `<p>Click the link to verify your email:</p><a href=" ${verificationLink}">Link</a>`,
    });
    console.log("Verification email sent to:", email);
  } catch (error) {
    console.error(error);
  }
}
