import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/lib/queries/auth';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });

  const { name, email, password } = body as Record<string, string>;

  if (!name?.trim() || !email?.trim() || !password) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
  }

  try {
    const { user, sessionToken } = await createUser({ name, email, password });

    const res = NextResponse.json({ user }, { status: 201 });
    res.cookies.set('session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });
    return res;
  } catch (err: unknown) {
    
    const msg = err instanceof Error ? err.message : 'Something went wrong.';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
