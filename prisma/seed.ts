import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, UserRole, UserStatus } from "@prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main(): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!adminEmail) {
    throw new Error("ADMIN_EMAIL is required in .env");
  }

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      blockReason: null,
      blockedBy: null,
      phone: "+79990000001",
    },
    create: {
      email: adminEmail,
      phone: "+79990000001",
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
    },
  });

  await prisma.user.upsert({
    where: { email: "client@beauty-platform.com" },
    update: {
      role: UserRole.CLIENT,
      status: UserStatus.ACTIVE,
      blockReason: null,
      blockedBy: null,
      phone: "+79990000002",
    },
    create: {
      email: "client@beauty-platform.com",
      phone: "+79990000002",
      role: UserRole.CLIENT,
      status: UserStatus.ACTIVE,
    },
  });

  await prisma.user.upsert({
    where: { email: "master@beauty-platform.com" },
    update: {
      role: UserRole.SOLO_MASTER,
      status: UserStatus.ACTIVE,
      blockReason: null,
      blockedBy: null,
      phone: "+79990000003",
    },
    create: {
      email: "master@beauty-platform.com",
      phone: "+79990000003",
      role: UserRole.SOLO_MASTER,
      status: UserStatus.ACTIVE,
    },
  });

  await prisma.user.upsert({
    where: { email: "owner@beauty-platform.com" },
    update: {
      role: UserRole.BUSINESS_OWNER,
      status: UserStatus.BLOCKED,
      blockReason: "Seed test blocked user",
      blockedBy: admin.id,
      phone: "+79990000004",
    },
    create: {
      email: "owner@beauty-platform.com",
      phone: "+79990000004",
      role: UserRole.BUSINESS_OWNER,
      status: UserStatus.BLOCKED,
      blockReason: "Seed test blocked user",
      blockedBy: admin.id,
    },
  });

  await prisma.user.upsert({
    where: { phone: "+79990000005" },
    update: {
      email: null,
      role: UserRole.CLIENT,
      status: UserStatus.ACTIVE,
      blockReason: null,
      blockedBy: null,
    },
    create: {
      email: null,
      phone: "+79990000005",
      role: UserRole.CLIENT,
      status: UserStatus.ACTIVE,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
