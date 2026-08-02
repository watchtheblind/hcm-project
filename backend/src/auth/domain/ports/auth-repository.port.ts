import { UserDomain } from '../user.domain';

export interface CreateUserInput {
  email: string;
  passwordHash: string;
  role: 'admin' | 'doctor' | 'nurse';
}

export interface AuthRepositoryPort {
  findByEmail(email: string): Promise<UserDomain | null>;
  findCredentialsByEmail(
    email: string,
  ): Promise<(UserDomain & { passwordHash: string }) | null>;
  create(input: CreateUserInput): Promise<UserDomain>;
}
