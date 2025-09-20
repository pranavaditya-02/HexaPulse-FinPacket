"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, Plus, X } from "lucide-react"

interface AlertRule {
  id: string
  symbol: string
  condition: "above" | "below" | "change"
  value: number
  enabled: boolean
}

export function AlertSettings() {
  const [alertRules, setAlertRules] = useState<AlertRule[]>([
    { id: "1", symbol: "AAPL", condition: "above", value: 180, enabled: true },
    { id: "2", symbol: "TSLA", condition: "below", value: 200, enabled: true },
    { id: "3", symbol: "NVDA", condition: "change", value: 5, enabled: false },
  ])

  const [newRule, setNewRule] = useState({
    symbol: "",
    condition: "above" as const,
    value: 0,
  })

  const addRule = () => {
    if (newRule.symbol && newRule.value > 0) {
      const rule: AlertRule = {
        id: Date.now().toString(),
        ...newRule,
        enabled: true,
      }
      setAlertRules([...alertRules, rule])
      setNewRule({ symbol: "", condition: "above", value: 0 })
    }
  }

  const removeRule = (id: string) => {
    setAlertRules(alertRules.filter((rule) => rule.id !== id))
  }

  const toggleRule = (id: string) => {
    setAlertRules(alertRules.map((rule) => (rule.id === id ? { ...rule, enabled: !rule.enabled } : rule)))
  }

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="w-5 h-5 text-primary" />
          <span>Alert Settings</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New Rule */}
        <div className="space-y-4 p-4 rounded-lg glass-strong">
          <h4 className="font-semibold text-sm">Create New Alert</h4>

          <div className="space-y-3">
            <div>
              <Label htmlFor="symbol" className="text-xs">
                Stock Symbol
              </Label>
              <Input
                id="symbol"
                placeholder="e.g., AAPL"
                value={newRule.symbol}
                onChange={(e) => setNewRule({ ...newRule, symbol: e.target.value.toUpperCase() })}
                className="h-8"
              />
            </div>

            <div>
              <Label htmlFor="condition" className="text-xs">
                Condition
              </Label>
              <Select
                value={newRule.condition}
                onValueChange={(value: any) => setNewRule({ ...newRule, condition: value })}
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="above">Price Above</SelectItem>
                  <SelectItem value="below">Price Below</SelectItem>
                  <SelectItem value="change">Daily Change %</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="value" className="text-xs">
                {newRule.condition === "change" ? "Percentage" : "Price ($)"}
              </Label>
              <Input
                id="value"
                type="number"
                placeholder="0"
                value={newRule.value || ""}
                onChange={(e) => setNewRule({ ...newRule, value: Number.parseFloat(e.target.value) || 0 })}
                className="h-8"
              />
            </div>

            <Button onClick={addRule} size="sm" className="w-full">
              <Plus className="w-4 h-4 mr-1" />
              Add Alert
            </Button>
          </div>
        </div>

        {/* Existing Rules */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Active Alerts</h4>
          {alertRules.map((rule) => (
            <div key={rule.id} className="flex items-center justify-between p-3 rounded-lg glass-strong">
              <div className="flex items-center space-x-3">
                <Switch checked={rule.enabled} onCheckedChange={() => toggleRule(rule.id)} />
                <div className="text-sm">
                  <div className="font-medium">{rule.symbol}</div>
                  <div className="text-muted-foreground text-xs">
                    {rule.condition === "above" && `Above $${rule.value}`}
                    {rule.condition === "below" && `Below $${rule.value}`}
                    {rule.condition === "change" && `Change > ${rule.value}%`}
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => removeRule(rule.id)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
