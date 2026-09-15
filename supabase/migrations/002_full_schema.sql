-- ╔══════════════════════════════════════════════════════╗
-- ║  Trading System Panel — Initial Schema              ║
-- ║  Supabase + PostgreSQL + RLS                        ║
-- ╚══════════════════════════════════════════════════════╝

-- ─── profiles ───
CREATE TABLE public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT,
  avatar_url  TEXT,
  timezone    TEXT DEFAULT 'Asia/Tehran',
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ─── trading_systems ───
CREATE TABLE public.trading_systems (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entry       TEXT,
  exit        TEXT,
  sizing      TEXT,
  stop_rule   TEXT,
  time_rule   TEXT,
  instruments TEXT,
  news_rule   TEXT,
  psych_rule  TEXT,
  updated_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.trading_systems ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own trading system"
  ON public.trading_systems FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own trading system"
  ON public.trading_systems FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trading system"
  ON public.trading_systems FOR UPDATE
  USING (auth.uid() = user_id);

-- ─── forbidden_items ───
CREATE TABLE public.forbidden_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  text        TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.forbidden_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own forbidden items"
  ON public.forbidden_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own forbidden items"
  ON public.forbidden_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own forbidden items"
  ON public.forbidden_items FOR DELETE
  USING (auth.uid() = user_id);

-- ─── journal_entries ───
CREATE TABLE public.journal_entries (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date                  DATE NOT NULL DEFAULT CURRENT_DATE,
  symbol                TEXT NOT NULL,
  outcome               TEXT CHECK (outcome IN ('win','loss','flat')) NOT NULL,
  r_value               NUMERIC(5,2),
  rule_adherence        BOOLEAN,
  decision_quality      TEXT CHECK (decision_quality IN ('good','bad')),
  execution             JSONB DEFAULT '{}',
  stress                SMALLINT CHECK (stress BETWEEN 1 AND 5),
  satisfaction          SMALLINT CHECK (satisfaction BETWEEN 1 AND 5),
  fatigue               SMALLINT CHECK (fatigue BETWEEN 1 AND 5),
  confidence_type       TEXT CHECK (confidence_type IN ('real','false')),
  greed                 BOOLEAN,
  fears                 TEXT[] DEFAULT '{}',
  forbidden_violated    UUID[] DEFAULT '{}',
  learning_type         TEXT CHECK (learning_type IN ('pattern','belief','stat','rule')),
  learning_note         TEXT,
  created_at            TIMESTAMPTZ DEFAULT now(),
  updated_at            TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_journal_user_date ON public.journal_entries(user_id, date DESC);

ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own journal entries"
  ON public.journal_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own journal entries"
  ON public.journal_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own journal entries"
  ON public.journal_entries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own journal entries"
  ON public.journal_entries FOR DELETE
  USING (auth.uid() = user_id);

-- ─── checklists ───
CREATE TABLE public.checklists (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  checklist_date  DATE NOT NULL DEFAULT CURRENT_DATE,
  checks          JSONB DEFAULT '{}',
  motivation      TEXT,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, checklist_date)
);

ALTER TABLE public.checklists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own checklists"
  ON public.checklists FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own checklists"
  ON public.checklists FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own checklists"
  ON public.checklists FOR UPDATE
  USING (auth.uid() = user_id);

-- ─── system_logs ───
CREATE TABLE public.system_logs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  log_date      DATE NOT NULL DEFAULT CURRENT_DATE,
  stability     SMALLINT CHECK (stability BETWEEN 1 AND 5),
  adaptability  SMALLINT CHECK (adaptability BETWEEN 1 AND 5),
  resilience    SMALLINT CHECK (resilience BETWEEN 1 AND 5),
  calm          SMALLINT CHECK (calm BETWEEN 1 AND 5),
  created_at    TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own system logs"
  ON public.system_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own system logs"
  ON public.system_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ─── updated_at trigger ───
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.trading_systems
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.journal_entries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.checklists
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();