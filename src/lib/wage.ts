import { ApiError } from "./errors";

export interface WageTerms {
  wageType: string;
  wageAmount: string | number;
  expectedHoursPerDay: string | number | null;
  overtimeRateHourly: string | number | null;
}

export interface WageResult {
  regularMinutes: number;
  overtimeMinutes: number;
  baseEarnings: number;
  overtimeEarnings: number;
  total: number;
}

const r2 = (n: number) => Math.round(n * 100) / 100;

/**
 * Server-side wage calculation from the ACTIVE agreement.
 *  daily : base = day rate (any completed session); overtime beyond expected hours at overtimeRateHourly (0 = unpaid extra).
 *  hourly: regular hours * rate; overtime hours * overtimeRateHourly (falls back to base rate if not set).
 * Other wage types are rejected with a structured error (never guessed).
 */
export function calculateWage(t: WageTerms, durationMinutes: number): WageResult {
  const amount = Number(t.wageAmount);
  const expectedMin = Math.round(Number(t.expectedHoursPerDay ?? 8) * 60);
  const otRate = Number(t.overtimeRateHourly ?? 0);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new ApiError(422, "INVALID_AGREEMENT", "Wage agreement amount is invalid.", "वेतन समझौते की राशि अमान्य है।");
  }
  const regularMinutes = Math.min(durationMinutes, expectedMin);
  const overtimeMinutes = Math.max(0, durationMinutes - expectedMin);
  let baseEarnings: number;
  let overtimeEarnings: number;
  if (t.wageType === "daily") {
    baseEarnings = amount;
    overtimeEarnings = (overtimeMinutes / 60) * otRate;
  } else if (t.wageType === "hourly") {
    baseEarnings = (regularMinutes / 60) * amount;
    overtimeEarnings = (overtimeMinutes / 60) * (otRate > 0 ? otRate : amount);
  } else {
    throw new ApiError(422, "UNSUPPORTED_WAGE_TYPE", `Wage type "${t.wageType}" is not supported. Use daily or hourly.`, "यह वेतन प्रकार समर्थित नहीं है। दैनिक या प्रति घंटा चुनें।");
  }
  return { regularMinutes, overtimeMinutes, baseEarnings: r2(baseEarnings), overtimeEarnings: r2(overtimeEarnings), total: r2(baseEarnings + overtimeEarnings) };
}
