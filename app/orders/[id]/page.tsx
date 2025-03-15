"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useUser } from "@/lib/user-context"
import Link from "next/link"
import { ArrowLeft, Clock, Package, CheckCircle, AlertCircle, MapPin, Phone, Calendar } from "lucide-react"
import { getOrderById, Order, OrderStatus } from "@/lib/order-service"
import { toast } from "sonner"

// 订单状态类型
// type OrderStatus = "pending" | "processing" | "delivered" | "cancelled"

// 订单项类型
// interface OrderItem {
//   id: string
//   name: string
//   price: number
//   quantity: number
//   image?: string
// }

// 订单类型
// interface Order {
//   id: string
//   merchantName: string
//   merchantId: string
//   items: OrderItem[]
//   totalAmount: number
//   status: OrderStatus
//   createdAt: string
//   updatedAt: string
//   deliveryAddress: string
//   estimatedDeliveryTime?: string
//   paymentMethod: string
//   deliveryFee: number
//   serviceFee: number
//   contactPhone?: string
//   deliveryNotes?: string
// }

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

// 订单状态步骤
const orderSteps = [
  { status: "pending", label: "订单已提交" },
  { status: "processing", label: "商家已接单" },
  { status: "processing", label: "骑手已取餐" },
  { status: "delivered", label: "订单已送达" }
]

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { isAuthenticated } = useUser()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  
  // 如果未登录，重定向到登录页面
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login")
      return
    }
    
    // 从本地存储获取订单数据
    setLoading(true)
    try {
      console.log('获取订单详情，ID:', params.id);
      const foundOrder = getOrderById(params.id)
      console.log('查询结果:', foundOrder ? '找到订单' : '未找到订单');
      
      if (foundOrder) {
        setOrder(foundOrder)
      } else {
        // 如果找不到订单，重定向到订单列表页
        toast.error('未找到订单信息')
        setTimeout(() => {
          router.push("/orders")
        }, 1000)
      }
    } catch (error) {
      console.error('获取订单详情失败:', error)
      toast.error('获取订单详情失败')
      setTimeout(() => {
        router.push("/orders")
      }, 1000)
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated, params.id, router])

  // 添加刷新订单的函数
  const refreshOrder = useCallback(() => {
    if (!isAuthenticated || !params.id) return;
    
    setLoading(true);
    try {
      const foundOrder = getOrderById(params.id);
      if (foundOrder) {
        setOrder(foundOrder);
      } else {
        toast.error('订单信息已更新，请返回订单列表');
      }
    } catch (error) {
      console.error('刷新订单详情失败:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, params.id]);

  // 页面可见性变化时刷新订单
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshOrder();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAuthenticated, refreshOrder]);

  if (!isAuthenticated || loading) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 flex justify-center">
        <div className="animate-pulse flex flex-col w-full max-w-2xl">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
          <div className="h-32 bg-gray-200 rounded mb-6"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-6">
          <Link href="/orders" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800">
            <ArrowLeft className="mr-1 h-4 w-4" />
            返回订单列表
          </Link>
        </div>

        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
          <h2 className="text-lg font-medium">订单不存在</h2>
          <p className="text-muted-foreground mt-1 mb-4">
            找不到该订单信息，请返回订单列表查看其他订单。
          </p>
          <Button asChild>
            <Link href="/orders">
              返回订单列表
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  // 计算当前订单进行到哪一步
  const currentStepIndex = order.status === "cancelled" 
    ? -1 
    : orderSteps.findIndex(step => 
        (step.status === "pending" && order.status === "pending") ||
        (step.status === "processing" && order.status === "processing") ||
        (step.status === "delivered" && order.status === "delivered")
      )

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/orders" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800">
          <ArrowLeft className="mr-1 h-4 w-4" />
          返回订单列表
        </Link>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">订单详情</h1>
        <div className="flex items-center">
          {getStatusIcon(order.status)}
          <span className="ml-1 font-medium">{getStatusText(order.status)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* 订单状态跟踪 */}
          {order.status !== "cancelled" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">订单状态</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                  <div className="space-y-6">
                    {orderSteps.map((step, index) => {
                      const isActive = index <= currentStepIndex
                      const isLastActive = index === currentStepIndex
                      
                      return (
                        <div key={index} className="relative pl-10">
                          <div className={`absolute left-0 top-0 h-6 w-6 rounded-full flex items-center justify-center ${
                            isActive ? 'bg-green-500' : 'bg-gray-200'
                          }`}>
                            {isActive && <CheckCircle className="h-4 w-4 text-white" />}
                          </div>
                          <div className="flex flex-col">
                            <span className={`font-medium ${isActive ? 'text-green-500' : 'text-gray-500'}`}>
                              {step.label}
                            </span>
                            {isLastActive && index < orderSteps.length - 1 && (
                              <span className="text-sm text-muted-foreground mt-1">
                                预计 {order.estimatedDeliveryTime} 送达
                              </span>
                            )}
                            {isActive && index === orderSteps.length - 1 && (
                              <span className="text-sm text-muted-foreground mt-1">
                                {formatDate(order.updatedAt)}
                              </span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 订单商品 */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">订单商品</CardTitle>
              <Link 
                href={`/merchant/${order.merchantId}`} 
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                查看商家
              </Link>
            </CardHeader>
            <CardContent>
              <div className="mb-3 font-medium">{order.merchantName}</div>
              <div className="space-y-4">
                {order.items.map(item => (
                  <div key={item.id} className="flex items-start space-x-4">
                    {item.image && (
                      <div className="h-16 w-16 rounded overflow-hidden flex-shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-muted-foreground">
                        ¥{item.price.toFixed(2)} × {item.quantity}
                      </div>
                    </div>
                    <div className="font-medium">
                      ¥{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 配送信息 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">配送信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium">配送地址</div>
                  <div className="text-muted-foreground">{order.deliveryAddress}</div>
                </div>
              </div>
              
              {order.contactPhone && (
                <div className="flex items-start">
                  <Phone className="h-5 w-5 mr-3 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium">联系电话</div>
                    <div className="text-muted-foreground">{order.contactPhone}</div>
                  </div>
                </div>
              )}
              
              {order.deliveryNotes && (
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 mr-3 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium">配送备注</div>
                    <div className="text-muted-foreground">{order.deliveryNotes}</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 订单摘要 */}
        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="text-lg">订单摘要</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">订单号</span>
                <span className="font-medium">{order.id}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">下单时间</span>
                <span>{formatDate(order.createdAt)}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">支付方式</span>
                <span>{order.paymentMethod}</span>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">商品小计</span>
                  <span>¥{(order.totalAmount - order.deliveryFee - order.serviceFee).toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">配送费</span>
                  <span>¥{order.deliveryFee.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">服务费</span>
                  <span>¥{order.serviceFee.toFixed(2)}</span>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex justify-between text-lg font-medium">
                <span>总计</span>
                <span>¥{order.totalAmount.toFixed(2)}</span>
              </div>
              
              <div className="pt-4 space-y-2">
                {order.status === "delivered" && (
                  <Button className="w-full">
                    再来一单
                  </Button>
                )}
                
                {order.status === "pending" && (
                  <Button variant="outline" className="w-full text-red-500 hover:text-red-600">
                    取消订单
                  </Button>
                )}
                
                <Button variant="outline" className="w-full">
                  联系客服
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 