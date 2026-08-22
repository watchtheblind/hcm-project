import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

// Login no exige longitud mínima: contraseñas creadas antes de la regla
// de 8 caracteres deben seguir siendo válidas.
export class LoginDto {
  @ApiProperty({ example: 'admin@hcm.local', format: 'email' })
  @IsEmail({}, { message: 'Debe ser un correo válido' })
  email!: string;

  @ApiProperty({ example: 'ChangeMe123!' })
  @IsString()
  password!: string;
}
