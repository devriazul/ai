import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    
    console.log('Login attempt:', {
      providedEmail: email,
      providedPassword: password ? '***' : 'missing',
      expectedEmail: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
      hasExpectedPassword: !!process.env.NEXT_PUBLIC_ADMIN_PASSWORD
    });

    if (authenticate(email, password)) {
      console.log('Login successful');
      return NextResponse.json({ success: true });
    }
    
    console.log('Login failed - invalid credentials');
    return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
} 