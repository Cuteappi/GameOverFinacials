"use client"

import * as React from "react"
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts"
import { motion } from "framer-motion"
import { formatCurrency, type CurrencyCode } from "@/lib/currency"

export function WeekdayWeekendPie({
  weekday,
  weekend,
  currency,
  height = 220,
}: {
  weekday: number
  weekend: number
  currency: CurrencyCode
  height?: number
}) {
  const total = Math.max(weekday + weekend, 1)
  const data = [
    { name: "Weekdays", value: weekday, pct: (weekday / total) * 100 },
    { name: "Weekends", value: weekend, pct: (weekend / total) * 100 },
  ]
  const fmt = React.useCallback((n: number) => formatCurrency(n, currency), [currency])
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <defs>
            <radialGradient id="pieGrad1" cx="50%" cy="50%" r="65%">
              <stop offset="0%" stopColor="var(--chart-accent)" stopOpacity={0.95} />
              <stop offset="100%" stopColor="var(--chart-accent)" stopOpacity={0.6} />
            </radialGradient>
            <radialGradient id="pieGrad2" cx="50%" cy="50%" r="65%">
              <stop offset="0%" stopColor="var(--chart-accent)" stopOpacity={0.95} />
              <stop offset="100%" stopColor="var(--chart-accent)" stopOpacity={0.6} />
            </radialGradient>
          </defs>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={4}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "url(#pieGrad1)" : "url(#pieGrad2)"} />
            ))}
          </Pie>
          <Tooltip
            formatter={(v: number, _name: string | number | undefined, p?: { payload?: { name?: string; pct?: number } }) => [
              fmt(v),
              `${p?.payload?.name ?? ""} (${(p?.payload?.pct ?? 0).toFixed(0)}%)`,
            ]}
            contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
