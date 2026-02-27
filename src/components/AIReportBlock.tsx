'use client'

import { useState } from 'react'
import type { Diagnostic } from '@/types'
import { formatCurrency, getDisciplineLabel } from '@/utils/formatters'

interface Props {
  diagnostic: Diagnostic
}

// Componente client que exibe o relatório gerado pela IA
// Por enquanto usa mock — trocar por chamada real na API quando OPENAI_API_KEY estiver configurada
export default function AIReportBlock({ diagnostic }: Props) {
  const [report, setReport] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function generateReport() {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/ai/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ diagnosticId: diagnostic.id }),
      })

      if (!res.ok) throw new Error('Erro ao gerar relatório.')
      const data = await res.json()
      setReport(data.report)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="card-brutal border-l-4 border-l-brutal-yellow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="font-mono text-xs uppercase tracking-widest text-brutal-yellow mb-1">
            IA — Análise personalizada
          </div>
          <h3 className="font-display font-bold text-xl">Relatório Brutal</h3>
        </div>
        <span className="font-mono text-xs text-gray-600 bg-brutal-gray-mid px-3 py-1">
          GPT-4o
        </span>
      </div>

      {!report && !loading && (
        <div>
          <p className="font-mono text-sm text-gray-500 mb-6">
            Clique abaixo para gerar uma análise personalizada com base nos seus números.
            A IA irá diagnosticar seus padrões e sugerir mudanças concretas.
          </p>
          <button onClick={generateReport} className="btn-primary text-xs px-6 py-3">
            Gerar análise com IA →
          </button>
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-3 py-4">
          <div className="w-2 h-2 bg-brutal-yellow rounded-full animate-pulse" />
          <span className="font-mono text-sm text-gray-500">Analisando seus dados...</span>
        </div>
      )}

      {error && (
        <p className="font-mono text-xs text-brutal-red border border-brutal-red px-4 py-3">
          {error}
        </p>
      )}

      {report && (
        <div className="font-mono text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
          {report}
        </div>
      )}
    </section>
  )
}
