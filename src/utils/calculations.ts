// ============================================================
// Lógica de cálculo central do diagnóstico
// Separada em utils para reutilização e testabilidade
// ============================================================

import { DiagnosticInput, DiagnosticResult } from "@/types";

const YEARS = 5;
const DAYS_PER_YEAR = 365;
const MONTHS_PER_YEAR = 12;
const GROWTH_UNCHANGED = 0.02;   // 2% ao ano sem mudança
const GROWTH_DISCIPLINED = 0.10; // 10% ao ano com disciplina

export function calcFiveYearWastedHours(hoursPerDay: number): number {
  return hoursPerDay * DAYS_PER_YEAR * YEARS;
}

export function calcFiveYearMoneyWasted(monthlyImpulsive: number): number {
  return monthlyImpulsive * MONTHS_PER_YEAR * YEARS;
}

/** Renda mensal projetada no 5º ano sem mudar nada (crescimento 2% a.a.) */
export function calcProjectedIncomeUnchanged(monthlyIncome: number): number {
  const annual = monthlyIncome * MONTHS_PER_YEAR;
  return (annual * Math.pow(1 + GROWTH_UNCHANGED, YEARS)) / MONTHS_PER_YEAR;
}

/** Renda mensal projetada no 5º ano com disciplina (crescimento 10% a.a.) */
export function calcProjectedIncomeDisciplined(monthlyIncome: number): number {
  const annual = monthlyIncome * MONTHS_PER_YEAR;
  return (annual * Math.pow(1 + GROWTH_DISCIPLINED, YEARS)) / MONTHS_PER_YEAR;
}

/**
 * Pontuação de disciplina (0-100)
 *
 * Base: 50 pts
 * + horas de estudo × 5 (cap +30)
 * - horas desperdiçadas × 5 (cap -40)
 * - penalidade de gasto impulsivo: -20 se >20% da renda, -10 se 10-20%
 */
export function calcDisciplineScore(input: DiagnosticInput): number {
  let score = 50;
  score += Math.min(input.hours_studying_per_day * 5, 30);
  score -= Math.min(input.hours_wasted_per_day * 5, 40);

  if (input.monthly_income > 0) {
    const ratio = input.monthly_impulsive_spending / input.monthly_income;
    if (ratio > 0.20) score -= 20;
    else if (ratio > 0.10) score -= 10;
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}

/** Função principal: recebe inputs e retorna resultado completo */
export function calculateDiagnostic(input: DiagnosticInput): DiagnosticResult {
  return {
    ...input,
    discipline_score: calcDisciplineScore(input),
    five_year_wasted_hours: calcFiveYearWastedHours(input.hours_wasted_per_day),
    five_year_money_wasted: calcFiveYearMoneyWasted(input.monthly_impulsive_spending),
    projected_income_if_unchanged: calcProjectedIncomeUnchanged(input.monthly_income),
    projected_income_if_disciplined: calcProjectedIncomeDisciplined(input.monthly_income),
  };
}
