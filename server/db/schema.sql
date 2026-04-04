-- ============================================================
-- FinFlow PostgreSQL Schema
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                   TEXT NOT NULL,
  email                  TEXT UNIQUE NOT NULL,
  password_hash          TEXT,
  budget                 NUMERIC(12, 2) DEFAULT 50000,
  avatar_url             TEXT,
  reset_token_hash       TEXT,
  reset_token_expires_at TIMESTAMPTZ,
  created_at             TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token_hash TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token_expires_at TIMESTAMPTZ;
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_lower ON users (LOWER(email));

CREATE TABLE IF NOT EXISTS auth_sessions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash  TEXT NOT NULL UNIQUE,
  expires_at  TIMESTAMPTZ NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_auth_sessions_user_id ON auth_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_expires_at ON auth_sessions(expires_at);

CREATE TABLE IF NOT EXISTS transactions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  amount      NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  type        TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category    TEXT NOT NULL,
  note        TEXT,
  date        DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);

CREATE TABLE IF NOT EXISTS alerts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  fingerprint TEXT NOT NULL,
  message     TEXT NOT NULL,
  title       TEXT NOT NULL,
  severity    TEXT CHECK (severity IN ('danger', 'warning', 'info')) DEFAULT 'info',
  is_read     BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, fingerprint)
);

ALTER TABLE alerts ADD COLUMN IF NOT EXISTS fingerprint TEXT;
UPDATE alerts SET fingerprint = md5(COALESCE(title, '') || '|' || COALESCE(message, '')) WHERE fingerprint IS NULL;
ALTER TABLE alerts ALTER COLUMN fingerprint SET NOT NULL;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'alerts_user_id_fingerprint_key'
  ) THEN
    ALTER TABLE alerts ADD CONSTRAINT alerts_user_id_fingerprint_key UNIQUE (user_id, fingerprint);
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS insights (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES users(id) ON DELETE CASCADE,
  message       TEXT NOT NULL,
  tag           TEXT,
  generated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_stats (
  user_id        UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  total_income   NUMERIC(12, 2) DEFAULT 0,
  total_expense  NUMERIC(12, 2) DEFAULT 0,
  personality    TEXT CHECK (personality IN ('saver', 'balanced', 'overspender', 'risky')),
  updated_at     TIMESTAMPTZ DEFAULT now()
);
