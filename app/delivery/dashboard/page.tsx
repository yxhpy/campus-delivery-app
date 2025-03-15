"use client"

import { useEffect, useState } from "react"
import { DeliveryStats } from "@/components/delivery/DeliveryStats"
import { DeliveryOrderList } from "@/components/delivery/DeliveryOrderList"
import { DeliveryRouteMap } from "@/components/delivery/DeliveryRouteMap"
import { useNotification } from "@/lib/notification-context"

interface Stats {
  totalOrders: number
  completedOrders: number
  totalEarnings: number
  rating: number
}

interface Order {
  id: string
  restaurantName: string
  customerAddress: string
  status: "pending" | "delivering" | "completed"
  amount: number
  createdAt: string
}

export default function DeliveryDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    completedOrders: 0,
    totalEarnings: 0,
    rating: 0,
  })

  const [orders, setOrders] = useState<Order[]>([])
  const { addNotification } = useNotification()

  useEffect(() => {
    // 获取统计数据
    fetch("/api/delivery/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((error) => console.error("获取统计数据失败:", error))

    // 获取订单列表
    fetch("/api/delivery/orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data)
        
        // 如果有新订单，发送通知
        const newOrders = data.filter((order: Order) => order.status === "pending")
        if (newOrders.length > 0) {
          addNotification({
            type: "order",
            title: "新订单提醒",
            message: `您有 ${newOrders.length} 个新订单待接单`
          })
        }
      })
      .catch((error) => console.error("获取订单列表失败:", error))
      
    // 模拟实时订单通知
    const orderInterval = setInterval(() => {
      const random = Math.random()
      if (random < 0.3) { // 30%的概率收到新订单
        const newOrder: Order = {
          id: `order-${Date.now()}`,
          restaurantName: "快乐食堂",
          customerAddress: "3号宿舍楼",
          status: "pending",
          amount: Math.floor(Math.random() * 50) + 10,
          createdAt: new Date().toISOString()
        }
        
        setOrders(prev => [newOrder, ...prev])
        
        addNotification({
          type: "order",
          title: "新订单提醒",
          message: `您收到来自${newOrder.restaurantName}的新订单，配送至${newOrder.customerAddress}`
        })
      }
    }, 60000) // 每分钟检查一次
    
    return () => clearInterval(orderInterval)
  }, [addNotification])

  const handleAcceptOrder = async (orderId: string) => {
    try {
      const response = await fetch(`/api/delivery/orders/${orderId}/accept`, {
        method: "POST",
      })
      if (response.ok) {
        // 更新订单状态
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId
              ? { ...order, status: "delivering" }
              : order
          )
        )
        
        // 发送通知
        const order = orders.find(o => o.id === orderId)
        if (order) {
          addNotification({
            type: "order",
            title: "接单成功",
            message: `您已成功接单：${order.restaurantName} - ${order.customerAddress}`
          })
        }
      }
    } catch (error) {
      console.error("接单失败:", error)
    }
  }

  const handleCompleteOrder = async (orderId: string) => {
    try {
      const response = await fetch(`/api/delivery/orders/${orderId}/complete`, {
        method: "POST",
      })
      if (response.ok) {
        // 更新订单状态
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId
              ? { ...order, status: "completed" }
              : order
          )
        )
        // 更新统计数据
        setStats((prevStats) => ({
          ...prevStats,
          completedOrders: prevStats.completedOrders + 1,
        }))
        
        // 发送通知
        const order = orders.find(o => o.id === orderId)
        if (order) {
          addNotification({
            type: "order",
            title: "订单已完成",
            message: `您已完成订单：${order.restaurantName} - ${order.customerAddress}`
          })
        }
      }
    } catch (error) {
      console.error("完成订单失败:", error)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-8">配送员仪表盘</h1>
      <div className="space-y-8">
        <DeliveryStats stats={stats} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">订单列表</h2>
            <DeliveryOrderList
              orders={orders}
              onAcceptOrder={handleAcceptOrder}
              onCompleteOrder={handleCompleteOrder}
            />
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">配送路线规划</h2>
            <DeliveryRouteMap />
          </div>
        </div>
      </div>
    </div>
  )
} 