-- ============================================================
-- Migration: schema inicial do Projeção Brutal
-- Executar no Supabase SQL Editor ou via CLI
-- ============================================================

-- Extensão UUID (já habilitada por padrão no Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- Tabela: profiles
-- Criada automaticamente via trigger ao cadastrar usuário
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  email      TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Row Level Security: cada usuário acessa apenas o próprio perfil
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles: select próprio"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles: insert próprio"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Trigger: cria o perfil automaticamente após cadastro no auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ============================================================
-- Tabela: diagnostics
-- ============================================================
CREATE TABLE IF NOT EXISTS public.diagnostics (
  id                              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id                         UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  created_at                      TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Inputs do usuário
  monthly_income                  NUMERIC(12, 2) NOT NULL DEFAULT 0,
  monthly_impulsive_spending      NUMERIC(12, 2) NOT NULL DEFAULT 0,
  hours_wasted_per_day            NUMERIC(4, 1)  NOT NULL DEFAULT 0,
  hours_studying_per_day          NUMERIC(4, 1)  NOT NULL DEFAULT 0,

  -- Campos calculados
  discipline_score                SMALLINT       NOT NULL DEFAULT 0 CHECK (discipline_score BETWEEN 0 AND 100),
  five_year_wasted_hours          INTEGER        NOT NULL DEFAULT 0,
  five_year_money_wasted          NUMERIC(12, 2) NOT NULL DEFAULT 0,
  projected_income_if_unchanged   NUMERIC(12, 2) NOT NULL DEFAULT 0,
  projected_income_if_disciplined NUMERIC(12, 2) NOT NULL DEFAULT 0
);

-- Índice para buscar diagnósticos por usuário rapidamente
CREATE INDEX IF NOT EXISTS diagnostics_user_id_idx ON public.diagnostics (user_id);

-- Row Level Security
ALTER TABLE public.diagnostics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "diagnostics: select próprio"
  ON public.diagnostics FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "diagnostics: insert próprio"
  ON public.diagnostics FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "diagnostics: delete próprio"
  ON public.diagnostics FOR DELETE
  USING (auth.uid() = user_id);
