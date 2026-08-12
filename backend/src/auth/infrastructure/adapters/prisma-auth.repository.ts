import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import {
  AuthRepositoryPort,
  type CreateUserInput,
} from '../../domain/ports/auth-repository.port';
import type { UserDomain, UserRole } from '../../domain/user.domain';

type PrismaUserRow = Omit<UserDomain, 'role'> & {
  role: string;
  passwordHash: string;
};

@Injectable()
export class PrismaAuthRepository extends AuthRepositoryPort {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  private toDomain(user: PrismaUserRow): UserDomain {
    const { passwordHash, ...safe } = user;
    return { ...safe, role: user.role as UserRole };
  }

  async findByEmail(email: string): Promise<UserDomain | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user ? this.toDomain(user) : null;
  }

  async findCredentialsByEmail(
    email: string,
  ): Promise<(UserDomain & { passwordHash: string }) | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    return { ...this.toDomain(user), passwordHash: user.passwordHash };
  }

  async create(input: CreateUserInput): Promise<UserDomain> {
    const user = await this.prisma.user.create({ data: input });
    return this.toDomain(user);
  }
}
