// ============================================================
// Landing Page — apresentação do produto
// ============================================================

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] flex flex-col">
      {/* Header */}
      <header className="px-8 py-6 flex items-center justify-between border-b border-white/5">
        <span className="font-heading text-xl text-[#F5F0E8]">Projeção Brutal</span>
        <div className="flex gap-4">
          <Link
            href="/auth/login"
            className="text-sm text-[#F5F0E8]/60 hover:text-[#F5F0E8] transition-colors"
          >
            Entrar
          </Link>
          <Link
            href="/auth/cadastro"
            className="text-sm bg-[#E63946] text-white px-4 py-2 rounded-sm hover:bg-[#c62d3a] transition-colors"
          >
            Começar
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-8 py-24 text-center max-w-4xl mx-auto">
        <div className="animate-fade-in-up">
          <p className="font-mono text-[#E63946] text-sm tracking-widest uppercase mb-6">
            Diagnóstico Financeiro
          </p>
          <h1 className="font-heading text-5xl md:text-7xl text-[#F5F0E8] leading-tight mb-8">
            Quanto custa<br />
            <em className="text-[#FF6B35]">não mudar</em><br />
            nada?
          </h1>
          <p className="text-[#F5F0E8]/60 text-lg max-w-xl mx-auto mb-12 leading-relaxed">
            Preencha seu diagnóstico financeiro e de produtividade.
            Veja em números reais o impacto das suas escolhas de hoje
            nos próximos 5 anos.
          </p>
          <Link
            href="/auth/cadastro"
            className="inline-block bg-[#E63946] text-white font-mono text-sm tracking-wider uppercase px-8 py-4 hover:bg-[#FF6B35] transition-colors"
          >
            Fazer meu diagnóstico →
          </Link>
        </div>

        {/* Stats de destaque */}
        <div className="grid grid-cols-3 gap-8 mt-24 w-full border-t border-white/10 pt-12">
          {[
            { value: "5 anos", label: "de projeção" },
            { value: "2 min", label: "para preencher" },
            { value: "100%", label: "gratuito" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-heading text-3xl text-[#FFD166]">{stat.value}</p>
              <p className="text-[#F5F0E8]/40 text-sm mt-1 font-mono">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
