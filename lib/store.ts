"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Inputs } from "@/lib/calc"

export const defaultInputs: Inputs = {
  pcBuildCost: 120000,
  weekdayHours: 6,
  weekendHours: 10,
  pcs: 10,
  hourlyRate: 50,
  currency: "INR",
}

type PanelKey = "weekdayBar" | "weekdayPie" | "sensitivity"
type PairKey = "roi" | "engagement"

type StoreState = {
  inputs: Inputs
  showSensitivity: boolean
  secPanels: PanelKey[]
  pairPanels: PairKey[]
  // actions
  setInputs: (partial: Partial<Inputs>) => void
  setShowSensitivity: (v: boolean) => void
  setSecPanels: (keys: PanelKey[]) => void
  setPairPanels: (keys: PairKey[]) => void
  resetLayout: () => void
}

export const useAppStore = create<StoreState>()(
  persist(
    (set) => ({
      inputs: defaultInputs,
      showSensitivity: true,
      secPanels: ["weekdayBar", "weekdayPie", "sensitivity"],
      pairPanels: ["roi", "engagement"],
      setInputs: (partial) => set((s) => ({ inputs: { ...s.inputs, ...partial } })),
      setShowSensitivity: (v) => set({ showSensitivity: v }),
      setSecPanels: (keys) => set({ secPanels: keys }),
      setPairPanels: (keys) => set({ pairPanels: keys }),
      resetLayout: () =>
        set({
          secPanels: ["weekdayBar", "weekdayPie", "sensitivity"],
          pairPanels: ["roi", "engagement"],
        }),
    }),
    {
      name: "go:app-store",
      partialize: (s) => ({ inputs: s.inputs, showSensitivity: s.showSensitivity, secPanels: s.secPanels, pairPanels: s.pairPanels }),
      version: 1,
    }
  )
)
