export type CurrencyCode = "INR" | "USD" | "OMR"

export const CurrencySymbols: Record<CurrencyCode, string> = {
  INR: "₹",
  USD: "$",
  OMR: "﷼",
}

export function formatCurrency(
  value: number,
  currency: CurrencyCode,
  locale: string = typeof navigator !== "undefined" ? navigator.language : "en-US"
) {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value)
  } catch {
    // Fallback to symbol if Intl doesn't support the currency in the environment
    const symbol = CurrencySymbols[currency] ?? "$"
    return `${symbol}${Math.round(value).toLocaleString(locale)}`
  }
}

// Fetch latest conversion rates for our supported set using a free, no-key API.
// Returns a map of currency -> rate relative to the base (rate to multiply an amount in base by).
export async function fetchRates(base: CurrencyCode): Promise<Record<CurrencyCode, number>> {
  const symbols = ["INR", "USD", "OMR"].join(",")
  const url = `https://api.exchangerate.host/latest?base=${base}&symbols=${symbols}`
  const res = await fetch(url, { cache: "no-store" })
  if (!res.ok) throw new Error(`Rate fetch failed: ${res.status}`)
  const data = (await res.json()) as { rates?: Record<string, number> }
  const raw = data.rates || {}
  // Normalize to our CurrencyCode keys and ensure base=1
  const out: Record<CurrencyCode, number> = {
    INR: base === "INR" ? 1 : raw.INR ?? 0,
    USD: base === "USD" ? 1 : raw.USD ?? 0,
    OMR: base === "OMR" ? 1 : raw.OMR ?? 0,
  }
  return out
}
