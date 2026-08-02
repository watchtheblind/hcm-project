export type UserRole = 'admin' | 'doctor' | 'nurse';

export interface UserDomain {
  id: number;
  email: string;
  role: UserRole;
  isActive: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
