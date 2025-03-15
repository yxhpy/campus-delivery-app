"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useUser } from "@/lib/user-context"
import Link from "next/link"
import { ArrowLeft, Clock, Package, CheckCircle, AlertCircle, ChevronRight } from "lucide-react"
import { getOrders, Order, OrderStatus } from "@/lib/order-service"
import { toast } from "sonner"

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
  const [loading, setLoading] = useState(true)
  
  // 如果未登录，重定向到登录页面
  useEffect(() => {
    if (!isAuthenticated) {
      console.log('用户未登录，重定向到登录页面');
      router.push("/auth/login")
    } else {
      // 从本地存储获取订单数据
      console.log('用户已登录，开始获取订单数据');
      setLoading(true)
      try {
        const storedOrders = getOrders()
        console.log('订单页面获取到订单数量:', storedOrders.length)
        if (storedOrders.length > 0) {
          console.log('订单数据示例:', JSON.stringify(storedOrders[0]));
        }
        setOrders(storedOrders)
      } catch (error) {
        console.error('获取订单失败:', error)
        toast.error('获取订单失败，请刷新页面重试')
      } finally {
        setLoading(false)
      }
    }
  }, [isAuthenticated, router])

  // 添加一个刷新订单的函数
  const refreshOrders = () => {
    console.log('手动刷新订单数据');
    setLoading(true)
    try {
      const storedOrders = getOrders()
      console.log('刷新订单，获取到订单数量:', storedOrders.length)
      if (storedOrders.length > 0) {
        console.log('刷新后的订单数据示例:', JSON.stringify(storedOrders[0]));
      }
      setOrders(storedOrders)
    } catch (error) {
      console.error('刷新订单失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 每次页面显示时刷新订单
  useEffect(() => {
    if (isAuthenticated) {
      console.log('页面加载完成，自动刷新订单');
      refreshOrders()
    }
    
    // 添加页面可见性变化监听，当用户返回页面时刷新订单
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isAuthenticated) {
        console.log('页面变为可见，刷新订单')
        refreshOrders()
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return null
  }
  
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800">
            <ArrowLeft className="mr-1 h-4 w-4" />
            返回首页
          </Link>
        </div>
        <h1 className="text-2xl font-bold mb-6">我的订单</h1>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">加载订单中...</p>
        </div>
      </div>
    )
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