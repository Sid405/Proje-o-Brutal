// ============================================================
// Dashboard — visão geral do usuário com histórico de diagnósticos
// ============================================================

import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Diagnostic } from "@/types";
import { formatCurrency, getDisciplineLabel } from "@/utils/formatters";

export default async function DashboardPage() {
  const supabase = await createClient();

  // Verifica autenticação (middleware também garante, mas dupla verificação no server)
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  // Busca histórico de diagnósticos do usuário
  const { data: diagnostics } = await supabase
    .from("diagnostics")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10);

  async function handleLogout() {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/auth/login");
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8]">
      {/* Header */}
      <header className="px-8 py-5 border-b border-white/5 flex items-center justify-between">
        <span className="font-heading text-xl">Projeção Brutal</span>
        <div className="flex items-center gap-6">
          <span className="font-mono text-xs text-[#F5F0E8]/40">{user.email}</span>
          <form action={handleLogout}>
            <button type="submit" className="font-mono text-xs text-[#F5F0E8]/40 hover:text-[#E63946] transition-colors">
              Sair
            </button>
          </form>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* CTA principal */}
        <div className="mb-12">
          <h1 className="font-heading text-4xl mb-3">Bom dia, realidade.</h1>
          <p className="text-[#F5F0E8]/50 mb-6">
            Faça um diagnóstico e descubra onde você está — e onde poderia estar.
          </p>
          <Link
            href="/diagnostico"
            className="inline-block bg-[#E63946] text-white font-mono text-sm uppercase tracking-wider px-6 py-3 hover:bg-[#FF6B35] transition-colors"
          >
            Novo diagnóstico →
          </Link>
        </div>

        {/* Histórico */}
        <section>
          <h2 className="font-mono text-xs text-[#F5F0E8]/40 uppercase tracking-widest mb-6">
            Histórico de diagnósticos
          </h2>

          {(!diagnostics || diagnostics.length === 0) ? (
            <div className="border border-white/5 rounded-sm p-12 text-center">
              <p className="text-[#F5F0E8]/30 font-mono text-sm">
                Nenhum diagnóstico ainda. Comece agora.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {diagnostics.map((d: Diagnostic) => {
                const { label, color } = getDisciplineLabel(d.discipline_score);
                return (
                  <Link
                    key={d.id}
                    href={`/resultado?id=${d.id}`}
                    className="flex items-center justify-between bg-[#1A1A1A] border border-white/5 px-6 py-4 hover:border-[#E63946]/30 transition-colors rounded-sm"
                  >
                    <div>
                      <p className="font-mono text-xs text-[#F5F0E8]/40 mb-1">
                        {new Date(d.created_at).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-[#F5F0E8]">
                        Renda: {formatCurrency(d.monthly_income)}/mês
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-mono text-sm font-bold ${color}`}>
                        {d.discipline_score}/100
                      </p>
                      <p className={`font-mono text-xs ${color} opacity-70`}>{label}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
