import { NextRequest, NextResponse } from "next/server";
import { sendMail } from "@/utils/mailer";
import { getGroqChatCompletion } from "@/utils/generator";

export async function POST(req: NextRequest, res: NextResponse) {
  const Models = [
    "llama-3.1-70b-versatile",
    "llama-3.2-11b-text-preview",

    "llama-3.2-90b-text-preview",
  ];
  try {
    const { message, senderEmail, emails, senderName } = await req.json();
    if (!message || !senderEmail || !emails || !senderName) {
      return NextResponse.json({ status: 404, message: "connection failed" });
    }

    const sentEmails: { email: string; subject: string; body: string }[] = [];
    const failedEmails: string[] = [];

    await Promise.all(
      emails.map(async (email: string, index: number) => {
        try {
          const modelIndex = index % Models.length;
          const Model = Models[modelIndex];

          const generatedString = await getGroqChatCompletion(
            email,
            senderEmail,
            message,
            senderName,
            Model
          );
          const generatedEmail = JSON.parse(generatedString);

          const bodyContent =
            typeof generatedEmail.body === "string"
              ? generatedEmail.body
              : JSON.stringify(generatedEmail.body);

          const result = await sendMail(
            email,
            senderEmail,
            generatedEmail.subject,
            bodyContent
          );

          if (result?.accepted?.includes(email)) {
            sentEmails.push({
              email,
              subject: generatedEmail.subject,
              body: bodyContent,
            });
          } else {
            failedEmails.push(email);
          }
        } catch (error) {
          failedEmails.push(email);
        }
      })
    );

    return NextResponse.json({
      status: 200,
      message: "Emails processed",
      sentEmails,
      failedEmails,
    });
  } catch (error) {
    return NextResponse.json({ status: 500, message: "Internal Server Error" });
  }
}
