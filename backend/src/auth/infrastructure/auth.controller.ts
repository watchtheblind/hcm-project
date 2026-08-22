import {
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RegisterUseCase } from '../application/use-cases/register.use-case';
import { LoginUseCase } from '../application/use-cases/login.use-case';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import type { AuthUser } from './decorators/current-user.decorator';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
  ) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Registra un usuario',
    description:
      'Crea la cuenta con el rol por defecto (enfermeria). El rol nunca se acepta del cliente.',
  })
  @ApiResponse({ status: 201, description: 'Usuario creado, devuelve token' })
  @ApiResponse({ status: 400, description: 'Payload inválido' })
  @ApiResponse({ status: 409, description: 'Email ya registrado' })
  async register(@Body() dto: RegisterDto) {
    try {
      return await this.registerUseCase.execute(dto);
    } catch {
      throw new ConflictException('Email ya registrado');
    }
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Inicia sesión y devuelve un JWT (8h)' })
  @ApiResponse({ status: 200, description: '{ user, token }' })
  @ApiResponse({ status: 400, description: 'Payload inválido' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Usuario de la sesión actual (requiere JWT)' })
  @ApiResponse({ status: 200, description: '{ email, role, iat, exp }' })
  @ApiResponse({ status: 401, description: 'Token ausente o inválido' })
  me(@CurrentUser() user: AuthUser) {
    return user;
  }
}
