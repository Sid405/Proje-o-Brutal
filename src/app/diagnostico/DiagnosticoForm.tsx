"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { calculateDiagnostic } from "@/utils/calculations";
import { DiagnosticInput } from "@/types";

interface Props { userId: string; }

const fields = [
  { key: "monthly_income" as const, label: "Renda mensal", hint: "Quanto você recebe por mês", prefix: "R$", min: 0, max: 999999, step: 100 },
  { key: "monthly_impulsive_spending" as const, label: "Gasto impulsivo mensal", hint: "IFood, streaming desnecessário, compras por impulso...", prefix: "R$", min: 0, max: 99999, step: 50 },
  { key: "hours_wasted_per_day" as const, label: "Horas desperdiçadas por dia", hint: "Redes sociais sem propósito, procrastinação...", suffix: "horas", min: 0, max: 16, step: 0.5 },
  { key: "hours_studying_per_day" as const, label: "Horas estudando por dia", hint: "Cursos, livros, conteúdo que agrega...", suffix: "horas", min: 0, max: 16, step: 0.5 },
];

export default function DiagnosticoForm({ userId }: Props) {
  const router = useRouter();
  const [values, setValues] = useState<DiagnosticInput>({
    monthly_income: 0, monthly_impulsive_spending: 0,
    hours_wasted_per_day: 0, hours_studying_per_day: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = calculateDiagnostic(values);
    const supabase = createClient();
    const { data, error: dbError } = await supabase
      .from("diagnostics").insert({ user_id: userId, ...result }).select("id").single();
    if (dbError || !data) { setError("Erro ao salvar. Tente novamente."); setLoading(false); return; }
    router.push(`/resultado?id=${data.id}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {fields.map((field, i) => (
        <div key={field.key} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}>
          <label className="block mb-2">
            <span className="font-mono text-xs text-[#F5F0E8]/50 uppercase tracking-wider">
              {String(i + 1).padStart(2, "0")} — {field.label}
            </span>
          </label>
          <p className="text-[#F5F0E8]/40 text-sm mb-3">{field.hint}</p>
          <div className="flex items-center gap-3">
            {field.prefix && <span className="font-mono text-[#FF6B35] text-sm">{field.prefix}</span>}
            <input
              type="number" min={field.min} max={field.max} step={field.step}
              value={values[field.key]}
              onChange={(e) => setValues(prev => ({ ...prev, [field.key]: parseFloat(e.target.value) || 0 }))}
              className="flex-1 bg-[#1A1A1A] border border-white/10 text-[#F5F0E8] px-4 py-3 rounded-sm focus:outline-none focus:border-[#E63946] transition-colors font-mono text-lg"
            />
            {field.suffix && <span className="font-mono text-[#F5F0E8]/40 text-sm">{field.suffix}</span>}
          </div>
        </div>
      ))}
      {error && <p className="text-[#E63946] font-mono text-sm">{error}</p>}
      <button type="submit" disabled={loading || values.monthly_income === 0}
        className="w-full bg-[#E63946] text-white font-mono text-sm uppercase tracking-wider py-4 hover:bg-[#FF6B35] transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
        {loading ? "Calculando..." : "Ver minha projeção brutal →"}
      </button>
    </form>
  );
}
