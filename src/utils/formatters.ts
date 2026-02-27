export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("pt-BR").format(Math.round(value));
}

export function getDisciplineLabel(score: number): { label: string; color: string } {
  if (score >= 80) return { label: "Alta Disciplina", color: "text-green-400" };
  if (score >= 60) return { label: "Disciplina Moderada", color: "text-yellow-400" };
  if (score >= 40) return { label: "Disciplina Fraca", color: "text-orange-400" };
  return { label: "Sem Disciplina", color: "text-red-500" };
}
