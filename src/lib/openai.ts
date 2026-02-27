// ============================================================
// Integração com OpenAI — preparada para uso futuro
// Atualmente retorna mock enquanto API não está configurada
// ============================================================

import OpenAI from "openai";
import { DiagnosticResult } from "@/types";

// Instância singleton do cliente OpenAI
// Só inicializa se a API key estiver disponível
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

/**
 * Gera um relatório de diagnóstico usando GPT-4
 * Retorna mock se a API key não estiver configurada
 */
export async function generateDiagnosticReport(diagnostic: DiagnosticResult): Promise<string> {
  // Mock enquanto OpenAI não está integrado
  if (!openai) {
    return getMockReport(diagnostic);
  }

  const prompt = buildPrompt(diagnostic);

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "Você é um coach financeiro e de produtividade direto, sem rodeios. " +
          "Sua missão é dar um diagnóstico brutal e honesto da situação atual do usuário " +
          "e um plano de ação específico para transformar sua realidade em 5 anos. " +
          "Use linguagem forte, motivacional e sem eufemismos.",
      },
      { role: "user", content: prompt },
    ],
    max_tokens: 800,
    temperature: 0.8,
  });

  return response.choices[0].message.content ?? getMockReport(diagnostic);
}

/**
 * Constrói o prompt com os dados do diagnóstico
 */
function buildPrompt(d: DiagnosticResult): string {
  return `
Diagnóstico do usuário:
- Renda mensal: R$ ${d.monthly_income}
- Gasto impulsivo mensal: R$ ${d.monthly_impulsive_spending}
- Horas desperdiçadas/dia: ${d.hours_wasted_per_day}h
- Horas estudando/dia: ${d.hours_studying_per_day}h
- Pontuação de disciplina: ${d.discipline_score}/100
- Horas desperdiçadas em 5 anos: ${d.five_year_wasted_hours}h
- Dinheiro jogado fora em 5 anos: R$ ${d.five_year_money_wasted}
- Renda projetada em 5 anos SEM mudança: R$ ${d.projected_income_if_unchanged.toFixed(0)}/mês
- Renda projetada em 5 anos COM disciplina: R$ ${d.projected_income_if_disciplined.toFixed(0)}/mês

Gere um relatório de diagnóstico brutal e honesto em 3 parágrafos:
1. A realidade atual (sem suavizar)
2. O custo de não mudar nada
3. O que é possível alcançar com disciplina e um plano de ação concreto
  `.trim();
}

/**
 * Relatório mock para desenvolvimento e demonstração
 */
function getMockReport(d: DiagnosticResult): string {
  const diff = d.projected_income_if_disciplined - d.projected_income_if_unchanged;

  return `**Sua Realidade Atual**
Com uma pontuação de disciplina de ${d.discipline_score}/100, você está operando bem abaixo do seu potencial. Cada dia que passa desperdiçando ${d.hours_wasted_per_day} hora(s) e gastando R$ ${d.monthly_impulsive_spending} de forma impulsiva é um dia que você não vai recuperar. Não há como suavizar isso.

**O Custo de Não Mudar**
Em 5 anos, você vai desperdiçar ${d.five_year_wasted_hours.toLocaleString("pt-BR")} horas — isso é tempo que poderia ser investido em habilidades, negócios ou relacionamentos que gerariam riqueza real. Sem contar os R$ ${d.five_year_money_wasted.toLocaleString("pt-BR")} que vão evaporar em gastos impulsivos. Sua renda mensal no ano 5 será de apenas R$ ${Math.round(d.projected_income_if_unchanged).toLocaleString("pt-BR")} — quase nada mudou.

**O Que Você Pode Alcançar**
Com disciplina real — estudar mais, cortar o desperdício, parar de gastar por impulso — sua renda pode chegar a R$ ${Math.round(d.projected_income_if_disciplined).toLocaleString("pt-BR")}/mês em 5 anos. A diferença é de R$ ${Math.round(diff).toLocaleString("pt-BR")} por mês. A pergunta não é se você consegue. A pergunta é se você vai começar hoje ou continuar esperando o momento certo que nunca chega.`;
}
