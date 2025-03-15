"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/lib/user-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, Search, Eye, CheckCircle, XCircle, Clock } from "lucide-react"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// 订单状态类型
type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled'

// 订单类型
interface Order {
  id: string
  orderNumber: string
  customerName: string
  items: {
    name: string
    quantity: number
    price: number
  }[]
  totalAmount: number
  status: OrderStatus
  createdAt: string
  address: string
  phone: string
}

// 模拟订单数据
const mockOrders: Order[] = [
  {
    id: "order-001",
    orderNumber: "ORD20240315001",
    customerName: "张三",
    items: [
      { name: "经典套餐", quantity: 1, price: 15 },
      { name: "紫菜蛋花汤", quantity: 1, price: 3 }
    ],
    totalAmount: 18,
    status: "pending",
    createdAt: "2024-03-15 10:30",
    address: "大学城东区3栋405",
    phone: "13800138001"
  },
  {
    id: "order-002",
    orderNumber: "ORD20240315002",
    customerName: "李四",
    items: [
      { name: "红烧肉", quantity: 1, price: 8 },
      { name: "炒青菜", quantity: 1, price: 5 },
      { name: "紫菜蛋花汤", quantity: 1, price: 3 }
    ],
    totalAmount: 16,
    status: "processing",
    createdAt: "2024-03-15 11:15",
    address: "大学城西区1栋203",
    phone: "13800138002"
  },
  {
    id: "order-003",
    orderNumber: "ORD20240315003",
    customerName: "王五",
    items: [
      { name: "牛肉面", quantity: 2, price: 24 }
    ],
    totalAmount: 24,
    status: "completed",
    createdAt: "2024-03-15 12:00",
    address: "大学城南区5栋102",
    phone: "13800138003"
  },
  {
    id: "order-004",
    orderNumber: "ORD20240315004",
    customerName: "赵六",
    items: [
      { name: "经典套餐", quantity: 1, price: 15 }
    ],
    totalAmount: 15,
    status: "cancelled",
    createdAt: "2024-03-15 12:30",
    address: "大学城北区2栋301",
    phone: "13800138004"
  },
  {
    id: "order-005",
    orderNumber: "ORD20240314001",
    customerName: "钱七",
    items: [
      { name: "红烧肉", quantity: 2, price: 16 },
      { name: "炒青菜", quantity: 1, price: 5 }
    ],
    totalAmount: 21,
    status: "completed",
    createdAt: "2024-03-14 18:45",
    address: "大学城东区1栋505",
    phone: "13800138005"
  }
]

export default function MerchantOrdersPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useUser()
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  // 检查用户是否为商家
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login")
    } else if (user?.role !== "merchant") {
      router.push("/")
    }
  }, [isAuthenticated, user, router])

  // 过滤订单列表
  const filteredOrders = orders.filter(order => {
    // 搜索条件
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.address.toLowerCase().includes(searchTerm.toLowerCase())
    
    // 状态过滤
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  // 处理订单状态更新
  const handleStatusUpdate = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ))
    
    const statusText = {
      'pending': '待处理',
      'processing': '处理中',
      'completed': '已完成',
      'cancelled': '已取消'
    }
    
    toast.success(`订单状态已更新为${statusText[newStatus]}`)
  }

  // 查看订单详情
  const viewOrderDetail = (order: Order) => {
    setSelectedOrder(order)
    setIsDetailModalOpen(true)
  }

  // 渲染订单状态徽章
  const renderStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            待处理
          </Badge>
        )
      case 'processing':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            处理中
          </Badge>
        )
      case 'completed':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            已完成
          </Badge>
        )
      case 'cancelled':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            已取消
          </Badge>
        )
      default:
        return null
    }
  }

  if (!isAuthenticated || user?.role !== "merchant") {
    return null // 等待重定向
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          className="mr-2" 
          onClick={() => router.push("/merchant-dashboard")}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          返回
        </Button>
        <h1 className="text-2xl font-bold">订单管理</h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>订单列表</CardTitle>
          <CardDescription>
            管理和处理客户订单
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between mb-4 space-y-4 md:space-y-0">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索订单..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <Tabs 
                defaultValue="all" 
                value={statusFilter} 
                onValueChange={setStatusFilter}
                className="w-full md:w-auto"
              >
                <TabsList>
                  <TabsTrigger value="all">全部</TabsTrigger>
                  <TabsTrigger value="pending">待处理</TabsTrigger>
                  <TabsTrigger value="processing">处理中</TabsTrigger>
                  <TabsTrigger value="completed">已完成</TabsTrigger>
                  <TabsTrigger value="cancelled">已取消</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>订单号</TableHead>
                  <TableHead>客户</TableHead>
                  <TableHead>金额</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>下单时间</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.orderNumber}</TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell>¥{order.totalAmount.toFixed(2)}</TableCell>
                      <TableCell>{renderStatusBadge(order.status)}</TableCell>
                      <TableCell>{order.createdAt}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => viewOrderDetail(order)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          
                          {order.status === 'pending' && (
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleStatusUpdate(order.id, 'processing')}
                            >
                              <Clock className="h-4 w-4 text-blue-600" />
                            </Button>
                          )}
                          
                          {order.status === 'processing' && (
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleStatusUpdate(order.id, 'completed')}
                            >
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </Button>
                          )}
                          
                          {(order.status === 'pending' || order.status === 'processing') && (
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                            >
                              <XCircle className="h-4 w-4 text-red-600" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      没有找到符合条件的订单
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 订单详情对话框 */}
      {selectedOrder && (
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${isDetailModalOpen ? 'block' : 'hidden'}`}>
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">订单详情</h2>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setIsDetailModalOpen(false)}
                >
                  <XCircle className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">订单号</p>
                  <p className="font-medium">{selectedOrder.orderNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">下单时间</p>
                  <p>{selectedOrder.createdAt}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">客户</p>
                  <p>{selectedOrder.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">联系电话</p>
                  <p>{selectedOrder.phone}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">配送地址</p>
                  <p>{selectedOrder.address}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">订单状态</p>
                  <div className="mt-1">{renderStatusBadge(selectedOrder.status)}</div>
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="font-medium mb-2">订单商品</h3>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>商品</TableHead>
                        <TableHead className="text-right">数量</TableHead>
                        <TableHead className="text-right">单价</TableHead>
                        <TableHead className="text-right">小计</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">¥{item.price.toFixed(2)}</TableCell>
                          <TableCell className="text-right">¥{(item.quantity * item.price).toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={3} className="text-right font-medium">总计</TableCell>
                        <TableCell className="text-right font-bold">¥{selectedOrder.totalAmount.toFixed(2)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
              
              {(selectedOrder.status === 'pending' || selectedOrder.status === 'processing') && (
                <div className="flex justify-end space-x-2">
                  {selectedOrder.status === 'pending' && (
                    <Button 
                      onClick={() => {
                        handleStatusUpdate(selectedOrder.id, 'processing')
                        setIsDetailModalOpen(false)
                      }}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      开始处理
                    </Button>
                  )}
                  
                  {selectedOrder.status === 'processing' && (
                    <Button 
                      onClick={() => {
                        handleStatusUpdate(selectedOrder.id, 'completed')
                        setIsDetailModalOpen(false)
                      }}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      完成订单
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline"
                    onClick={() => {
                      handleStatusUpdate(selectedOrder.id, 'cancelled')
                      setIsDetailModalOpen(false)
                    }}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    取消订单
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 