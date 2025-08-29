import type { CurrencyCode } from "./currency"

export type Inputs = {
  pcBuildCost: number
  weekdayHours: number
  weekendHours: number
  pcs: number
  hourlyRate: number
  currency: CurrencyCode
  sessionMinutes?: number
  pcWattage?: number // average wattage per PC (W)
  electricityRate?: number // cost per kWh in selected currency
  // New optional financial fields
  investAmount?: number
  maintenancePerPc?: number // monthly maintenance cost per PC
  loanAmount?: number
  loanRateAnnual?: number // %
  loanTermMonths?: number
}

export const DAYS = {
  weekdays: 22,
  weekends: 8,
}

export function monthlyRevenueTotal(i: Inputs): number {
  const hours = i.weekdayHours * DAYS.weekdays + i.weekendHours * DAYS.weekends
  return hours * i.hourlyRate * i.pcs
}

export function monthlyRevenuePerPc(i: Inputs): number {
  const total = monthlyRevenueTotal(i)
  return i.pcs > 0 ? total / i.pcs : 0
}

export function roiMonths(i: Inputs): number {
  const perPc = monthlyRevenuePerPc(i)
  if (perPc <= 0) return Infinity
  return i.pcBuildCost / perPc
}

export function revenuePerPc(i: Inputs): number {
  const total = monthlyRevenueTotal(i)
  return i.pcs > 0 ? total / i.pcs : 0
}

export function utilizationRate(i: Inputs): number {
  const totalMonthlyHours = i.weekdayHours * DAYS.weekdays + i.weekendHours * DAYS.weekends
  const avgPerDay = totalMonthlyHours / (DAYS.weekdays + DAYS.weekends)
  const pct = (avgPerDay / 24) * 100
  return Math.max(0, Math.min(100, pct))
}

export function weekdayWeekendRevenue(i: Inputs): { weekday: number; weekend: number } {
  return {
    weekday: i.weekdayHours * DAYS.weekdays * i.hourlyRate * i.pcs,
    weekend: i.weekendHours * DAYS.weekends * i.hourlyRate * i.pcs,
  }
}

export function pcsRevenueSeries(i: Inputs, maxPcs: number = 100) {
  const perPc = monthlyRevenuePerPc(i)
  const data = [] as { pcs: number; revenue: number }[]
  const limit = Math.max(1, Math.min(100, maxPcs))
  for (let n = 1; n <= limit; n++) {
    data.push({ pcs: n, revenue: perPc * n })
  }
  return data
}

export function totalHoursPerMonth(i: Inputs) {
  return i.weekdayHours * DAYS.weekdays + i.weekendHours * DAYS.weekends
}

export function monthlyPowerKwh(i: Inputs) {
  const watt = i.pcWattage ?? 0
  const hours = totalHoursPerMonth(i)
  return (watt * i.pcs * hours) / 1000
}

export function monthlyPowerCost(i: Inputs) {
  const rate = i.electricityRate ?? 0
  return monthlyPowerKwh(i) * rate
}

export function roiCurvePerPc(i: Inputs) {
  const perPc = monthlyRevenuePerPc(i)
  const beMonths = perPc > 0 ? Math.ceil(i.pcBuildCost / perPc) : 0
  const months = Math.min(48, Math.max(12, (beMonths || 12) + 6))
  const data = [] as { month: number; cumulative: number; capex: number }[]
  for (let m = 0; m <= months; m++) {
    data.push({ month: m, cumulative: perPc * m, capex: i.pcBuildCost })
  }
  return { data, beMonths }
}

export function profit12m(i: Inputs) {
  const total = monthlyRevenueTotal(i)
  const profit = 12 * total - i.pcBuildCost * i.pcs
  return { total12mRevenue: 12 * total, profit12m: profit }
}

export function sensitivityRoi(i: Inputs) {
  const out: {
    type: "hourly" | "usage"
    label: string
    roiMonths: number
  }[] = []

  // Hourly rate ±20%
  const hrDown = { ...i, hourlyRate: i.hourlyRate * 0.8 }
  const hrUp = { ...i, hourlyRate: i.hourlyRate * 1.2 }
  out.push({ type: "hourly", label: "-20% rate", roiMonths: roiMonths(hrDown) })
  out.push({ type: "hourly", label: "+20% rate", roiMonths: roiMonths(hrUp) })

  // Usage ±20% (scale weekday/weekend hours, clamp 0..24)
  const scale = (h: number, s: number) => Math.max(0, Math.min(24, h * s))
  const useDown = {
    ...i,
    weekdayHours: scale(i.weekdayHours, 0.8),
    weekendHours: scale(i.weekendHours, 0.8),
  }
  const useUp = {
    ...i,
    weekdayHours: scale(i.weekdayHours, 1.2),
    weekendHours: scale(i.weekendHours, 1.2),
  }
  out.push({ type: "usage", label: "-20% usage", roiMonths: roiMonths(useDown) })
  out.push({ type: "usage", label: "+20% usage", roiMonths: roiMonths(useUp) })

  return out
}

export function totalGamingHoursPerMonth(i: Inputs) {
  return i.pcs * totalHoursPerMonth(i)
}

export function matchesPerMonth(i: Inputs) {
  if (!i.sessionMinutes || i.sessionMinutes <= 0) return 0
  const totalHours = totalGamingHoursPerMonth(i)
  const totalMinutes = totalHours * 60
  return Math.floor(totalMinutes / i.sessionMinutes)
}

// Financial helpers
export function monthlyNetRevenue(i: Inputs) {
  const maint = (i.maintenancePerPc ?? 0) * i.pcs
  return monthlyRevenueTotal(i) - maint - monthlyPowerCost(i)
}

export function pcsAffordableFromInvestment(i: Inputs) {
  const invest = i.investAmount ?? 0
  if (i.pcBuildCost <= 0) return 0
  return Math.max(0, Math.floor(invest / i.pcBuildCost))
}

export function loanMonthlyPayment(principal: number, annualRatePct: number, months: number) {
  if (!principal || principal <= 0 || !months || months <= 0) return 0
  const r = (annualRatePct ?? 0) / 100 / 12
  if (!r) return principal / months
  return (principal * r) / (1 - Math.pow(1 + r, -months))
}

export function loanTotals(principal: number, annualRatePct: number, months: number) {
  const monthlyPayment = loanMonthlyPayment(principal, annualRatePct, months)
  const totalPaid = monthlyPayment * (months || 0)
  const totalInterest = Math.max(0, totalPaid - (principal || 0))
  return { monthlyPayment, totalPaid, totalInterest }
}
