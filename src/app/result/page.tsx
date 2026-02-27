import Link from 'next/link'
import { getDiagnosticById } from '@/lib/api/diagnostics'
import { formatCurrency, getDisciplineLabel } from '@/utils/formatters'
import type { Diagnostic } from '@/types'
import AIReportBlock from '@/components/AIReportBlock'

interface Props {
  searchParams: { id?: string }
}

// Página de resultado — exibe os números calculados e relatório IA
export default async function ResultPage({ searchParams }: Props) {
  if (!searchParams.id) {
    return <ErrorState message="ID do diagnóstico não encontrado." />
  }

  let diagnostic: Diagnostic
  try {
    diagnostic = await getDiagnosticById(searchParams.id)
  } catch {
    return <ErrorState message="Diagnóstico não encontrado ou sem permissão." />
  }

  const { label, color } = getDisciplineLabel(diagnostic.discipline_score)
  const incomeDiff = diagnostic.projected_income_if_disciplined - diagnostic.projected_income_if_unchanged

  return (
    <main className="min-h-screen bg-brutal-black">
      {/* Navbar */}
      <nav className="border-b border-brutal-gray-light px-8 py-5 flex justify-between items-center">
        <Link href="/dashboard" className="font-display font-extrabold text-lg tracking-widest uppercase">
          Projeção<span className="text-brutal-red">Brutal</span>
        </Link>
        <Link href="/diagnostic" className="btn-primary text-xs px-5 py-2">
          Novo diagnóstico +
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: color }} />
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-gray-500">
              Resultado do diagnóstico
            </span>
          </div>
          <h1 className="font-display font-extrabold text-5xl uppercase leading-none">
            Sua projeção
          </h1>
        </div>

        {/* Score de Disciplina */}
        <section className="card-brutal mb-6">
          <div className="stat-label mb-4">Score de Disciplina</div>
          <div className="flex items-end gap-4 mb-4">
            <span className="font-mono font-bold text-6xl" style={{ color }}>
              {diagnostic.discipline_score}
            </span>
            <span className="font-mono text-2xl text-gray-600 mb-1">/100</span>
            <span className="font-display font-bold text-xl mb-2" style={{ color }}>
              {label}
            </span>
          </div>
          {/* Barra de progresso */}
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${diagnostic.discipline_score}%`,
                backgroundColor: color,
              }}
            />
          </div>
        </section>

        {/* Grid de métricas principais */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <StatCard
            label="Horas desperdiçadas em 5 anos"
            value={`${diagnostic.five_year_wasted_hours.toLocaleString('pt-BR')}h`}
            accent="brutal-red"
          />
          <StatCard
            label="Dinheiro jogado fora em 5 anos"
            value={formatCurrency(diagnostic.five_year_money_wasted)}
            accent="brutal-red"
          />
        </div>

        {/* Projeções de renda */}
        <section className="card-brutal mb-6">
          <div className="stat-label mb-6">Projeção de Renda Mensal — 5 Anos</div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="stat-label mb-2 text-brutal-red">Sem mudança (+2% a.a.)</div>
              <div className="stat-number text-brutal-red">
                {formatCurrency(diagnostic.projected_income_if_unchanged)}
              </div>
              <div className="font-mono text-xs text-gray-600 mt-1">
                Hoje: {formatCurrency(diagnostic.monthly_income)}
              </div>
            </div>
            <div>
              <div className="stat-label mb-2" style={{ color: '#22c55e' }}>Com disciplina (+10% a.a.)</div>
              <div className="stat-number" style={{ color: '#22c55e' }}>
                {formatCurrency(diagnostic.projected_income_if_disciplined)}
              </div>
              <div className="font-mono text-xs text-gray-600 mt-1">
                Diferença: +{formatCurrency(incomeDiff)}
              </div>
            </div>
          </div>
        </section>

        {/* Entradas do usuário */}
        <section className="card-brutal mb-8">
          <div className="stat-label mb-4">Dados informados</div>
          <div className="grid grid-cols-2 gap-4">
            <InputRow label="Renda mensal" value={formatCurrency(diagnostic.monthly_income)} />
            <InputRow label="Gastos impulsivos" value={formatCurrency(diagnostic.monthly_impulsive_spending)} />
            <InputRow label="Horas desperdiçadas/dia" value={`${diagnostic.hours_wasted_per_day}h`} />
            <InputRow label="Horas estudando/dia" value={`${diagnostic.hours_studying_per_day}h`} />
          </div>
        </section>

        {/* Relatório de IA */}
        <AIReportBlock diagnostic={diagnostic} />

        {/* CTA */}
        <div className="mt-10 flex gap-4">
          <Link href="/diagnostic" className="btn-primary">
            Refazer diagnóstico
          </Link>
          <Link href="/dashboard" className="btn-secondary">
            Ver histórico
          </Link>
        </div>
      </div>
    </main>
  )
}

// ---- Sub-componentes ----

function StatCard({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="card-brutal">
      <div className="stat-label mb-3">{label}</div>
      <div className={`stat-number text-${accent}`}>{value}</div>
    </div>
  )
}

function InputRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="stat-label mb-1">{label}</div>
      <div className="font-mono text-sm text-brutal-white">{value}</div>
    </div>
  )
}

function ErrorState({ message }: { message: string }) {
  return (
    <main className="min-h-screen bg-brutal-black flex items-center justify-center">
      <div className="text-center">
        <p className="font-mono text-brutal-red mb-4">{message}</p>
        <Link href="/dashboard" className="btn-secondary text-sm">
          ← Voltar
        </Link>
      </div>
    </main>
  )
}
