"use client"

import * as React from "react"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { motion } from "framer-motion"

export type SensitivityDatum = { label: string; roiMonths: number; type: "hourly" | "usage" }

export function SensitivityRoi({ data, height = 220 }: { data: SensitivityDatum[]; height?: number }) {
  const chartData = data.map((d) => ({ ...d, roi: Number.isFinite(d.roiMonths) ? d.roiMonths : 0 }))
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={chartData} margin={{ left: 8, right: 8, top: 8, bottom: 0 }} layout="vertical">
          <defs>
            <linearGradient id="sensGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--chart-accent)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="var(--chart-accent)" stopOpacity={0.9} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--border)" strokeOpacity={0.2} horizontal={false} />
          <XAxis type="number" tickLine={false} axisLine={false} domain={[0, "dataMax+6"]} tick={{ fill: "var(--muted-foreground)" }} />
          <YAxis type="category" dataKey="label" tickLine={false} axisLine={false} width={110} tick={{ fill: "var(--muted-foreground)" }} />
          <Tooltip
            formatter={(v: number, _name: string | number | undefined, p?: { payload?: { type?: "hourly" | "usage" } }) => [
              v.toFixed(1) + " mo",
              p?.payload?.type === "hourly" ? "Hourly Rate" : "Usage",
            ]}
            contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)" }}
            cursor={{ fill: "var(--foreground)", opacity: 0.04 }}
          />
          <Bar dataKey="roi" radius={[0, 4, 4, 0]} fill="url(#sensGrad)" />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
