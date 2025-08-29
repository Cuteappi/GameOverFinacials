"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import type { Inputs } from "@/lib/calc"
import { monthlyRevenueTotal, roiMonths, revenuePerPc } from "@/lib/calc"
import { formatCurrency, type CurrencyCode } from "@/lib/currency"

export function ScenarioComparison({ current }: { current: Inputs }) {
  const [a, setA] = React.useState<Inputs | null>(null)
  const [b, setB] = React.useState<Inputs | null>(null)
  const [nameA, setNameA] = React.useState("Budget Build")
  const [nameB, setNameB] = React.useState("Premium Build")
  
  // Load persisted scenarios/names
  React.useEffect(() => {
    try {
      const sa = typeof window !== "undefined" ? localStorage.getItem("go:scenario:A") : null
      const sb = typeof window !== "undefined" ? localStorage.getItem("go:scenario:B") : null
      const sAName = typeof window !== "undefined" ? localStorage.getItem("go:scenario:A:name") : null
      const sBName = typeof window !== "undefined" ? localStorage.getItem("go:scenario:B:name") : null
      if (sa) setA(JSON.parse(sa))
      if (sb) setB(JSON.parse(sb))
      if (sAName) setNameA(sAName)
      if (sBName) setNameB(sBName)
    } catch {}
  }, [])

  // Persist scenarios/names
  React.useEffect(() => {
    try {
      if (a) localStorage.setItem("go:scenario:A", JSON.stringify(a))
      else localStorage.removeItem("go:scenario:A")
    } catch {}
  }, [a])

  React.useEffect(() => {
    try {
      if (b) localStorage.setItem("go:scenario:B", JSON.stringify(b))
      else localStorage.removeItem("go:scenario:B")
    } catch {}
  }, [b])

  React.useEffect(() => {
    try {
      localStorage.setItem("go:scenario:A:name", nameA)
    } catch {}
  }, [nameA])

  React.useEffect(() => {
    try {
      localStorage.setItem("go:scenario:B:name", nameB)
    } catch {}
  }, [nameB])

  const currency: CurrencyCode = current.currency
  const fmt = React.useCallback((n: number) => formatCurrency(n, currency), [currency])

  const chartDataRevenue = [
    { name: nameA, value: a ? monthlyRevenueTotal(a) : 0 },
    { name: nameB, value: b ? monthlyRevenueTotal(b) : 0 },
  ]
  const chartDataRoi = [
    { name: nameA, value: a ? roiMonths(a) : 0 },
    { name: nameB, value: b ? roiMonths(b) : 0 },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>Scenario Comparison</CardTitle>
            <CardDescription>Save current settings into two slots and compare</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setA(current)}>Save as A</Button>
            <Button variant="outline" onClick={() => setB(current)}>Save as B</Button>
            <Button variant="ghost" onClick={() => setA(null)}>Clear A</Button>
            <Button variant="ghost" onClick={() => setB(null)}>Clear B</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Name A</label>
            <Input value={nameA} onChange={(e) => setNameA(e.target.value)} />
            <div className="text-sm">
              <div className="flex justify-between"><span>Monthly Revenue</span><span className="font-medium">{a ? fmt(monthlyRevenueTotal(a)) : "—"}</span></div>
              <div className="flex justify-between"><span>ROI (months)</span><span className="font-medium">{a ? roiMonths(a).toFixed(1) : "—"}</span></div>
              <div className="flex justify-between"><span>Revenue / PC</span><span className="font-medium">{a ? fmt(revenuePerPc(a)) : "—"}</span></div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Name B</label>
            <Input value={nameB} onChange={(e) => setNameB(e.target.value)} />
            <div className="text-sm">
              <div className="flex justify-between"><span>Monthly Revenue</span><span className="font-medium">{b ? fmt(monthlyRevenueTotal(b)) : "—"}</span></div>
              <div className="flex justify-between"><span>ROI (months)</span><span className="font-medium">{b ? roiMonths(b).toFixed(1) : "—"}</span></div>
              <div className="flex justify-between"><span>Revenue / PC</span><span className="font-medium">{b ? fmt(revenuePerPc(b)) : "—"}</span></div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <div className="text-sm font-medium mb-2">Monthly Revenue</div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartDataRevenue} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="scRevGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-accent)" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="var(--chart-accent)" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" strokeOpacity={0.2} vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis tickFormatter={(v) => fmt(v)} tickLine={false} axisLine={false} width={80} />
                <Tooltip formatter={(v: number) => fmt(v)} contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)" }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="url(#scRevGrad)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <div className="text-sm font-medium mb-2">ROI (months)</div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartDataRoi} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="scRoiGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-accent)" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="var(--chart-accent)" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" strokeOpacity={0.2} vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis tickFormatter={(v) => `${v.toFixed(0)} mo`} tickLine={false} axisLine={false} width={70} />
                <Tooltip formatter={(v: number) => `${v.toFixed(1)} mo`} contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)" }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="url(#scRoiGrad)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
