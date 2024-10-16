import prisma from "@/lib/db";

export async function getUserByEmail(email: string) {
  const user = await prisma.user.findFirst({
    where: { email },
  });
  if (user) {
    
    return user;
  }
  return;
}
