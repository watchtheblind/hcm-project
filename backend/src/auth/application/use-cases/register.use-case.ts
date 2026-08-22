import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthRepositoryPort } from '../../domain/ports/auth-repository.port';
import { DEFAULT_USER_ROLE } from '../../domain/user.domain';
import type { UserDomain } from '../../domain/user.domain';

@Injectable()
export class RegisterUseCase {
  constructor(
    private readonly authRepository: AuthRepositoryPort,
    private readonly jwtService: JwtService,
  ) {}

  async execute(dto: {
    email: string;
    password: string;
  }): Promise<{ user: UserDomain; token: string }> {
    const existing = await this.authRepository.findByEmail(dto.email);
    if (existing) {
      throw new Error('Email ya registrado');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    // El rol nunca viene del cliente: se asigna el default del dominio.
    const user = await this.authRepository.create({
      email: dto.email,
      passwordHash,
      role: DEFAULT_USER_ROLE,
    });

    const token = this.jwtService.sign({
      sub: String(user.id),
      email: user.email,
      role: user.role,
    });

    return { user, token };
  }
}
