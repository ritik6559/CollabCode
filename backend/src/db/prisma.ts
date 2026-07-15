import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { DATABASE_URL } from "../utils/config";

// Prisma 7 is Rust-engine-free: the client talks to Postgres through a
// driver adapter (node-postgres here) instead of a bundled query engine.
const adapter = new PrismaPg({ connectionString: DATABASE_URL });

export const prisma = new PrismaClient({ adapter });

export const initDB = async () => {
    await prisma.$connect();
};
