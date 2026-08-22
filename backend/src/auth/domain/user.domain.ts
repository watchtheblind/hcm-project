// Roles MVP del hospital. `admin` cubre Administrativo.
export const USER_ROLES = [
  'admin',
  'cirujano',
  'residente',
  'enfermeria',
] as const;

export type UserRole = (typeof USER_ROLES)[number];

// Rol asignado por defecto al registrarse. Los roles elevados se otorgan
// por seed o por un admin, nunca desde el payload del cliente.
export const DEFAULT_USER_ROLE: UserRole = 'enfermeria';

export interface UserDomain {
  id: bigint;
  email: string;
  role: UserRole;
  isActive: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
