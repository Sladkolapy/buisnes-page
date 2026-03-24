import {
  PrismaClient,
  User as PrismaUser,
  UserRole as PrismaUserRole,
  UserStatus as PrismaUserStatus,
} from "@prisma/client";

import { User, UserRole, UserStatus } from "@/core/entities/user";
import type { UserRepository } from "@/core/ports/repositories";
import { BusinessRuleException } from "@/core/shared/errors";
import { Email, Phone, UserId } from "@/core/shared/value-objects";

export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(user: User): Promise<void> {
    const id = user.getId().getValue();
    const email = user.getEmail()?.getValue() ?? null;
    const phone = user.getPhone()?.getValue() ?? null;
    const role = this.toPrismaRole(user.getRole());
    const status = this.toPrismaStatus(user.getStatus());
    const blockReason = user.getBlockReason();
    const blockedBy = user.getBlockedBy()?.getValue() ?? null;

    await this.prisma.user.upsert({
      where: { id },
      create: {
        id,
        email,
        phone,
        role,
        status,
        blockReason,
        blockedBy,
      },
      update: {
        email,
        phone,
        role,
        status,
        blockReason,
        blockedBy,
      },
    });
  }

  async findById(id: UserId): Promise<User | null> {
    const record = await this.prisma.user.findUnique({
      where: { id: id.getValue() },
    });

    if (!record) {
      return null;
    }

    return this.toEntity(record);
  }

  async findByEmail(email: Email): Promise<User | null> {
    const record = await this.prisma.user.findUnique({
      where: { email: email.getValue() },
    });

    if (!record) {
      return null;
    }

    return this.toEntity(record);
  }

  async findByRole(role: UserRole): Promise<User[]> {
    const records = await this.prisma.user.findMany({
      where: { role: this.toPrismaRole(role) },
      orderBy: { createdAt: "asc" },
    });

    return records.map((record) => this.toEntity(record));
  }

  private toEntity(record: PrismaUser): User {
    try {
      const userId = new UserId(record.id);
      const email = record.email === null ? null : new Email(record.email);
      const phone = record.phone === null ? undefined : new Phone(record.phone);

      const user = new User(userId, email, this.toDomainRole(record.role), phone);

      if (record.status === PrismaUserStatus.BLOCKED) {
        if (!record.blockReason || !record.blockedBy) {
          throw new BusinessRuleException(
            "Blocked user must have blockReason and blockedBy",
          );
        }

        user.block(record.blockReason, new UserId(record.blockedBy));
      }

      if (record.status === PrismaUserStatus.ACTIVE) {
        if (record.blockReason !== null || record.blockedBy !== null) {
          throw new BusinessRuleException(
            "Active user cannot have blockReason or blockedBy",
          );
        }
      }

      return user;
    } catch (error) {
      if (error instanceof BusinessRuleException) {
        throw error;
      }

      throw new BusinessRuleException(
        `Invalid user data from database: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );
    }
  }

  private toPrismaRole(role: UserRole): PrismaUserRole {
    switch (role) {
      case UserRole.CLIENT:
        return PrismaUserRole.CLIENT;
      case UserRole.SOLO_MASTER:
        return PrismaUserRole.SOLO_MASTER;
      case UserRole.BUSINESS_OWNER:
        return PrismaUserRole.BUSINESS_OWNER;
      case UserRole.ADMIN:
        return PrismaUserRole.ADMIN;
    }
  }

  private toDomainRole(role: PrismaUserRole): UserRole {
    switch (role) {
      case PrismaUserRole.CLIENT:
        return UserRole.CLIENT;
      case PrismaUserRole.SOLO_MASTER:
        return UserRole.SOLO_MASTER;
      case PrismaUserRole.BUSINESS_OWNER:
        return UserRole.BUSINESS_OWNER;
      case PrismaUserRole.ADMIN:
        return UserRole.ADMIN;
    }
  }

  private toPrismaStatus(status: UserStatus): PrismaUserStatus {
    switch (status) {
      case UserStatus.ACTIVE:
        return PrismaUserStatus.ACTIVE;
      case UserStatus.BLOCKED:
        return PrismaUserStatus.BLOCKED;
    }
  }
}
