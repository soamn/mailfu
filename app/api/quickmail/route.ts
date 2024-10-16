import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const { senderName, senderEmail, receiverEmail, receiverName, prompt } =
      data;

    const generatedEmail = await getGroqMessage(
      senderName,
      senderEmail,
      receiverEmail,
      receiverName,
      prompt
    );

    return NextResponse.json({
      status: 200,
      message: "Email generated successfully",
      generatedEmail,
    });
  } catch (error) {
    return NextResponse.json(
      { status: 500, message: "Error processing emails" },
      { status: 500 }
    );
  }
}

async function getGroqMessage(
  senderName: string,
  senderEmail: string,
  receiverEmail: string,
  receiverName: string,
  prompt: string
) {
  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `
        You are an AI that generates email content based on user input. The emails must be clean, simple, and formatted with minimal HTML, primarily using <br> tags for line breaks and very basic Gmail-compatible inline styling. Follow these guidelines:

1. Text Formatting with <br> Tags: Use <br> tags to create line breaks between paragraphs and sections. Avoid using <p> or other block-level tags for spacing.

2. Minimal Inline Styling: Use only basic inline styling (compatible with Gmail) such as font size, color, and simple text alignment. Avoid complex styles, background colors, or images.

3. Allowed HTML Tags:
   - <br> for line breaks.
   - <strong> or <b> for bold text.
   - <em> or <i> for italic text.
   - <a> for links, ensuring clear and simple formatting.
   - Avoid other tags like <div>, <p>, and table-based layouts.

4. Simple, Clean Styles:
   - Text color should default to black (#000000) or a Gmail-friendly color if specified.
   - Font size should be easy to read (e.g., 14px or 16px).
   - No background colors, borders, or gradients.

5. Plain Text Emphasis: Ensure the content is readable even without HTML formatting. Focus on clean, well-structured text that is easy to read.

6. No Complex Layouts or Interactivity: Avoid using images, tables, or JavaScript. Keep the layout as simple as possible, suitable for email clients.

7. Readable and Professional Content: Ensure the content is clear and professional, making it suitable for a wide audience across different devices and email clients.

The goal is to create well-formatted email content with minimal HTML and inline styling, primarily using <br> tags for formatting.

`,
      },
      {
        role: "user",
        content: `
Generate a professional email with the following details:
            From: ${senderName} (${senderEmail})
            To: ${receiverName} (${receiverEmail})
            Prompt: ${prompt}

            Please include a proper greeting using the receiver's name, and structure the email with an introduction, body, and conclusion. Ensure the content addresses the prompt provided.
                 `,
      },
    ],
    model: "llama-3.2-90b-text-preview",
  });

  return completion.choices[0]?.message?.content || "";
}
