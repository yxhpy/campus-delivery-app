"use client"

import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DeliveryStats } from "@/components/delivery/DeliveryStats"
import { DeliveryOrderList } from "@/components/delivery/DeliveryOrderList"

// 模拟数据
const mockStats = {
  totalOrders: 125,
  completedOrders: 98,
  totalEarnings: 1250.75,
  rating: 4.8,
}

const mockOrders = [
  {
    id: "ORD-001",
    restaurantName: "麦当劳（大学城店）",
    customerAddress: "大学城第一宿舍楼 3单元 502",
    status: "pending",
    amount: 35.5,
    createdAt: "2023-05-15 12:30",
  },
  {
    id: "ORD-002",
    restaurantName: "肯德基（大学城店）",
    customerAddress: "大学城第二宿舍楼 2单元 305",
    status: "delivering",
    amount: 42.0,
    createdAt: "2023-05-15 12:45",
  },
  {
    id: "ORD-003",
    restaurantName: "必胜客（大学城店）",
    customerAddress: "大学城第三宿舍楼 1单元 101",
    status: "completed",
    amount: 88.0,
    createdAt: "2023-05-15 11:30",
  },
]

export default function DeliveryDashboard() {
  const [stats, setStats] = React.useState(mockStats)
  const [orders, setOrders] = React.useState(mockOrders)

  const handleAcceptOrder = (orderId: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: "delivering" } : order
      )
    )
  }

  const handleCompleteOrder = (orderId: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: "completed" } : order
      )
    )
    setStats((prevStats) => ({
      ...prevStats,
      completedOrders: prevStats.completedOrders + 1,
    }))
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-8">配送员仪表盘</h1>
      <div className="space-y-8">
        <DeliveryStats stats={stats} />
        <div>
          <h2 className="text-xl font-semibold mb-4">订单列表</h2>
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">全部订单</TabsTrigger>
              <TabsTrigger value="pending">待接单</TabsTrigger>
              <TabsTrigger value="delivering">配送中</TabsTrigger>
              <TabsTrigger value="completed">已完成</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <DeliveryOrderList
                orders={orders}
                onAcceptOrder={handleAcceptOrder}
                onCompleteOrder={handleCompleteOrder}
              />
            </TabsContent>
            <TabsContent value="pending">
              <DeliveryOrderList
                orders={orders.filter((order) => order.status === "pending")}
                onAcceptOrder={handleAcceptOrder}
                onCompleteOrder={handleCompleteOrder}
              />
            </TabsContent>
            <TabsContent value="delivering">
              <DeliveryOrderList
                orders={orders.filter((order) => order.status === "delivering")}
                onAcceptOrder={handleAcceptOrder}
                onCompleteOrder={handleCompleteOrder}
              />
            </TabsContent>
            <TabsContent value="completed">
              <DeliveryOrderList
                orders={orders.filter((order) => order.status === "completed")}
                onAcceptOrder={handleAcceptOrder}
                onCompleteOrder={handleCompleteOrder}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
} 