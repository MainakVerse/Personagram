-- ============================================================
-- Personagram – Database Schema
-- Run this once against your Neon database to set up tables.
-- ============================================================

-- Users table: stores credentials and basic profile data.
-- Passwords are stored as bcrypt hashes (never plaintext).
CREATE TABLE IF NOT EXISTS users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT NOT NULL UNIQUE,
  name        TEXT NOT NULL,
  password_hash TEXT NOT NULL,           -- bcrypt hash
  avatar_url  TEXT,
  username    TEXT UNIQUE,
  plan        TEXT NOT NULL DEFAULT 'free'
                CHECK (plan IN ('free', 'creator', 'pro')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Sessions table: server-side session tokens.
-- Each row represents one active login.
CREATE TABLE IF NOT EXISTS sessions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token       TEXT NOT NULL UNIQUE,       -- random 64-char hex
  expires_at  TIMESTAMPTZ NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast session lookup by token
CREATE INDEX IF NOT EXISTS sessions_token_idx ON sessions(token);

-- Index for fast lookup of active sessions per user
CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions(user_id);

-- Auto-update updated_at on users row change
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS users_set_updated_at ON users;
CREATE TRIGGER users_set_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
