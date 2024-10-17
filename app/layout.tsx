import type { Metadata } from "next";
import Providers from "@/app/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mailfu",
  description: "Get AI-generated mails with one click",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/assets/mailfu-icon.svg" sizes="any" />
        <link rel="icon" href="/assets/mailfu-icon.ico" sizes="any" />

        <meta name="title" content="Mailfu - AI-generated mails" />
        <meta
          name="description"
          content="Get AI-generated mails with just one click, fast and efficient."
        />
        <meta
          name="keywords"
          content="AI mails, automated emails, email generator, Mailfu, AI email tool"
        />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Mailfu Team" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta property="og:title" content="Mailfu - AI-Generated Mails" />
        <meta
          property="og:description"
          content="Get AI-generated emails effortlessly with Mailfu."
        />
        <meta property="og:image" content="/assets/mailfu-og-image.png" />
        <meta property="og:url" content="https://mailfu.in" />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Mailfu - AI-Generated Mails" />
        <meta
          name="twitter:description"
          content="Create AI-generated mails quickly with Mailfu."
        />
        <meta name="twitter:image" content="/assets/mailfu-twitter-image.png" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
