import { auth } from "@/auth";
import nodemailer from "nodemailer";

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

    const refresh_token = session.user.refresh_token;
    const access_token = session.user.access_token;
    if (!refresh_token || !access_token) {
      console.log("refresh Token expired");
      return;
    }

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAUTH2",
        user: session.user.email as string,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: refresh_token as string,
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
    console.log(error);
  }
}
