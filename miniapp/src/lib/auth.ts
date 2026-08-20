import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import type { User } from "@prisma/client";

export async function currentUser(): Promise<User | null> {
  const session = await getSession();
  if (!session) return null;
  return prisma.user.findUnique({ where: { id: session.userId } });
}

export async function requireTrainer(): Promise<User | null> {
  const user = await currentUser();
  if (!user || user.role !== "TRAINER") return null;
  return user;
}
