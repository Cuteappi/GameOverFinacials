"use client"

import * as React from "react"
import { ScenarioComparison } from "@/components/dashboard/ScenarioComparison"
import { useAppStore } from "@/lib/store"

export function ScenarioSection() {
  const inputs = useAppStore((s) => s.inputs)
  return (
    <div className="mt-6">
      <ScenarioComparison current={inputs} />
    </div>
  )
}
