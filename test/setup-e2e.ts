import { config } from "dotenv"

import { PrismaClient } from "@prisma/client";
import { randomUUID } from "node:crypto";
import { execSync } from "node:child_process";
import { DomainEvents } from "@/core/events/domain-events";
import { Redis } from "ioredis";
import { envSchema } from "@/infra/env/env";

config({ path: '.env', override: true })
config({ path: '.env.test', override: true })

const env = process.env

const prisma = new PrismaClient();
// @ts-ignore
const redis = new Redis({
  db: env.REDIS_BD,
  port: env.REDIS_PORT, 
  host: env.REDIS_HOST
})


function generateUniqueDatabaseURL(schemaId: string) {
  if (!env.DATABASE_URL) {
    throw new Error("Please provider a DATABASE_URL environment variable");
  }

  const url = new URL(env.DATABASE_URL);

  url.searchParams.set("schema", schemaId);

  return url.toString();
}

const schemaId = randomUUID();

beforeAll(async () => {
  const databaseURL = generateUniqueDatabaseURL(schemaId);

  env.DATABASE_URL = databaseURL;

  DomainEvents.shouldRun = false

  await redis.flushdb()

  execSync("npx prisma migrate deploy");
});

afterAll(async () => {
  // await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);
  await prisma.$disconnect();
});
