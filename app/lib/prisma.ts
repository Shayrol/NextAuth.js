import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;

// 웹상에서 데이터를 수동으로 조작할 수 있는 툴을 확인 하려면 yarn prisma studio
// Next.js에서 Prisma를 사용할 수 있게 하는 SDK 이다.
