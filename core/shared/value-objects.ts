import { BusinessRuleException } from "./errors";

// Value Objects live in core and depend only on domain errors/types.
// They are immutable and isolated from frameworks and infrastructure.
export class Email {
  private readonly value: string;

  constructor(value: string) {
    const normalized = value.trim().toLowerCase();
    if (!normalized.includes("@")) {
      throw new BusinessRuleException("Email must contain @");
    }
    this.value = normalized;
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }
}

export class UserId {
  private readonly value: string;

  constructor(value: string) {
    const normalized = value.trim();
    if (!normalized) {
      throw new BusinessRuleException("UserId cannot be empty");
    }
    this.value = normalized;
  }

  getValue(): string {
    return this.value;
  }

  equals(other: UserId): boolean {
    return this.value === other.value;
  }
}

export class Phone {
  private readonly value: string;

  constructor(value: string) {
    const normalized = value.trim();
    const basicPhoneRegex = /^\+?[0-9]{10,15}$/;

    if (!basicPhoneRegex.test(normalized)) {
      throw new BusinessRuleException("Phone has invalid format");
    }

    this.value = normalized;
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Phone): boolean {
    return this.value === other.value;
  }
}
