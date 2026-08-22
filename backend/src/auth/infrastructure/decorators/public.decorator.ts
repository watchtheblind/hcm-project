import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

// Marca rutas que el JwtAuthGuard global debe dejar pasar sin token.
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
