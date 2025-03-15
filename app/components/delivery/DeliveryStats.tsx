"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Truck, Timer, CreditCard } from "lucide-react"
import { cn } from "@/lib/utils"

export interface DeliveryStatsProps extends React.HTMLAttributes<HTMLDivElement> {
  stats: {
    totalDeliveries: number
    completedToday: number
    averageTime: string
    totalEarnings: number
  }
}

const DeliveryStats = React.forwardRef<HTMLDivElement, DeliveryStatsProps>(
  ({ stats, className, ...props }, ref) => {
    const items = [
      {
        title: "总配送订单",
        value: stats.totalDeliveries,
        icon: Package,
        description: "累计完成的配送订单数",
      },
      {
        title: "今日完成",
        value: stats.completedToday,
        icon: Truck,
        description: "今日已完成的配送订单数",
      },
      {
        title: "平均配送时间",
        value: stats.averageTime,
        icon: Timer,
        description: "平均每单配送时间",
      },
      {
        title: "总收入",
        value: `¥${stats.totalEarnings.toFixed(2)}`,
        icon: CreditCard,
        description: "累计配送收入",
      },
    ]

    return (
      <div
        ref={ref}
        className={cn("grid gap-4 md:grid-cols-2 lg:grid-cols-4", className)}
        {...props}
      >
        {items.map((item) => (
          <Card key={item.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {item.title}
              </CardTitle>
              <item.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
              <p className="text-xs text-muted-foreground">
                {item.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }
)

DeliveryStats.displayName = "DeliveryStats"

export { DeliveryStats } 