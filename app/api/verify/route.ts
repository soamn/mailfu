import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db"; // Prisma client for database access
import { getVerificationTokenByToken } from "@/data/verification-token";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    const errorMessage = `
      <html>
      <head>
        <title>Verification Failed</title>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f8f9fa; color: #333; }
          .container { max-width: 600px; margin: 50px auto; text-align: center; padding: 20px; border-radius: 10px; background-color: #fff; box-shadow: 0 0 15px rgba(0,0,0,0.1); }
          h1 { color: #e74c3c; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Invalid Verification Link</h1>
          <p>It looks like your verification link is invalid . Please try again.</p>
        </div>
      </body>
      </html>
    `;
    return new NextResponse(errorMessage, {
      status: 400,
      headers: { "Content-Type": "text/html" },
    });
  }

  try {
    const existingToken = await getVerificationTokenByToken(token);
    if (!existingToken) {
      const errorMessage = `
      <html>
      <head>
      <title>User Not Found</title>
      <style>
      body { font-family: Arial, sans-serif; background-color: #f8f9fa; color: #333; }
      .container { max-width: 600px; margin: 50px auto; text-align: center; padding: 20px; border-radius: 10px; background-color: #fff; box-shadow: 0 0 15px rgba(0,0,0,0.1); }
      h1 { color: #e74c3c; }
          </style>
          </head>
        <body>
        <div class="container">
        <h1>User Not Found</h1>
        <p>We couldn't find a user associated with this email. Please check the link or contact support.</p>
        </div>
        </body>
        </html>
        `;
      return new NextResponse(errorMessage, {
        status: 400,
        headers: { "Content-Type": "text/html" },
      });
    }

    const hasExpired = existingToken.expires > new Date().getTime();

    if (hasExpired) {
      const errorMessage = `
      <html>
      <head>
      <title>User Not Found</title>
      <style>
      body { font-family: Arial, sans-serif; background-color: #f8f9fa; color: #333; }
      .container { max-width: 600px; margin: 50px auto; text-align: center; padding: 20px; border-radius: 10px; background-color: #fff; box-shadow: 0 0 15px rgba(0,0,0,0.1); }
      h1 { color: #e74c3c; }
          </style>
          </head>
        <body>
        <div class="container">
        <h1>Link Has expired</h1>
        <p>The Link you are trying to use has expired please Login again to get a new verification Link</p>
        </div>
        </body>
        </html>
        `;
      return new NextResponse(errorMessage, {
        status: 400,
        headers: { "Content-Type": "text/html" },
      });
    }

    await prisma.user.update({
      where: { email: existingToken.email },
      data: {
        emailVerified: new Date(),
      },
    });

    const successMessage = `
      <html>
      <head>
        <title>Email Verified</title>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f8f9fa; color: #333; }
          .container { max-width: 600px; margin: 50px auto; text-align: center; padding: 20px; border-radius: 10px; background-color: #fff; box-shadow: 0 0 15px rgba(0,0,0,0.1); }
          h1 { color: #2ecc71; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Email Verified!</h1>
          <p>Your email has been successfully verified. You can now log in to your account.</p>
        </div>
      </body>
      </html>
    `;
    return new NextResponse(successMessage, {
      status: 200,
      headers: { "Content-Type": "text/html" },
    });
  } catch (error) {
    console.error("Verification error:", error);
    const errorMessage = `
      <html>
      <head>
        <title>Internal Server Error</title>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f8f9fa; color: #333; }
          .container { max-width: 600px; margin: 50px auto; text-align: center; padding: 20px; border-radius: 10px; background-color: #fff; box-shadow: 0 0 15px rgba(0,0,0,0.1); }
          h1 { color: #e74c3c; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Internal Server Error</h1>
          <p>Something went wrong during verification. Please try again later.</p>
        </div>
      </body>
      </html>
    `;
    return new NextResponse(errorMessage, {
      status: 500,
      headers: { "Content-Type": "text/html" },
    });
  }
}
