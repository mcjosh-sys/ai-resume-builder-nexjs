import { env } from "@/env";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "./generated/prisma";

declare global {
    var prisma: PrismaClient | undefined;
}

const adapter = new PrismaNeon({
    connectionString: env.DATABASE_URL
});

export const prisma = global.prisma || new PrismaClient({
    adapter,
    log: process.env.NODE_ENV !== "production"
        ? ["query", "error", "warn"]
        : ["error"],
});

if (process.env.NODE_ENV !== "production") global.prisma = prisma;


