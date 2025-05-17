import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (authenticate(email, password)) {
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
} 