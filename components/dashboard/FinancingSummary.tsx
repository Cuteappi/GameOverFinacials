"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useAppStore } from "@/lib/store"
import { loanTotals } from "@/lib/calc"
import { formatCurrency } from "@/lib/currency"

export function FinancingSummary() {
  const inputs = useAppStore((s) => s.inputs)
  const loan = React.useMemo(
    () => loanTotals(inputs.loanAmount ?? 0, inputs.loanRateAnnual ?? 0, inputs.loanTermMonths ?? 0),
    [inputs]
  )
  const fmt = React.useCallback((n: number) => formatCurrency(n, inputs.currency), [inputs.currency])

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Financing Summary</CardTitle>
          <CardDescription>Loan payment estimates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Monthly payment</span>
              <span className="font-medium tabular-nums">{loan.monthlyPayment ? fmt(loan.monthlyPayment) : "—"}</span>
            </div>
            <div className="flex justify-between">
              <span>Total interest</span>
              <span className="font-medium tabular-nums">{loan.totalInterest ? fmt(loan.totalInterest) : "—"}</span>
            </div>
            <div className="flex justify-between">
              <span>Total paid</span>
              <span className="font-medium tabular-nums">{loan.totalPaid ? fmt(loan.totalPaid) : "—"}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
