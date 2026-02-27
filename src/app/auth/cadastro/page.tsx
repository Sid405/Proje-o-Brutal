"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function CadastroPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (password.length < 8) { setError("A senha deve ter pelo menos 8 caracteres."); setLoading(false); return; }
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) { setError(error.message); setLoading(false); return; }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="font-heading text-2xl text-[#F5F0E8]">Projeção Brutal</Link>
          <p className="text-[#F5F0E8]/40 font-mono text-xs mt-2 tracking-widest uppercase">Crie sua conta</p>
        </div>
        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="block font-mono text-xs text-[#F5F0E8]/50 uppercase tracking-wider mb-2">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="w-full bg-[#1A1A1A] border border-white/10 text-[#F5F0E8] px-4 py-3 rounded-sm focus:outline-none focus:border-[#E63946] transition-colors font-mono text-sm"
              placeholder="seu@email.com" />
          </div>
          <div>
            <label className="block font-mono text-xs text-[#F5F0E8]/50 uppercase tracking-wider mb-2">Senha</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
              className="w-full bg-[#1A1A1A] border border-white/10 text-[#F5F0E8] px-4 py-3 rounded-sm focus:outline-none focus:border-[#E63946] transition-colors font-mono text-sm"
              placeholder="mínimo 8 caracteres" />
          </div>
          {error && <p className="text-[#E63946] text-sm font-mono">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-[#E63946] text-white font-mono text-sm uppercase tracking-wider py-4 hover:bg-[#FF6B35] transition-colors disabled:opacity-50">
            {loading ? "Criando conta..." : "Criar conta grátis"}
          </button>
        </form>
        <p className="text-center text-[#F5F0E8]/40 text-sm mt-6">
          Já tem conta? <Link href="/auth/login" className="text-[#FF6B35] hover:underline">Entrar</Link>
        </p>
      </div>
    </main>
  );
}
