"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from "recharts"
import type { Inputs } from "@/lib/calc"
import { roiCurvePerPc } from "@/lib/calc"
import { formatCurrency } from "@/lib/currency"

export function RoiCurve({ inputs, height = 240 }: { inputs: Inputs; height?: number }) {
  const { data, beMonths } = React.useMemo(() => roiCurvePerPc(inputs), [inputs])
  const fmt = React.useCallback((n: number) => formatCurrency(n, inputs.currency), [inputs.currency])
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
          <defs>
            <linearGradient id="roiStroke" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--chart-accent)" stopOpacity={1} />
              <stop offset="100%" stopColor="var(--chart-accent)" stopOpacity={0.5} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--border)" strokeOpacity={0.2} vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)" }} />
          <YAxis tickLine={false} axisLine={false} width={70} tick={{ fill: "var(--muted-foreground)" }} tickFormatter={(v: number) => fmt(v)} />
          <Tooltip
            formatter={(v: number, name: string) => [fmt(v), name === "cumulative" ? "Cumulative Rev/PC" : "Build Cost/PC"]}
            labelFormatter={(l) => `Month ${l}`}
            contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)" }}
            cursor={{ stroke: "var(--foreground)", strokeOpacity: 0.06 }}
          />
          <Line type="monotone" dataKey="cumulative" stroke="url(#roiStroke)" dot={false} strokeWidth={2} />
          <Line type="monotone" dataKey="capex" stroke="var(--chart-accent)" dot={false} strokeDasharray="4 4" />
          {Number.isFinite(beMonths) && beMonths > 0 ? (
            <ReferenceLine x={beMonths} stroke="var(--muted-foreground)" strokeDasharray="3 3" />
          ) : null}
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
