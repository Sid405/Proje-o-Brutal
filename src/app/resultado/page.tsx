import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { generateDiagnosticReport } from "@/lib/openai";
import { Diagnostic, DiagnosticResult } from "@/types";
import { formatCurrency, formatNumber, getDisciplineLabel } from "@/utils/formatters";

interface Props { searchParams: Promise<{ id?: string }>; }

export default async function ResultadoPage({ searchParams }: Props) {
  const { id } = await searchParams;
  if (!id) redirect("/dashboard");

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: diagnostic } = await supabase
    .from("diagnostics").select("*").eq("id", id).eq("user_id", user.id).single();
  if (!diagnostic) notFound();

  const d = diagnostic as Diagnostic;
  const { label, color } = getDisciplineLabel(d.discipline_score);
  const aiReport = await generateDiagnosticReport(d as unknown as DiagnosticResult);
  const gap = d.projected_income_if_disciplined - d.projected_income_if_unchanged;

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8]">
      <header className="px-8 py-5 border-b border-white/5 flex items-center justify-between">
        <Link href="/dashboard" className="font-heading text-xl">Projeção Brutal</Link>
        <Link href="/diagnostico" className="font-mono text-xs text-[#F5F0E8]/40 hover:text-[#FF6B35] transition-colors">
          Novo diagnóstico →
        </Link>
      </header>

      <div className="max-w-3xl mx-auto px-8 py-12 space-y-12">
        {/* Score */}
        <section className="animate-fade-in-up text-center py-8 border border-white/5 rounded-sm">
          <p className="font-mono text-xs text-[#F5F0E8]/40 uppercase tracking-widest mb-4">Pontuação de disciplina</p>
          <p className={`font-heading text-8xl ${color}`}>{d.discipline_score}</p>
          <p className={`font-mono text-sm ${color} mt-2`}>{label}</p>
          <p className="text-[#F5F0E8]/30 font-mono text-xs mt-1">de 100 pontos possíveis</p>
        </section>

        {/* Stats grid */}
        <section className="grid grid-cols-2 gap-4">
          <StatCard label="Horas desperdiçadas em 5 anos" value={`${formatNumber(d.five_year_wasted_hours)}h`} accent="red" detail="Horas que não voltam" />
          <StatCard label="Dinheiro jogado fora em 5 anos" value={formatCurrency(d.five_year_money_wasted)} accent="red" detail="Em gastos impulsivos" />
          <StatCard label="Renda em 5 anos SEM mudança" value={`${formatCurrency(d.projected_income_if_unchanged)}/mês`} accent="gray" detail="Crescimento de 2% ao ano" />
          <StatCard label="Renda em 5 anos COM disciplina" value={`${formatCurrency(d.projected_income_if_disciplined)}/mês`} accent="orange" detail="Crescimento de 10% ao ano" />
        </section>

        {/* Gap */}
        <section className="bg-[#1A1A1A] border border-[#FF6B35]/20 rounded-sm p-8 text-center">
          <p className="font-mono text-xs text-[#F5F0E8]/40 uppercase tracking-widest mb-4">O custo da inércia — por mês no 5º ano</p>
          <p className="font-heading text-5xl text-[#FF6B35]">{formatCurrency(gap)}</p>
          <p className="text-[#F5F0E8]/40 text-sm mt-2">é o que você deixa de ganhar por não mudar nada hoje</p>
        </section>

        {/* AI Report */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-white/5" />
            <p className="font-mono text-xs text-[#E63946] uppercase tracking-widest">Análise da IA</p>
            <div className="h-px flex-1 bg-white/5" />
          </div>
          <div className="bg-[#111] border border-white/5 rounded-sm p-8 space-y-4">
            {aiReport.split("\n\n").map((paragraph, i) => (
              <p key={i} className="text-[#F5F0E8]/80 leading-relaxed text-sm">
                {paragraph.replace(/\*\*(.*?)\*\*/g, "$1")}
              </p>
            ))}
          </div>
          <p className="text-[#F5F0E8]/20 font-mono text-xs mt-3 text-center">
            {process.env.OPENAI_API_KEY ? "Gerado por GPT-4o" : "Mock — configure OPENAI_API_KEY para análise real"}
          </p>
        </section>

        <div className="text-center pb-8">
          <Link href="/diagnostico" className="inline-block bg-[#E63946] text-white font-mono text-sm uppercase tracking-wider px-8 py-4 hover:bg-[#FF6B35] transition-colors">
            Refazer diagnóstico
          </Link>
        </div>
      </div>
    </main>
  );
}

function StatCard({ label, value, accent, detail }: { label: string; value: string; accent: "red" | "orange" | "gray"; detail: string }) {
  const accentMap = { red: "text-[#E63946]", orange: "text-[#FF6B35]", gray: "text-[#F5F0E8]/60" };
  return (
    <div className="bg-[#1A1A1A] border border-white/5 rounded-sm p-6">
      <p className="font-mono text-xs text-[#F5F0E8]/40 uppercase tracking-wider mb-3 leading-relaxed">{label}</p>
      <p className={`font-heading text-2xl ${accentMap[accent]} mb-1`}>{value}</p>
      <p className="font-mono text-xs text-[#F5F0E8]/20">{detail}</p>
    </div>
  );
}
