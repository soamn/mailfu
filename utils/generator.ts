import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function getGroqChatCompletion(
  email: string,
  senderEmail: string,
  message: string,
  senderName: string,
  Model: string
) {
  console.log(Model);
  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `
          You are an AI tasked with generating email content based on user input. Your goal is to produce a JSON object that contains two fields: 'subject' and 'body'. Follow the rules strictly to avoid JSON parsing errors.
    
          Rules:
          1. The response **must** be a valid JSON object.
          2. The JSON object **must contain only** two fields: 'subject' and 'body'.
          3. Do **not** include any explanations, comments, or additional text outside the JSON object.
          4. The 'subject' should be a concise, relevant title for the email, related to the provided prompt.
          5. The 'body' should be the main email content, written as a plain text string with appropriate context based on the input.
          6. **Do not use** HTML tags, special formatting, or markdown in the body.
          7. Use '\\n' for line breaks in the body.
          8. Ensure **all quotes, slashes, and special characters** are properly escaped to avoid JSON parsing errors.
          9. The JSON object should always be formatted correctly, ensuring valid quotes around keys and strings.
    
          Example of correct output format:
          {
            "subject": "Meeting Reminder",
            "body": "Dear colleague,\\n\\nThis is a reminder about our meeting tomorrow at 2 PM.\\n\\nBest regards,\\nYour Name"
          }
        `,
      },
      {
        role: "user",
        content: `
          Generate a JSON object with 'subject' and 'body' for an email from ${senderName} (${senderEmail}) to ${email}.
          
          The email should be based on the following prompt: ${message}
          
          Make sure to strictly follow all the rules mentioned in the system message, especially those concerning JSON formatting, escaping characters, and ensuring valid output.
        `,
      },
    ],
    model: `${Model}`,
  });

  const content = completion.choices[0]?.message?.content || "";

  return content;
}
