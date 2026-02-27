export interface Profile {
  id: string;
  created_at: string;
  email: string;
}

export interface Diagnostic {
  id: string;
  user_id: string;
  created_at: string;
  monthly_income: number;
  monthly_impulsive_spending: number;
  hours_wasted_per_day: number;
  hours_studying_per_day: number;
  discipline_score: number;
  five_year_wasted_hours: number;
  five_year_money_wasted: number;
  projected_income_if_unchanged: number;
  projected_income_if_disciplined: number;
}

export interface DiagnosticInput {
  monthly_income: number;
  monthly_impulsive_spending: number;
  hours_wasted_per_day: number;
  hours_studying_per_day: number;
}

export interface DiagnosticResult extends DiagnosticInput {
  discipline_score: number;
  five_year_wasted_hours: number;
  five_year_money_wasted: number;
  projected_income_if_unchanged: number;
  projected_income_if_disciplined: number;
}
