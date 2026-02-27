-- ============================================================
-- Projeção Brutal — Migrations SQL do Supabase
-- Execute no SQL Editor do Supabase Dashboard
-- ============================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  email      TEXT NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuário vê próprio perfil" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Usuário atualiza próprio perfil" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, email) VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TABLE IF NOT EXISTS public.diagnostics (
  id                              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at                      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  monthly_income                  NUMERIC(12, 2) NOT NULL,
  monthly_impulsive_spending      NUMERIC(12, 2) NOT NULL,
  hours_wasted_per_day            NUMERIC(4, 1)  NOT NULL,
  hours_studying_per_day          NUMERIC(4, 1)  NOT NULL,
  discipline_score                INTEGER        NOT NULL CHECK (discipline_score BETWEEN 0 AND 100),
  five_year_wasted_hours          NUMERIC(10, 0) NOT NULL,
  five_year_money_wasted          NUMERIC(14, 2) NOT NULL,
  projected_income_if_unchanged   NUMERIC(14, 2) NOT NULL,
  projected_income_if_disciplined NUMERIC(14, 2) NOT NULL
);

CREATE INDEX IF NOT EXISTS diagnostics_user_id_idx ON public.diagnostics(user_id);
ALTER TABLE public.diagnostics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuário lê próprios diagnósticos" ON public.diagnostics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuário insere próprio diagnóstico" ON public.diagnostics FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuário deleta próprio diagnóstico" ON public.diagnostics FOR DELETE USING (auth.uid() = user_id);
