"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { TrendingUp, BarChart3 } from "lucide-react"

const alertTypeData = [
  { name: "Price", value: 35, color: "#4169E1" },
  { name: "Volume", value: 25, color: "#DBBC58" },
  { name: "News", value: 25, color: "#2ECC71" },
  { name: "Technical", value: 15, color: "#E74C3C" },
]

const severityData = [
  { name: "Mon", high: 4, medium: 8, low: 12 },
  { name: "Tue", high: 6, medium: 10, low: 8 },
  { name: "Wed", high: 3, medium: 12, low: 15 },
  { name: "Thu", high: 8, medium: 6, low: 10 },
  { name: "Fri", high: 5, medium: 9, low: 14 },
  { name: "Sat", high: 2, medium: 4, low: 6 },
  { name: "Sun", high: 1, medium: 3, low: 8 },
]

export function AlertAnalytics() {
  const totalAlerts = alertTypeData.reduce((sum, item) => sum + item.value, 0)
  const highSeverityCount = severityData.reduce((sum, day) => sum + day.high, 0)
  const accuracyRate = 87.5 // Mock accuracy rate

  return (
    <div className="space-y-6">
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            <span>Alert Analytics</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center space-y-1">
              <div className="text-2xl font-bold">{totalAlerts}</div>
              <div className="text-xs text-muted-foreground">Total Alerts (7d)</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-2xl font-bold text-destructive">{highSeverityCount}</div>
              <div className="text-xs text-muted-foreground">High Severity</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-2xl font-bold text-accent">{accuracyRate}%</div>
              <div className="text-xs text-muted-foreground">Accuracy Rate</div>
            </div>
          </div>

          {/* Alert Types Distribution */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Alert Types Distribution</h4>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={alertTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={50}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {alertTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {alertTypeData.map((item) => (
                <div key={item.name} className="flex items-center space-x-2 text-xs">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }}></div>
                  <span>
                    {item.name}: {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Severity Trend */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Weekly Severity Trend</h4>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={severityData}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} className="text-xs" />
                  <YAxis axisLine={false} tickLine={false} className="text-xs" />
                  <Bar dataKey="high" stackId="a" fill="#E74C3C" />
                  <Bar dataKey="medium" stackId="a" fill="#DBBC58" />
                  <Bar dataKey="low" stackId="a" fill="#2ECC71" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center space-x-4 text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-destructive rounded"></div>
                <span>High</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-secondary rounded"></div>
                <span>Medium</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-accent rounded"></div>
                <span>Low</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-accent" />
            <span>Alert Performance</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>Prediction Accuracy</span>
              <span className="font-semibold">{accuracyRate}%</span>
            </div>
            <Progress value={accuracyRate} className="h-2" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>Response Time</span>
              <span className="font-semibold">2.3s avg</span>
            </div>
            <Progress value={85} className="h-2" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>False Positive Rate</span>
              <span className="font-semibold">12.5%</span>
            </div>
            <Progress value={12.5} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="text-center p-3 rounded-lg glass-strong">
              <div className="text-lg font-bold text-accent">94%</div>
              <div className="text-xs text-muted-foreground">User Satisfaction</div>
            </div>
            <div className="text-center p-3 rounded-lg glass-strong">
              <div className="text-lg font-bold text-primary">1.2s</div>
              <div className="text-xs text-muted-foreground">Avg Alert Delay</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
