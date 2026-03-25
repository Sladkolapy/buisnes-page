// Use case lives in core — it orchestrates domain objects through ports.
// No framework, ORM, or HTTP dependency is allowed here.
import { User, UserRole } from "../entities/user";
import { BusinessRuleException } from "../shared/errors";
import { Email, Phone, UserId } from "../shared/value-objects";
import { UserRepository } from "../ports/repositories";

// Stub interface for future BusinessProfile support.
// Will be replaced with a real port when the BusinessProfile entity is introduced.
export interface BusinessProfileRepository {
  createForUser(userId: UserId, role: UserRole): Promise<void>;
}

export interface RegisterUserInput {
  email?: string;
  phone?: string;
  role?: string;
}

export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly profileRepository?: BusinessProfileRepository,
  ) {}

  async execute({ email, phone, role }: RegisterUserInput): Promise<User> {
    const resolvedRole = this.resolveRole(role);

    const emailVO = email ? new Email(email) : null;
    const phoneVO = phone ? new Phone(phone) : null;

    if (!emailVO && !phoneVO) {
      throw new BusinessRuleException("Email or phone is required to register");
    }

    if (emailVO) {
      const emailTaken = await this.userRepository.exists(emailVO, undefined);
      if (emailTaken) {
        throw new BusinessRuleException("User with this email already exists");
      }
    }

    if (phoneVO) {
      const phoneTaken = await this.userRepository.exists(undefined, phoneVO);
      if (phoneTaken) {
        throw new BusinessRuleException("User with this phone already exists");
      }
    }

    const id = new UserId(crypto.randomUUID());
    const user = new User(id, emailVO, resolvedRole, phoneVO);

    await this.userRepository.save(user);

    if (
      (resolvedRole === UserRole.SOLO_MASTER ||
        resolvedRole === UserRole.BUSINESS_OWNER) &&
      this.profileRepository
    ) {
      // TODO: Replace stub with real BusinessProfile creation
      await this.profileRepository.createForUser(id, resolvedRole);
    }

    return user;
  }

  private resolveRole(role?: string): UserRole {
    const validRoles = Object.values(UserRole) as string[];

    if (!role) {
      return UserRole.CLIENT;
    }

    if (!validRoles.includes(role.toUpperCase())) {
      throw new BusinessRuleException(`Invalid role: ${role}`);
    }

    return role.toUpperCase() as UserRole;
  }
}
