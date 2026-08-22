import {
  Body,
  ConflictException,
  Controller,
  Get,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterUseCase } from '../application/use-cases/register.use-case';
import { LoginUseCase } from '../application/use-cases/login.use-case';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import type { AuthUser } from './decorators/current-user.decorator';

class RegisterDto {
  email: string;
  password: string;
}

class LoginDto {
  email: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
  ) {}

  @Public()
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    try {
      return await this.registerUseCase.execute(dto);
    } catch {
      throw new ConflictException('Email ya registrado');
    }
  }

  @Public()
  @Post('login')
  async login(@Body() dto: LoginDto) {
    try {
      return await this.loginUseCase.execute(dto);
    } catch {
      throw new UnauthorizedException('Credenciales inválidas');
    }
  }

  // Protegida por el JwtAuthGuard global. Devuelve el usuario decodificado
  // del token; el frontend la usa para validar la sesión.
  @Get('me')
  me(@CurrentUser() user: AuthUser) {
    return user;
  }
}
