import {
  BusinessRuleException,
  UnauthorizedException,
} from "../shared/errors";
import { Email, Phone, UserId } from "../shared/value-objects";

// Domain entity in core has no dependency on Next.js, Prisma, React, or external SDKs.
// It contains business invariants and behavior only.
export enum UserRole {
  CLIENT = "CLIENT",
  SOLO_MASTER = "SOLO_MASTER",
  BUSINESS_OWNER = "BUSINESS_OWNER",
  ADMIN = "ADMIN",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
}

export class User {
  private readonly id: UserId;
  private readonly email: Email | null;
  private readonly role: UserRole;
  private readonly phone?: Phone;

  private status: UserStatus = UserStatus.ACTIVE;
  private blockReason: string | null = null;
  private blockedBy: UserId | null = null;

  constructor(id: UserId, email: Email | null, role: UserRole, phone?: Phone) {
    this.id = id;
    this.email = email;
    this.role = role;
    this.phone = phone;
  }

  block(reason: string, adminId: UserId): void {
    const normalizedReason = reason.trim();

    if (!normalizedReason) {
      throw new BusinessRuleException("Block reason is required");
    }

    if (this.role === UserRole.ADMIN) {
      throw new UnauthorizedException("Admin cannot be blocked");
    }

    if (this.id.equals(adminId)) {
      throw new UnauthorizedException("User cannot block self");
    }

    this.status = UserStatus.BLOCKED;
    this.blockReason = normalizedReason;
    this.blockedBy = adminId;
  }

  unblock(): void {
    this.status = UserStatus.ACTIVE;
    this.blockReason = null;
    this.blockedBy = null;
  }

  canMessage(otherUser: User): boolean {
    if (this.status === UserStatus.BLOCKED || otherUser.status === UserStatus.BLOCKED) {
      return false;
    }

    if (this.role === UserRole.ADMIN) {
      return true;
    }

    if (this.role === UserRole.CLIENT) {
      return (
        otherUser.role === UserRole.SOLO_MASTER ||
        otherUser.role === UserRole.BUSINESS_OWNER
      );
    }

    if (
      this.role === UserRole.SOLO_MASTER ||
      this.role === UserRole.BUSINESS_OWNER
    ) {
      return (
        otherUser.role === UserRole.SOLO_MASTER ||
        otherUser.role === UserRole.BUSINESS_OWNER ||
        otherUser.role === UserRole.ADMIN
      );
    }

    return false;
  }

  isBlocked(): boolean {
    return this.status === UserStatus.BLOCKED;
  }

  getBlockReason(): string | null {
    return this.blockReason;
  }

  getRole(): UserRole {
    return this.role;
  }

  getId(): UserId {
    return this.id;
  }

  getEmail(): Email | null {
    return this.email;
  }

  getPhone(): Phone | undefined {
    return this.phone;
  }

  getStatus(): UserStatus {
    return this.status;
  }

  getBlockedBy(): UserId | null {
    return this.blockedBy;
  }
}
