import { User, UserRole } from "../entities/user";
import { Email, UserId } from "../shared/value-objects";

// Port is a pure domain contract and does not depend on ORM/database implementation.
export interface UserRepository {
  save(user: User): Promise<void>;
  findById(id: UserId): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  findByRole(role: UserRole): Promise<User[]>;
}
