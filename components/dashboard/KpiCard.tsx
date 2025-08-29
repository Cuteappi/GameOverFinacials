"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"

export function KpiCard({
	title,
	value,
	valueNumeric,
	description,
	className,
	action,
}: {
	title: string
	value: React.ReactNode
	valueNumeric?: number
	description?: string
	className?: string
	action?: React.ReactNode
}) {
	const key = Number.isFinite(valueNumeric as number) ? (valueNumeric as number) : undefined
	return (
		<div className="h-full">
			<Card className="h-full flex justify-between pt-6">
				<CardHeader className=" h-full flex-row items-center justify-between ">
					<div>
						<CardTitle className="text-md text-muted-foreground">{title}</CardTitle>
						{description ? (
							<CardDescription className="mt-1 text-xs">{description}</CardDescription>
						) : null}
					</div>
					{action ? <div data-slot="card-action">{action}</div> : null}
				</CardHeader>
				<CardContent className="h-full">
					<div className="text-2xl h-full font-semibold tabular-nums pt-6">
						<AnimatePresence mode="popLayout" initial={false}>
							<motion.div
								key={key}
								initial={{ opacity: 0, y: 4 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -4 }}
								transition={{ duration: 0.18 }}
							>
								{value}
							</motion.div>
						</AnimatePresence>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
