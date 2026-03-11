import { NextRequest, NextResponse } from 'next/server';
import { signIn } from '@/lib/queries/auth';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });

  const { email, password } = body as Record<string, string>;

  if (!email?.trim() || !password) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
  }

  try {
    const { user, sessionToken } = await signIn({ email, password });

    const res = NextResponse.json({ user });
    res.cookies.set('session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });
    return res;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Something went wrong.';
    return NextResponse.json({ error: msg }, { status: 401 });
  }
}
