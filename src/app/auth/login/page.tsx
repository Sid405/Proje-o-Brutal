"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError("Email ou senha incorretos."); setLoading(false); return; }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="font-heading text-2xl text-[#F5F0E8]">Projeção Brutal</Link>
          <p className="text-[#F5F0E8]/40 font-mono text-xs mt-2 tracking-widest uppercase">Acesse sua conta</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
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
              placeholder="••••••••" />
          </div>
          {error && <p className="text-[#E63946] text-sm font-mono">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-[#E63946] text-white font-mono text-sm uppercase tracking-wider py-4 hover:bg-[#FF6B35] transition-colors disabled:opacity-50">
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
        <p className="text-center text-[#F5F0E8]/40 text-sm mt-6">
          Não tem conta? <Link href="/auth/cadastro" className="text-[#FF6B35] hover:underline">Cadastre-se</Link>
        </p>
      </div>
    </main>
  );
}
