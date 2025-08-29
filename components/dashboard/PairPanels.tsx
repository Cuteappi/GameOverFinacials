"use client"

import * as React from "react"
import { Reorder, motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { RoiCurve } from "@/components/dashboard/charts/RoiCurve"
import { useAppStore } from "@/lib/store"
import {
    monthlyRevenueTotal,
    monthlyPowerCost,
    monthlyNetRevenue,
    pcsAffordableFromInvestment,
    loanTotals,
} from "@/lib/calc"
import { formatCurrency } from "@/lib/currency"

export function PairPanels() {
    const inputs = useAppStore((s) => s.inputs)
    const pairPanels = useAppStore((s) => s.pairPanels)
    const setPairPanels = useAppStore((s) => s.setPairPanels)

    const grossMonthly = React.useMemo(() => monthlyRevenueTotal(inputs), [inputs])
    const powerCost = React.useMemo(() => monthlyPowerCost(inputs), [inputs])
    const netMonthly = React.useMemo(() => monthlyNetRevenue(inputs), [inputs])
    const maintMonthly = React.useMemo(() => (inputs.maintenancePerPc ?? 0) * inputs.pcs, [inputs])
    const investPcs = React.useMemo(() => pcsAffordableFromInvestment(inputs), [inputs])
    const loan = React.useMemo(
        () => loanTotals(inputs.loanAmount ?? 0, inputs.loanRateAnnual ?? 0, inputs.loanTermMonths ?? 0),
        [inputs]
    )
    const fmt = React.useCallback((n: number) => formatCurrency(n, inputs.currency), [inputs.currency])

    return (
        <Reorder.Group axis="y" values={pairPanels} onReorder={setPairPanels} className="mt-6 grid gap-6 lg:grid-cols-2">
            {pairPanels.map((key, idx) => (
                <Reorder.Item key={key} value={key} className="cursor-grab active:cursor-grabbing">
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: idx * 0.06 }}>
                        {key === "roi" ? (
                            <Card>
                                <CardHeader>
                                    <CardTitle>ROI Curve</CardTitle>
                                    <CardDescription>Cumulative revenue per PC vs build cost</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <RoiCurve inputs={inputs} />
                                </CardContent>
                            </Card>
                        ) : (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Financial Summary</CardTitle>
                                    <CardDescription>Key monthly totals and payments</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span>💵 Gross revenue / month</span>
                                            <span className="font-medium tabular-nums">{fmt(grossMonthly)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">🧰 Maintenance (all PCs)</span>
                                            <span className="font-medium tabular-nums">{maintMonthly > 0 ? fmt(maintMonthly) : "—"}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">💡 Electricity cost</span>
                                            <span className="font-medium tabular-nums">{powerCost > 0 ? fmt(powerCost) : "—"}</span>
                                        </div>
                                        <Separator />
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">📈 Net revenue</span>
                                            <span className="font-medium tabular-nums">{fmt(netMonthly)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">🏦 Loan payment / month</span>
                                            <span className="font-medium tabular-nums">{loan.monthlyPayment > 0 ? fmt(loan.monthlyPayment) : "—"}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">💸 PCs purchasable (cash)</span>
                                            <span className="font-medium tabular-nums">{investPcs}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </motion.div>
                </Reorder.Item>
            ))}
        </Reorder.Group>
    )
}
