import { sql } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';

const BCRYPT_ROUNDS = 12;
const SESSION_TTL_DAYS = 30;

export type User = {
  id: string;
  email: string;
  name: string;
  username: string | null;
  avatar_url: string | null;
  plan: 'free' | 'creator' | 'pro';
  created_at: string;
};

export type Session = {
  id: string;
  user_id: string;
  token: string;
  expires_at: string;
};

/* ── Sign Up ────────────────────────────────────────────── */

/**
 * Create a new user account.
 * Returns the created user and a fresh session token.
 * Throws if the email is already registered.
 */
export async function createUser(params: {
  name: string;
  email: string;
  password: string;
}): Promise<{ user: User; sessionToken: string }> {
  const { name, email, password } = params;

  // Check for existing account
  const existing = await sql`
    SELECT id FROM users WHERE email = LOWER(TRIM(${email})) LIMIT 1
  `;
  if (existing.length > 0) {
    throw new Error('An account with this email already exists.');
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

  const rows = await sql`
    INSERT INTO users (email, name, password_hash)
    VALUES (LOWER(TRIM(${email})), TRIM(${name}), ${passwordHash})
    RETURNING id, email, name, username, avatar_url, plan, created_at
  `;

  const user = rows[0] as User;
  const sessionToken = await createSession(user.id);

  return { user, sessionToken };
}

/* ── Sign In ────────────────────────────────────────────── */

/**
 * Verify credentials and return the user with a fresh session token.
 * Throws on invalid email or wrong password.
 */
export async function signIn(params: {
  email: string;
  password: string;
}): Promise<{ user: User; sessionToken: string }> {
  const { email, password } = params;

  const rows = await sql`
    SELECT id, email, name, username, avatar_url, plan, password_hash, created_at
    FROM users
    WHERE email = LOWER(TRIM(${email}))
    LIMIT 1
  `;

  if (rows.length === 0) {
    // Use constant-time failure to prevent email enumeration
    await bcrypt.compare(password, '$2b$12$invalidhashpaddingtomatchtime00');
    throw new Error('Invalid email or password.');
  }

  const row = rows[0] as User & { password_hash: string };
  const valid = await bcrypt.compare(password, row.password_hash);

  if (!valid) {
    throw new Error('Invalid email or password.');
  }

  const sessionToken = await createSession(row.id);

  const { password_hash: _, ...user } = row;
  return { user: user as User, sessionToken };
}

/* ── Session helpers ────────────────────────────────────── */

/**
 * Create a new session for a user. Returns the session token.
 */
async function createSession(userId: string): Promise<string> {
  const token = randomBytes(32).toString('hex');
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_TTL_DAYS);

  await sql`
    INSERT INTO sessions (user_id, token, expires_at)
    VALUES (${userId}, ${token}, ${expiresAt.toISOString()})
  `;

  return token;
}

/**
 * Resolve a session token to the owning user.
 * Returns null if the token is missing, expired, or invalid.
 */
export async function getUserBySessionToken(
  token: string
): Promise<User | null> {
  if (!token) return null;

  const rows = await sql`
    SELECT u.id, u.email, u.name, u.username, u.avatar_url, u.plan, u.created_at
    FROM sessions s
    JOIN users u ON u.id = s.user_id
    WHERE s.token = ${token}
      AND s.expires_at > NOW()
    LIMIT 1
  `;

  return rows.length > 0 ? (rows[0] as User) : null;
}

/**
 * Delete a session (sign out).
 */
export async function deleteSession(token: string): Promise<void> {
  await sql`DELETE FROM sessions WHERE token = ${token}`;
}

/**
 * Delete all sessions for a user (sign out everywhere).
 */
export async function deleteAllUserSessions(userId: string): Promise<void> {
  await sql`DELETE FROM sessions WHERE user_id = ${userId}`;
}
