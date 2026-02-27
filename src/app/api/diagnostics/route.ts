import { NextRequest, NextResponse } from 'next/server'
import { createDiagnostic } from '@/lib/api/diagnostics'
import type { DiagnosticInput } from '@/types'

// POST /api/diagnostics — cria um novo diagnóstico para o usuário autenticado
export async function POST(request: NextRequest) {
  try {
    const body: DiagnosticInput = await request.json()

    // Validação básica dos campos obrigatórios
    const required: (keyof DiagnosticInput)[] = [
      'monthly_income',
      'monthly_impulsive_spending',
      'hours_wasted_per_day',
      'hours_studying_per_day',
    ]

    for (const field of required) {
      if (typeof body[field] !== 'number' || isNaN(body[field])) {
        return NextResponse.json(
          { error: `Campo inválido: ${field}` },
          { status: 400 }
        )
      }
    }

    const diagnostic = await createDiagnostic(body)
    return NextResponse.json({ id: diagnostic.id }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro interno'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
