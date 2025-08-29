"use client"

import * as React from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { SliderField } from "./SliderFeild"
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select"
import { formatCurrency, CurrencySymbols, type CurrencyCode, fetchRates } from "@/lib/currency"
import type { Inputs } from "@/lib/calc"

export type InputsPanelProps = {
	value: Inputs
	onChange: (partial: Partial<Inputs>) => void
}

export function InputsPanel({ value, onChange }: InputsPanelProps) {
	const currency = value.currency
	const fmt = React.useCallback((n: number) => formatCurrency(n, currency), [currency])

	// rates map is based on INR baseline: rates[c] = 1 INR in currency c
	const [rates, setRates] = React.useState<Record<CurrencyCode, number> | null>(null)
	const [rateLoading, setRateLoading] = React.useState(false)
	const [rateErr, setRateErr] = React.useState<string | null>(null)

	React.useEffect(() => {
		let alive = true
		setRateLoading(true)
		setRateErr(null)
		// Always fetch with INR as baseline so we can scale limits reliably.
		fetchRates("INR")
			.then((r) => {
				if (!alive) return
				setRates(r)
			})
			.catch(() => {
				if (!alive) return
				setRateErr("Failed to load rates")
			})
			.finally(() => {
				if (!alive) return
				setRateLoading(false)
			})
		return () => {
			alive = false
		}
	}, [])

	// Conversion factor from INR to current currency (fallback 1 for INR)
	const f = React.useMemo(() => {
		if (!rates) return currency === "INR" ? 1 : 1
		return rates[currency] ?? 1
	}, [rates, currency])

	return (
		<div className="space-y-6">
			<div className="space-y-2">
				<h3 className="text-lg font-semibold">Configuration</h3>
				<p className="text-sm text-muted-foreground">Adjust pricing and usage assumptions</p>
			</div>
			<div className="space-y-6">
				<div className="grid gap-6">
					<div className="space-y-4">
						<Label>Currency</Label>
						<Select
							value={currency}
							onValueChange={(c) => onChange({ currency: c as CurrencyCode })}
						>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Select currency" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="INR">{CurrencySymbols.INR} INR</SelectItem>
								<SelectItem value="USD">{CurrencySymbols.USD} USD</SelectItem>
								<SelectItem value="OMR">{CurrencySymbols.OMR} OMR</SelectItem>
							</SelectContent>
						</Select>
						<div className="text-xs mt-1">
							{rateLoading && (
								<p className="text-muted-foreground">Fetching rates…</p>
							)}
							{rateErr && <p className="text-destructive">{rateErr}</p>}
							{rates && !rateLoading && !rateErr && (
								<div className="text-muted-foreground flex flex-wrap gap-x-3">
									{(["INR", "USD", "OMR"] as CurrencyCode[])
										.filter((c) => c !== currency)
										.map((c) => {
											// With INR base: 1 A -> B is rates[B] / rates[A]
											const aToB = (rates[c] ?? 0) / (rates[currency] ?? 1)
											return (
												<span key={c}>
													1 {currency} = {Number(aToB).toFixed(4)} {c}
												</span>
											)
										})}
								</div>
							)}
						</div>
					</div>

					<SliderField
						label="PC Build Cost"
						value={value.pcBuildCost}
						min={Math.round(20000 * f)}
						max={Math.round(200000 * f)}
						step={Math.max(1, Math.round(1000 * f))}
						format={fmt}
						onValueChange={(n) => onChange({ pcBuildCost: n })}
					/>

					<SliderField
						label="Hourly Rate"
						value={value.hourlyRate}
						min={Math.max(1, Math.round(20 * f))}
						max={Math.max(1, Math.round(300 * f))}
						step={Math.max(1, Math.round(5 * f))}
						format={(n) => `${CurrencySymbols[currency]}${n}`}
						onValueChange={(n) => onChange({ hourlyRate: n })}
					/>

					<div className="space-y-2">
						<Label htmlFor="invest-amt">Amount to Invest</Label>
						<Input
							id="invest-amt"
							inputMode="decimal"
							type="number"
							min={0}
							step={1000}
							placeholder={`e.g., 300000 (${CurrencySymbols[currency]})`}
							value={value.investAmount ?? ""}
							onChange={(e) => onChange({ investAmount: e.target.value ? Number(e.target.value) : undefined })}
						/>
						<p className="text-xs text-muted-foreground">How much cash you plan to put in.</p>
					</div>

					<SliderField
						label="Average Weekday Hours"
						value={value.weekdayHours}
						min={1}
						max={24}
						step={1}
						onValueChange={(n) => onChange({ weekdayHours: n })}
					/>

					<SliderField
						label="Average Weekend Hours"
						value={value.weekendHours}
						min={1}
						max={24}
						step={1}
						onValueChange={(n) => onChange({ weekendHours: n })}
					/>

					<SliderField
						label="Number of PCs"
						value={value.pcs}
						min={1}
						max={100}
						step={1}
						onValueChange={(n) => onChange({ pcs: n })}
					/>

					<SliderField
						label="Maintenance / PC (monthly)"
						value={value.maintenancePerPc ?? 0}
						min={0}
						max={Math.round(10000 * f)}
						step={Math.max(1, Math.round(50 * f))}
						format={fmt}
						onValueChange={(n) => onChange({ maintenancePerPc: n })}
					/>
				</div>
			</div>

			<Separator />
			<div className="space-y-2">
				<h3 className="text-lg font-semibold">Fun / Engagement</h3>
				<p className="text-sm text-muted-foreground">Optional inputs for extra stats</p>
			</div>
			<div className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="session-mins">Avg Session Length (minutes)</Label>
					<Input
						id="session-mins"
						inputMode="numeric"
						type="number"
						min={15}
						step={5}
						placeholder="e.g., 60"
						value={value.sessionMinutes ?? ""}
						onChange={(e) =>
							onChange({ sessionMinutes: e.target.value ? Number(e.target.value) : undefined })
						}
					/>
					<p className="text-xs text-muted-foreground">Used to estimate matches played per month.</p>
				</div>
				<div className="grid gap-4 sm:grid-cols-2">
					<div className="space-y-2">
						<Label htmlFor="pc-wattage">Avg PC Wattage (W)</Label>
						<Input
							id="pc-wattage"
							inputMode="numeric"
							type="number"
							min={0}
							step={10}
							placeholder="e.g., 500"
							value={value.pcWattage ?? ""}
							onChange={(e) =>
								onChange({ pcWattage: e.target.value ? Number(e.target.value) : undefined })
							}
						/>
						<p className="text-xs text-muted-foreground">Average power draw of one PC while in use.</p>
					</div>
					<div className="space-y-2">
						<Label htmlFor="elec-rate">Electricity Rate (/kWh)</Label>
						<Input
							id="elec-rate"
							inputMode="decimal"
							type="number"
							min={0}
							step={0.1}
							placeholder={`e.g., 8 (${CurrencySymbols[currency]}/kWh)`}
							value={value.electricityRate ?? ""}
							onChange={(e) =>
								onChange({ electricityRate: e.target.value ? Number(e.target.value) : undefined })
							}
						/>
						<p className="text-xs text-muted-foreground">In selected currency ({CurrencySymbols[currency]} per kWh).</p>
					</div>
				</div>
			</div>

			<Separator />
			<div className="space-y-2">
				<h3 className="text-lg font-semibold">Financing</h3>
				<p className="text-sm text-muted-foreground">Optional: loan calculator</p>
			</div>
			<div className="space-y-4">
				<div className="grid gap-4 sm:grid-cols-2">
					<div className="space-y-2">
						<Label htmlFor="loan-amt">Loan Amount</Label>
						<Input
							id="loan-amt"
							inputMode="decimal"
							type="number"
							min={0}
							step={1000}
							placeholder={`e.g., 300000 (${CurrencySymbols[currency]})`}
							value={value.loanAmount ?? ""}
							onChange={(e) => onChange({ loanAmount: e.target.value ? Number(e.target.value) : undefined })}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="loan-rate">Annual Rate (%)</Label>
						<Input
							id="loan-rate"
							inputMode="decimal"
							type="number"
							min={0}
							step={0.1}
							placeholder="e.g., 12"
							value={value.loanRateAnnual ?? ""}
							onChange={(e) => onChange({ loanRateAnnual: e.target.value ? Number(e.target.value) : undefined })}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="loan-term">Term (months)</Label>
						<Input
							id="loan-term"
							inputMode="numeric"
							type="number"
							min={1}
							step={1}
							placeholder="e.g., 36"
							value={value.loanTermMonths ?? ""}
							onChange={(e) => onChange({ loanTermMonths: e.target.value ? Number(e.target.value) : undefined })}
						/>
					</div>
				</div>
				<p className="text-xs text-muted-foreground">We’ll show monthly payment and totals on the dashboard.</p>
			</div>
		</div>
	)
}
