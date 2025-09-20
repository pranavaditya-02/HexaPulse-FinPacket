"use client";
import { Navigation } from "@/components/navigation"
import { RealTimeAlerts } from "@/components/real-time-alerts"
import { AlertSettings } from "@/components/alert-settings"
import { AlertAnalytics } from "@/components/alert-analytics"

export default function AlertsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Risk Radar Alerts</h1>
          <p className="text-muted-foreground">
            Stay informed about market-moving events and potential risks to your portfolio
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <RealTimeAlerts />
            <AlertAnalytics />
          </div>
          <div>
            <AlertSettings />
          </div>
        </div>
      </main>
    </div>
  )
}
