"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
	ResponsiveContainer,
	AreaChart,
	Area,
	XAxis,
	YAxis,
	Tooltip,
	CartesianGrid,
} from "recharts"
import type { CurrencyCode } from "@/lib/currency"
import { formatCurrency } from "@/lib/currency"

export function MainRevenueVsPcs({
	data,
	currency,
	height = 260,
}: {
	data: { pcs: number; revenue: number }[]
	currency: CurrencyCode
	height?: number
}) {
	const fmt = React.useCallback((n: number) => formatCurrency(n, currency), [currency])
	return (
		<motion.div
			initial={{ opacity: 0, y: 8 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.25 }}
			className="w-full h-full"
		>
			<ResponsiveContainer width="100%" height={height}>
				<AreaChart data={data} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
					<defs>
						<linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
							<stop offset="5%" stopColor="var(--chart-accent)" stopOpacity={0.35} />
							<stop offset="95%" stopColor="var(--chart-accent)" stopOpacity={0.05} />
						</linearGradient>
					</defs>
					<CartesianGrid stroke="var(--border)" strokeOpacity={0.2} vertical={false} />
					<XAxis dataKey="pcs" tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)" }} />
					<YAxis
						tickFormatter={(v) => fmt(v)}
						width={80}
						tickLine={false}
						axisLine={false}
						tick={{ fill: "var(--muted-foreground)" }}
					/>
					<Tooltip
						formatter={(v: number) => fmt(v)}
						labelFormatter={(l) => `PCs: ${l}`}
						contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)" }}
						cursor={{ fill: "var(--foreground)", opacity: 0.04 }}
					/>
					<Area
						type="monotone"
						dataKey="revenue"
						stroke="var(--chart-accent)"
						fill="url(#revFill)"
						strokeWidth={2}
						dot={false}
						isAnimationActive
					/>
				</AreaChart>
			</ResponsiveContainer>
		</motion.div>
	)
}
