import { User } from '@/types/user';

const DEFAULT_USER: User = {
  email: process.env.NEXT_PUBLIC_ADMIN_EMAIL || '',
  password: process.env.NEXT_PUBLIC_ADMIN_PASSWORD || '',
};

export function authenticate(email: string, password: string): boolean {
  // Log authentication attempt (without sensitive data)
  console.log('Authentication attempt:', {
    hasEmail: !!email,
    hasPassword: !!password,
    hasExpectedEmail: !!DEFAULT_USER.email,
    hasExpectedPassword: !!DEFAULT_USER.password
  });

  // Check if environment variables are set
  if (!DEFAULT_USER.email || !DEFAULT_USER.password) {
    console.error('Missing environment variables for authentication');
    return false;
  }

  // Check if provided credentials match
  const isValid = email === DEFAULT_USER.email && password === DEFAULT_USER.password;
  
  if (!isValid) {
    console.log('Authentication failed - credentials do not match');
  }

  return isValid;
} 