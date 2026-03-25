import { PrismaUserRepository } from "@/adapters/repositories";
import { prisma } from "@/adapters/repositories";
import { RegisterUserUseCase } from "@/core/usecases/register-user";
import type { PrismaClient } from "@prisma/client";
import type { UserRepository } from "@/core/ports/repositories";

interface Container {
  prisma: PrismaClient;
  userRepository: UserRepository;
  registerUser: RegisterUserUseCase;
}

function createContainer(): Container {
  const userRepository = new PrismaUserRepository(prisma);
  return {
    prisma,
    userRepository,
    registerUser: new RegisterUserUseCase(userRepository),
  };
}

export const container: Container = createContainer();

export function getPrisma(): PrismaClient {
  return container.prisma;
}

export function getUserRepository(): UserRepository {
  return container.userRepository;
}

export function getRegisterUserUseCase(): RegisterUserUseCase {
  return container.registerUser;
}
