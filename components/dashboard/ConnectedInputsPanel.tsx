"use client"

import * as React from "react"
import { InputsPanel } from "@/components/dashboard/InputsPanel"
import { useAppStore } from "@/lib/store"

export function ConnectedInputsPanel() {
  const inputs = useAppStore((s) => s.inputs)
  const setInputs = useAppStore((s) => s.setInputs)
  return <InputsPanel value={inputs} onChange={setInputs} />
}
