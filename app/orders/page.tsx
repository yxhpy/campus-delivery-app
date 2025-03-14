"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useUser } from "@/lib/user-context"
import Link from "next/link"
import { ArrowLeft, Clock, Package, CheckCircle, AlertCircle, ChevronRight } from "lucide-react"

// 订单状态类型
type OrderStatus = "pending" | "processing" | "delivered" | "cancelled"

// 订单项类型
interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

// 订单类型
interface Order {
  id: string
  merchantName: string
  items: OrderItem[]
  totalAmount: number
  status: OrderStatus
  createdAt: string
  updatedAt: string
  deliveryAddress: string
  estimatedDeliveryTime?: string
}

// 模拟订单数据
const mockOrders: Order[] = [
  {
    id: "order-001",
    merchantName: "学生食堂",
    items: [
      {
        id: "item-001",
        name: "红烧牛肉面",
        price: 15,
        quantity: 1,
        image: "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=800"
      },
      {
        id: "item-002",
        name: "蒸饺",
        price: 8,
        quantity: 2,
        image: "https://images.pexels.com/photos/5409010/pexels-photo-5409010.jpeg?auto=compress&cs=tinysrgb&w=800"
      }
    ],
    totalAmount: 31,
    status: "delivered",
    createdAt: "2024-03-10T14:30:00Z",
    updatedAt: "2024-03-10T15:15:00Z",
    deliveryAddress: "校园公寓 3号楼 512室",
    estimatedDeliveryTime: "30-45分钟"
  },
  {
    id: "order-002",
    merchantName: "奶茶店",
    items: [
      {
        id: "item-003",
        name: "珍珠奶茶",
        price: 12,
        quantity: 2,
        image: "https://images.pexels.com/photos/3551717/pexels-photo-3551717.jpeg?auto=compress&cs=tinysrgb&w=800"
      }
    ],
    totalAmount: 24,
    status: "processing",
    createdAt: "2024-03-13T10:15:00Z",
    updatedAt: "2024-03-13T10:20:00Z",
    deliveryAddress: "校园公寓 3号楼 512室",
    estimatedDeliveryTime: "15-30分钟"
  },
  {
    id: "order-003",
    merchantName: "便利店",
    items: [
      {
        id: "item-004",
        name: "薯片",
        price: 6,
        quantity: 1,
        image: "https://images.pexels.com/photos/1893555/pexels-photo-1893555.jpeg?auto=compress&cs=tinysrgb&w=800"
      },
      {
        id: "item-005",
        name: "矿泉水",
        price: 2,
        quantity: 2,
        image: "https://images.pexels.com/photos/327090/pexels-photo-327090.jpeg?auto=compress&cs=tinysrgb&w=800"
      }
    ],
    totalAmount: 10,
    status: "pending",
    createdAt: "2024-03-14T09:00:00Z",
    updatedAt: "2024-03-14T09:00:00Z",
    deliveryAddress: "校园公寓 3号楼 512室",
    estimatedDeliveryTime: "20-35分钟"
  }
]

// 获取状态图标
const getStatusIcon = (status: OrderStatus) => {
  switch (status) {
    case "pending":
      return <Clock className="h-5 w-5 text-yellow-500" />
    case "processing":
      return <Package className="h-5 w-5 text-blue-500" />
    case "delivered":
      return <CheckCircle className="h-5 w-5 text-green-500" />
    case "cancelled":
      return <AlertCircle className="h-5 w-5 text-red-500" />
  }
}

// 获取状态文本
const getStatusText = (status: OrderStatus) => {
  switch (status) {
    case "pending":
      return "待处理"
    case "processing":
      return "配送中"
    case "delivered":
      return "已送达"
    case "cancelled":
      return "已取消"
  }
}

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export default function OrdersPage() {
  const router = useRouter()
  const { isAuthenticated } = useUser()
  const [orders, setOrders] = useState<Order[]>([])
  
  // 如果未登录，重定向到登录页面
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login")
    } else {
      // 模拟从API获取订单数据
      setOrders(mockOrders)
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800">
          <ArrowLeft className="mr-1 h-4 w-4" />
          返回首页
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">我的订单</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-lg font-medium">暂无订单</h2>
          <p className="text-muted-foreground mt-1 mb-4">
            您还没有下过任何订单，去浏览商家并下单吧！
          </p>
          <Button asChild>
            <Link href="/">
              浏览商家
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="bg-muted/50 py-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    {order.merchantName}
                  </CardTitle>
                  <div className="flex items-center">
                    {getStatusIcon(order.status)}
                    <span className="ml-1 text-sm">{getStatusText(order.status)}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm text-muted-foreground">
                    订单号: {order.id}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(order.createdAt)}
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 mb-3">
                  {order.items.slice(0, 3).map(item => (
                    <div key={item.id} className="h-16 w-16 rounded overflow-hidden">
                      {item.image && (
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className="h-16 w-16 rounded bg-muted flex items-center justify-center">
                      <span className="text-sm text-muted-foreground">
                        +{order.items.length - 3}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-muted-foreground">
                      共{order.items.reduce((sum, item) => sum + item.quantity, 0)}件商品
                    </span>
                    <div className="font-medium">
                      ¥{order.totalAmount.toFixed(2)}
                    </div>
                  </div>
                  
                  <Button variant="outline" asChild>
                    <Link href={`/orders/${order.id}`}>
                      查看详情
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 