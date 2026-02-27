'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { DiagnosticInput } from '@/types'

// Valores padrão do formulário
const DEFAULTS: DiagnosticInput = {
  monthly_income: 0,
  monthly_impulsive_spending: 0,
  hours_wasted_per_day: 0,
  hours_studying_per_day: 0,
}

export default function DiagnosticPage() {
  const router = useRouter()
  const [form, setForm] = useState<DiagnosticInput>(DEFAULTS)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleChange(field: keyof DiagnosticInput, value: string) {
    setForm(prev => ({ ...prev, [field]: parseFloat(value) || 0 }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Valida que a soma de horas não ultrapassa 24h
    if (form.hours_wasted_per_day + form.hours_studying_per_day > 24) {
      setError('A soma de horas desperdiçadas e estudando não pode ultrapassar 24h.')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/diagnostics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) throw new Error('Erro ao salvar diagnóstico.')
      const { id } = await res.json()
      router.push(`/result?id=${id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido.')
      setLoading(false)
    }
  }

  const fields: Array<{
    key: keyof DiagnosticInput
    label: string
    hint: string
    unit: string
    min: number
    max: number
    step: number
  }> = [
    {
      key: 'monthly_income',
      label: 'Renda mensal',
      hint: 'Sua renda líquida mensal aproximada.',
      unit: 'R$',
      min: 0,
      max: 1000000,
      step: 100,
    },
    {
      key: 'monthly_impulsive_spending',
      label: 'Gastos impulsivos mensais',
      hint: 'Quanto você gasta por impulso (fast food, compras desnecessárias, etc.).',
      unit: 'R$',
      min: 0,
      max: 100000,
      step: 50,
    },
    {
      key: 'hours_wasted_per_day',
      label: 'Horas desperdiçadas por dia',
      hint: 'Tempo em redes sociais, séries, procrastinação.',
      unit: 'h',
      min: 0,
      max: 24,
      step: 0.5,
    },
    {
      key: 'hours_studying_per_day',
      label: 'Horas estudando por dia',
      hint: 'Cursos, leitura, prática deliberada de habilidades.',
      unit: 'h',
      min: 0,
      max: 24,
      step: 0.5,
    },
  ]

  return (
    <main className="min-h-screen bg-brutal-black">
      {/* Navbar simples */}
      <nav className="border-b border-brutal-gray-light px-8 py-5 flex justify-between items-center">
        <Link href="/dashboard" className="font-display font-extrabold text-lg tracking-widest uppercase">
          Projeção<span className="text-brutal-red">Brutal</span>
        </Link>
        <Link href="/dashboard" className="font-mono text-xs text-gray-600 hover:text-brutal-white transition-colors uppercase tracking-widest">
          ← Dashboard
        </Link>
      </nav>

      <div className="max-w-xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 bg-brutal-red rounded-full animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-gray-500">
              Diagnóstico
            </span>
          </div>
          <h1 className="font-display font-extrabold text-4xl uppercase leading-none mb-3">
            Seja honesto.
          </h1>
          <p className="font-mono text-sm text-gray-500">
            Os números não mentem. Quanto mais preciso, mais brutal será a sua projeção.
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {fields.map(({ key, label, hint, unit, min, max, step }) => (
            <div key={key}>
              <label className="block font-mono text-xs uppercase tracking-widest text-gray-500 mb-1">
                {label}
              </label>
              <p className="font-mono text-xs text-gray-600 mb-2">{hint}</p>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-sm text-gray-600 pointer-events-none">
                  {unit}
                </span>
                <input
                  type="number"
                  required
                  min={min}
                  max={max}
                  step={step}
                  value={form[key] || ''}
                  onChange={e => handleChange(key, e.target.value)}
                  placeholder="0"
                  className="input-brutal pl-10"
                />
              </div>
            </div>
          ))}

          {error && (
            <p className="font-mono text-xs text-brutal-red border border-brutal-red px-4 py-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Calculando...' : 'Ver minha projeção brutal →'}
          </button>
        </form>
      </div>
    </main>
  )
}
