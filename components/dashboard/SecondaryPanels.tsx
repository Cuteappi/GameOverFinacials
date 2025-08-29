"use client"

import * as React from "react"
import { Reorder, motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { WeekdayWeekendBar } from "@/components/dashboard/charts/WeekdayWeekendBar"
import { WeekdayWeekendPie } from "@/components/dashboard/charts/WeekdayWeekendPie"
import { SensitivityRoi } from "@/components/dashboard/charts/SensitivityRoi"
import { useAppStore } from "@/lib/store"
import { sensitivityRoi, weekdayWeekendRevenue } from "@/lib/calc"

export function SecondaryPanels() {
  const inputs = useAppStore((s) => s.inputs)
  const secPanels = useAppStore((s) => s.secPanels)
  const setSecPanels = useAppStore((s) => s.setSecPanels)
  const showSensitivity = useAppStore((s) => s.showSensitivity)
  const setShowSensitivity = useAppStore((s) => s.setShowSensitivity)

  const ww = React.useMemo(() => weekdayWeekendRevenue(inputs), [inputs])
  const sens = React.useMemo(() => sensitivityRoi(inputs), [inputs])

  return (
    <Reorder.Group
      axis="y"
      values={secPanels}
      onReorder={setSecPanels}
      className="mt-6 grid gap-6 lg:grid-cols-3"
    >
      {secPanels.map((key, idx) => (
        <Reorder.Item key={key} value={key} className="lg:col-span-1 cursor-grab active:cursor-grabbing">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: idx * 0.04 }}>
            {key === "weekdayBar" && (
              <Card>
                <CardHeader>
                  <CardTitle>Weekday vs Weekend (Revenue)</CardTitle>
                  <CardDescription>Breakdown of monthly revenue sources</CardDescription>
                </CardHeader>
                <CardContent>
                  <WeekdayWeekendBar
                    data={[
                      { name: "Weekdays", value: ww.weekday },
                      { name: "Weekends", value: ww.weekend },
                    ]}
                    currency={inputs.currency}
                  />
                </CardContent>
              </Card>
            )}
            {key === "weekdayPie" && (
              <Card>
                <CardHeader>
                  <CardTitle>Contribution</CardTitle>
                  <CardDescription>Weekdays vs Weekends</CardDescription>
                </CardHeader>
                <CardContent>
                  <WeekdayWeekendPie weekday={ww.weekday} weekend={ww.weekend} currency={inputs.currency} />
                </CardContent>
              </Card>
            )}
            {key === "sensitivity" && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Sensitivity Analysis</CardTitle>
                      <CardDescription>How ROI shifts with price and usage</CardDescription>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Show</span>
                      <Switch checked={showSensitivity} onCheckedChange={setShowSensitivity} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {showSensitivity ? (
                    <SensitivityRoi data={sens} />
                  ) : (
                    <div className="text-sm text-muted-foreground">Hidden</div>
                  )}
                </CardContent>
              </Card>
            )}
          </motion.div>
        </Reorder.Item>
      ))}
    </Reorder.Group>
  )
}
