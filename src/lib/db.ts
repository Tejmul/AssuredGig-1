import { PrismaClient } from "@prisma/client";

declare global {
  var cachedPrisma: PrismaClient;
}

let prisma: PrismaClient;

try {
  if (process.env.NODE_ENV === "production") {
    prisma = new PrismaClient({
      log: ["error"],
      datasources: {
        db: {
          url: process.env.DATABASE_URL
        },
      },
    });
  } else {
    if (!global.cachedPrisma) {
      global.cachedPrisma = new PrismaClient({
        log: ["query", "error", "warn"],
        datasources: {
          db: {
            url: process.env.DATABASE_URL
          },
        },
      });
    }
    prisma = global.cachedPrisma;
  }
} catch (error) {
  console.error("Failed to initialize Prisma client:", error);
  throw new Error("Database connection failed. Please check your DATABASE_URL environment variable.");
}

export const db = prisma;

// Handle cleanup
process.on("beforeExit", async () => {
  await prisma.$disconnect();
}); 