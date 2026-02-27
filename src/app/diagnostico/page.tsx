import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DiagnosticoForm from "./DiagnosticoForm";

export default async function DiagnosticoPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8]">
      <header className="px-8 py-5 border-b border-white/5">
        <span className="font-heading text-xl">Projeção Brutal</span>
      </header>
      <div className="max-w-2xl mx-auto px-8 py-12">
        <div className="mb-10 animate-fade-in-up">
          <p className="font-mono text-xs text-[#E63946] uppercase tracking-widest mb-3">Diagnóstico</p>
          <h1 className="font-heading text-4xl mb-3">Sua situação atual</h1>
          <p className="text-[#F5F0E8]/50">Responda honestamente. Os números vão falar por si só.</p>
        </div>
        <DiagnosticoForm userId={user.id} />
      </div>
    </main>
  );
}
