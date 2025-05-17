import { User } from '@/types/user';

const DEFAULT_USER: User = {
  email: process.env.NEXT_PUBLIC_ADMIN_EMAIL || '',
  password: process.env.NEXT_PUBLIC_ADMIN_PASSWORD || '',
};

export function authenticate(email: string, password: string): boolean {
  return email === DEFAULT_USER.email && password === DEFAULT_USER.password;
} 