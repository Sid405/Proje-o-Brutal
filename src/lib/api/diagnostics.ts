// ============================================================
// lib/api/diagnostics.ts
// Funções para criar e buscar diagnósticos no Supabase
// Usadas em Server Actions e Route Handlers
// ============================================================

import { createClient } from '@/lib/supabase/server'
import { calculateDiagnostic } from '@/utils/calculations'
import type { DiagnosticInput, Diagnostic } from '@/types'

/**
 * Cria um novo diagnóstico para o usuário autenticado.
 * Calcula os campos derivados antes de persistir.
 */
export async function createDiagnostic(input: DiagnosticInput): Promise<Diagnostic> {
  const supabase = createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Usuário não autenticado')

  const result = calculateDiagnostic(input)

  const { data, error } = await supabase
    .from('diagnostics')
    .insert({ user_id: user.id, ...result })
    .select()
    .single()

  if (error) throw new Error(`Erro ao salvar diagnóstico: ${error.message}`)
  return data as Diagnostic
}

/**
 * Busca o histórico de diagnósticos do usuário autenticado.
 * Ordenado do mais recente ao mais antigo.
 */
export async function getUserDiagnostics(): Promise<Diagnostic[]> {
  const supabase = createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Usuário não autenticado')

  const { data, error } = await supabase
    .from('diagnostics')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw new Error(`Erro ao buscar diagnósticos: ${error.message}`)
  return (data ?? []) as Diagnostic[]
}

/**
 * Busca um diagnóstico específico por ID.
 * Garante que pertence ao usuário autenticado.
 */
export async function getDiagnosticById(id: string): Promise<Diagnostic> {
  const supabase = createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Usuário não autenticado')

  const { data, error } = await supabase
    .from('diagnostics')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error) throw new Error(`Diagnóstico não encontrado: ${error.message}`)
  return data as Diagnostic
}
