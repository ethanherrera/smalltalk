import { useState } from "react"
import { Flame, Lightbulb, LineChart } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "../ui/button"

export function Metrics() {
    const navigate = useNavigate()
    const [metrics, setMetrics] = useState<{
        streak: number,
        weeklyScore: number,
        concepts: number
    }>({
        streak: 5,
        weeklyScore: 69,
        concepts: 27
    })

  const handleMetricsClick = () => {
    navigate('/performance')
  }

  return (
    <div>
        <Card 
        className="p-6 cursor-pointer hover:bg-gray-50 transition-colors" 
        onClick={handleMetricsClick}
        >
        <CardContent className="flex items-start justify-between p-0">
            <div className="flex flex-col items-center gap-2 px-4">
            <Flame className="h-8 w-8 text-chart-1" />
            <span className="text-xs font-small">{metrics.streak} days</span>
            <span className="text-xs font-bold">Streak</span>
            </div>
            
            <Separator orientation="vertical" className="h-16" />
            
            <div className="flex flex-col items-center gap-2 px-4">
            <LineChart className="h-8 w-8 text-chart-2" />
            <span className="text-xs font-small">{metrics.weeklyScore}/100</span>
            <span className="text-xs font-bold">Weekly Score</span>
            </div>
            
            <Separator orientation="vertical" className="h-16" />
            
            <div className="flex flex-col items-center gap-2 px-4">
            <Lightbulb className="h-8 w-8 text-chart-3" />
            <span className="text-xs font-small">{metrics.concepts}</span>
                <span className="text-xs font-bold">Concepts</span>
            </div>
        </CardContent>
        </Card>
    <Button variant="outline" className="w-full" onClick={handleMetricsClick}>View All</Button>
    </div>
  )
}
