import { NextRequest, NextResponse } from 'next/server';
import { deleteSession } from '@/lib/queries/auth';

export async function POST(req: NextRequest) {
  const token = req.cookies.get('session')?.value;
  if (token) {
    await deleteSession(token).catch(() => {}); // best-effort
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.delete('session');
  return res;
}
