import { auth } from "@/auth";
import nodemailer from "nodemailer";
import prisma from "@/lib/db";

export async function sendMail(
  email: string,
  senderEmail: string,
  subject: string,
  message: string
) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return;
    }

    const account = await prisma.account.findFirst({
      where: { userId: session.user.id },
    });

    if (!account || !account.refresh_token || !account.access_token) {
      return;
    }

    const refresh_token = account.refresh_token;
    const access_token = account.access_token;

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAUTH2",
        user: session.user.email as string,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: refresh_token as string,
        accessToken: access_token as string,
      },
    });

    const mailOptions = {
      from: senderEmail as string,
      to: email,
      subject: subject,
      text: message,
    };

   
    const result = await transport.sendMail(mailOptions);

    return result;
  } catch (error) {
    console.error("Error sending email:", error);
    return;
  }
}
