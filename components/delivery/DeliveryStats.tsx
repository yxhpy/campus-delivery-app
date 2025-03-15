"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DeliveryStatsProps {
  stats: {
    totalOrders: number
    completedOrders: number
    totalEarnings: number
    rating: number
  }
}

export function DeliveryStats({ stats }: DeliveryStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">总订单数</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalOrders}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">已完成订单</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.completedOrders}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">总收入</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">¥{stats.totalEarnings.toFixed(2)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">评分</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.rating.toFixed(1)}</div>
        </CardContent>
      </Card>
    </div>
  )
} 