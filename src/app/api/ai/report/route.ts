import { NextRequest, NextResponse } from 'next/server'
import { getDiagnosticById } from '@/lib/api/diagnostics'
import { formatCurrency, getDisciplineLabel } from '@/utils/formatters'

// POST /api/ai/report — gera relatório personalizado com OpenAI
// Atualmente retorna mock se OPENAI_API_KEY não estiver configurada
export async function POST(request: NextRequest) {
  try {
    const { diagnosticId } = await request.json()
    if (!diagnosticId) {
      return NextResponse.json({ error: 'diagnosticId obrigatório' }, { status: 400 })
    }

    const diagnostic = await getDiagnosticById(diagnosticId)
    const { label } = getDisciplineLabel(diagnostic.discipline_score)

    // Prompt que será enviado à OpenAI (ou mockado abaixo)
    const prompt = `
Você é um coach financeiro e de produtividade extremamente direto e honesto.
Analise os dados abaixo e gere um relatório personalizado curto (3-4 parágrafos).
Seja brutal, empático e construtivo. Use linguagem direta em português.

DADOS DO USUÁRIO:
- Renda mensal: ${formatCurrency(diagnostic.monthly_income)}
- Gastos impulsivos mensais: ${formatCurrency(diagnostic.monthly_impulsive_spending)}
- Horas desperdiçadas/dia: ${diagnostic.hours_wasted_per_day}h
- Horas estudando/dia: ${diagnostic.hours_studying_per_day}h
- Score de disciplina: ${diagnostic.discipline_score}/100 (${label})
- Horas desperdiçadas em 5 anos: ${diagnostic.five_year_wasted_hours}h
- Dinheiro desperdiçado em 5 anos: ${formatCurrency(diagnostic.five_year_money_wasted)}
- Renda projetada sem mudança: ${formatCurrency(diagnostic.projected_income_if_unchanged)}/mês
- Renda projetada com disciplina: ${formatCurrency(diagnostic.projected_income_if_disciplined)}/mês

Estruture o relatório em:
1. Diagnóstico honesto da situação atual
2. O maior risco que esses padrões representam
3. As 2-3 mudanças mais impactantes que essa pessoa deveria fazer agora
    `.trim()

    // ---- INTEGRAÇÃO OPENAI ----
    // Se a API key estiver configurada, usa a API real.
    // Caso contrário, retorna um mock para desenvolvimento.
    if (process.env.OPENAI_API_KEY) {
      const { getOpenAIClient } = await import('@/lib/openai')
      const openai = getOpenAIClient()

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini', // Mais barato para diagnósticos
        max_tokens: 600,
        messages: [{ role: 'user', content: prompt }],
      })

      const report = completion.choices[0]?.message?.content ?? 'Sem resposta da IA.'
      return NextResponse.json({ report })
    }

    // ---- MOCK (sem API key) ----
    const mockReport = generateMockReport(diagnostic.discipline_score, diagnostic.monthly_income)
    return NextResponse.json({ report: mockReport })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro interno'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// Mock coerente com o score — substitua pela IA real em produção
function generateMockReport(score: number, income: number): string {
  if (score >= 70) {
    return `[MOCK — Configure OPENAI_API_KEY para relatório real]

Você já está acima da média. Seu score de ${score}/100 indica comportamentos consistentes com crescimento real. Mas atenção: disciplina sem estratégia é só hábito. O próximo nível exige que você transforme as horas de estudo em resultados mensuráveis.

O risco para quem está no seu patamar é a complacência. Você tem bons indicadores, mas se estagnar aqui, o mundo vai te passar. A diferença entre o 70 e o 90 é justamente onde a maioria das pessoas para.

Ações imediatas: (1) Defina uma meta financeira de 12 meses com número concreto. (2) Audite cada hora de estudo — ela está gerando retorno real? (3) Reduza qualquer gasto impulsivo que sobre para investir na diferença projetada de renda.`
  }

  return `[MOCK — Configure OPENAI_API_KEY para relatório real]

Os números revelam um padrão preocupante. Com score ${score}/100, você está operando bem abaixo do seu potencial. As horas desperdiçadas e gastos impulsivos não são apenas números — são escolhas que você repete todos os dias, criando um futuro que vai te decepcionar.

O maior risco aqui é a gradualidade. Você não vai acordar um dia "arruinado" — vai acordar em 5 anos exatamente onde está hoje, só mais velho e com menos tempo para agir.

Três mudanças agora: (1) Elimine 50% do tempo desperdiçado esta semana — comece com uma única plataforma. (2) Crie uma conta separada e transfira ${income > 0 ? Math.round(income * 0.1).toLocaleString('pt-BR') : '???'} reais automaticamente no dia do pagamento — você vai sobreviver sem esse dinheiro. (3) Substitua 1 hora de conteúdo passivo por estudo ativo toda manhã. Não amanhã. Hoje.`
}
