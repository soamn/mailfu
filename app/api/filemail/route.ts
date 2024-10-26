import { NextRequest, NextResponse } from "next/server";
import { sendMail } from "@/utils/mailer";
import { getGroqChatCompletion } from "@/utils/generator";
import { mailLimiter } from "@/ratelimit.config";

interface EmailData {
  senderEmail: string;
  senderName: string;
  message: string;
  csvdata: string[];
}

interface EmailResult {
  email: string;
  subject: string;
  body: string;
}

export async function POST(req: NextRequest) {
  try {
    const { senderEmail, senderName, message, csvdata }: EmailData =
      await req.json();

    const ratelimit = await mailLimiter.limit(senderEmail);
    if (!ratelimit.success) {
      return NextResponse.json(
        { status: 429, message: "Too many requests , please wait for a while" },
        { status: 429 }
      );
    }

    const sentEmails: EmailResult[] = [];
    const failedEmails: string[] = [];

    const Models = [
      "llama-3.1-70b-versatile",
      "llama-3.2-11b-text-preview",
      "llama-3.2-90b-text-preview",
    ];

    for (let i = 1; i < csvdata.length; i++) {
      const email = csvdata[i][0];
      const modelIndex = i % Models.length;
      const Model = Models[modelIndex];

      try {
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
    }

    return NextResponse.json({
      status: 200,
      sentEmails,
      failedEmails,
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
    });
  }
}
