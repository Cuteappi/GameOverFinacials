"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"
import { AppSidebar } from "@/components/app/AppSidebar"
import { KpiGrid } from "@/components/dashboard/KpiGrid"
import { MainChart } from "@/components/dashboard/MainChart"
import { SecondaryPanels } from "@/components/dashboard/SecondaryPanels"
import { PairPanels } from "@/components/dashboard/PairPanels"
import { FinancingSummary } from "@/components/dashboard/FinancingSummary"
import { ScenarioSection } from "@/components/dashboard/ScenarioSection"
import { useAppStore } from "@/lib/store"
import { CustomScroll } from "@/components/app/CustomScroll"

export default function Home() {
	const resetLayout = useAppStore((s) => s.resetLayout)

	return (
		<div className="h-screen aurora-bg flex flex-col">
			<ResizablePanelGroup direction="horizontal" className="flex-1 h-full">
				{/* Sidebar: Inputs (resizable) */}
				<ResizablePanel defaultSize={24} minSize={16} maxSize={40} className="min-w-[240px] min-h-0 h-full">
					<AppSidebar />
				</ResizablePanel>

				<ResizableHandle withHandle />

				{/* Main: KPIs + Charts + Panels (scrollable) */}
				<ResizablePanel defaultSize={76} minSize={40}>
					<CustomScroll className="flex">
						<div className="p-4 pr-3 overflow-y-hidden">
							<div className="flex items-center gap-4 h-[380px]">
								<KpiGrid />
								<MainChart />
							</div>



							<PairPanels />
							<SecondaryPanels />

							{/* <ScenarioSection /> */}
						</div>
					</CustomScroll>
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	)
}
