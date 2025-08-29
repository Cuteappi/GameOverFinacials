"use client"

import * as React from "react"
import {
	SidebarProvider,
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarFooter,
	SidebarSeparator,
} from "@/components/ui/sidebar"
import { ConnectedInputsPanel } from "../dashboard/ConnectedInputsPanel"
import { CustomScroll } from "./CustomScroll"
import { Gamepad2 } from "lucide-react"

// App-specific wrapper around the shadcn/ui Sidebar primitives.
// Keeps page code clean while still allowing you to pass custom children.
export function AppSidebar() {
	return (
		<SidebarProvider className="h-full w-full min-h-0">
			<Sidebar
				collapsible="none"
				className="h-full w-full min-h-0 flex flex-col backdrop-blur-xl bg-gradient-to-b from-black/30 via-background/50 to-background/10"
			>
				<SidebarHeader className="p-2">
					<div className="flex items-center justify-between gap-2 pt-2">
						<div className="flex items-center gap-2">
							<div className="size-8 rounded-lg glass-panel flex items-center justify-center">
								<Gamepad2 className="size-5 text-foreground" />
							</div>
							<div className="leading-tight">
								<div className="flex items-center gap-2">
									<span className="text-xl font-semibold text-foreground">
										GameOver
									</span>
									<span className="text-[10px] px-2 py-0.5 rounded-full border border-border bg-accent/60 text-foreground/80">
										Beta
									</span>
								</div>
								<span className="text-xs text-muted-foreground">Finance simulator</span>
							</div>
						</div>
					</div>
				</SidebarHeader>
				<SidebarSeparator />
				<CustomScroll className="flex-1 min-h-0">
					<SidebarContent className="p-4 pr-4.5 flex-1 min-h-0 overflow-hidden">
						<ConnectedInputsPanel />
					</SidebarContent>
				</CustomScroll>
			</Sidebar>
		</SidebarProvider>
	)
}
