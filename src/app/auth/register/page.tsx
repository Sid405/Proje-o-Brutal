'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Redireciona após confirmação de e-mail (se habilitada no Supabase)
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    // Vai ao dashboard diretamente (confirmar e-mail pode estar desabilitado no projeto)
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-brutal-black">
      <div className="w-full max-w-sm">
        <Link href="/" className="block mb-10 font-display font-extrabold text-xl tracking-widest uppercase">
          Projeção<span className="text-brutal-red">Brutal</span>
        </Link>

        <h1 className="font-display font-bold text-3xl uppercase mb-1">Cadastrar</h1>
        <p className="font-mono text-sm text-gray-500 mb-8">Crie sua conta em segundos.</p>

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <div>
            <label className="block font-mono text-xs uppercase tracking-widest text-gray-500 mb-2">
              E-mail
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="voce@email.com"
              className="input-brutal"
            />
          </div>

          <div>
            <label className="block font-mono text-xs uppercase tracking-widest text-gray-500 mb-2">
              Senha <span className="text-gray-600">(mín. 6 caracteres)</span>
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input-brutal"
            />
          </div>

          {error && (
            <p className="font-mono text-xs text-brutal-red border border-brutal-red px-4 py-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Criando conta...' : 'Criar conta →'}
          </button>
        </form>

        <p className="font-mono text-xs text-gray-600 mt-6 text-center">
          Já tem conta?{' '}
          <Link href="/auth/login" className="text-brutal-yellow hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </main>
  )
}
