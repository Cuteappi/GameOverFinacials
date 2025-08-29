"use client"

import * as React from "react"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { motion } from "framer-motion"
import { formatCurrency, type CurrencyCode } from "@/lib/currency"

export function WeekdayWeekendBar({
  data,
  currency,
  height = 220,
}: {
  data: { name: string; value: number }[]
  currency: CurrencyCode
  height?: number
}) {
  const fmt = React.useCallback((n: number) => formatCurrency(n, currency), [currency])
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
          <defs>
            <linearGradient id="wwBarGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--chart-accent)" stopOpacity={0.9} />
              <stop offset="100%" stopColor="var(--chart-accent)" stopOpacity={0.3} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--border)" strokeOpacity={0.2} vertical={false} />
          <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)" }} />
          <YAxis tickFormatter={(v) => fmt(v)} tickLine={false} axisLine={false} width={80} tick={{ fill: "var(--muted-foreground)" }} />
          <Tooltip
            formatter={(v: number) => fmt(v)}
            contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)" }}
            cursor={{ fill: "var(--foreground)", opacity: 0.04 }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="url(#wwBarGrad)" />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
