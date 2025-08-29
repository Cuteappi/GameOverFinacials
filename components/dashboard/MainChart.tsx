"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { MainRevenueVsPcs } from "@/components/dashboard/charts/MainRevenueVsPcs"
import { useAppStore } from "@/lib/store"
import { pcsRevenueSeries } from "@/lib/calc"

export function MainChart() {
	const inputs = useAppStore((s) => s.inputs)
	const data = React.useMemo(() => pcsRevenueSeries(inputs, 30), [inputs])
	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between gap-3">
					<div>
						<CardTitle>PCs vs Monthly Revenue</CardTitle>
						<CardDescription>Revenue scales linearly with additional PCs</CardDescription>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<MainRevenueVsPcs data={data} currency={inputs.currency} />
			</CardContent>
		</Card>
	)
}
