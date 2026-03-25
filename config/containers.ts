import { PrismaUserRepository } from "@/adapters/repositories";
import { prisma } from "@/adapters/repositories";
import { RegisterUserUseCase } from "@/core/usecases/register-user";

const userRepository = new PrismaUserRepository(prisma);

export const container = {
  prisma,
  userRepository,
  registerUser: new RegisterUserUseCase(userRepository),
};
