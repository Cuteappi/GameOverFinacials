"use client"

import * as React from "react"
import { KpiCard } from "@/components/dashboard/KpiCard"
import { useAppStore } from "@/lib/store"
import {
	monthlyRevenueTotal,
	revenuePerPc,
	roiMonths,
	utilizationRate,
} from "@/lib/calc"
import { formatCurrency } from "@/lib/currency"

export function KpiGrid() {
	const inputs = useAppStore((s) => s.inputs)
	const monthly = React.useMemo(() => monthlyRevenueTotal(inputs), [inputs])
	const perPc = React.useMemo(() => revenuePerPc(inputs), [inputs])
	const roi = React.useMemo(() => roiMonths(inputs), [inputs])
	const util = React.useMemo(() => utilizationRate(inputs), [inputs])
	const fmt = React.useCallback((n: number) => formatCurrency(n, inputs.currency), [inputs.currency])


	return (
		<div className="flex-1 grid grow grid-cols-1 sm:grid-cols-2 gap-4 h-full">
			<KpiCard title="Monthly Revenue" value={fmt(monthly)} valueNumeric={monthly} />
			<KpiCard title="ROI (months)" value={Number.isFinite(roi) ? roi.toFixed(1) : "∞"} valueNumeric={roi} />
			<KpiCard title="Utilization Rate" value={`${util.toFixed(0)}%`} valueNumeric={util} />
			<KpiCard title="Revenue / PC" value={fmt(perPc)} valueNumeric={perPc} />
		</div>
	)
}
