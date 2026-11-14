import { round2 } from "./pricing";

export const TEA = 0.4;
export const TERMS = [3, 6, 12];
export const DOWN_PAYMENT_OPTIONS = [0, 10, 20, 30];
export const INTEREST_FREE_MINIMUM = 300;
export const INTEREST_FREE_TERM = 3;

export interface ScheduleRow {
  number: number;
  installment: number;
  interest: number;
  principal: number;
  balance: number;
}

export interface Schedule {
  total: number;
  downPercent: number;
  down: number;
  financed: number;
  term: number;
  rate: number;
  interestFree: boolean;
  installment: number;
  rows: ScheduleRow[];
  totalInterest: number;
  totalPaid: number;
}

export function monthlyRate(): number {
  return TEA / 12;
}

export function downPayment(total: number, percent: number): number {
  return round2((total * percent) / 100);
}

export function isInterestFree(amount: number, term: number): boolean {
  return term === INTEREST_FREE_TERM && amount >= INTEREST_FREE_MINIMUM;
}

export function buildSchedule(total: number, downPercent: number, term: number): Schedule {
  const down = downPayment(total, downPercent);
  const financed = round2(total - down);
  const interestFree = isInterestFree(total, term);
  const rate = interestFree ? 0 : monthlyRate();
  const installment = interestFree
    ? round2(financed / term)
    : round2((financed * rate) / (1 - Math.pow(1 + rate, -term)));

  const rows: ScheduleRow[] = [];
  let balance = financed;
  for (let n = 1; n <= term; n++) {
    const interest = round2(financed * rate);
    const principal = round2(installment - interest);
    balance = round2(balance - principal);
    rows.push({ number: n, installment, interest, principal, balance });
  }

  return {
    total,
    downPercent,
    down,
    financed,
    term,
    rate,
    interestFree,
    installment,
    rows,
    totalInterest: round2(installment * term - financed),
    totalPaid: round2(down + installment * term),
  };
}
