import prisma from "@/lib/db";

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await prisma.passwordResetToken.findFirst({
      where: { email },
    });
    return verificationToken;
  } catch {
    return null;
  }
};
export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const verificationToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });
    return verificationToken;
  } catch {
    return null;
  }
};
