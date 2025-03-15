"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/lib/user-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Package, BarChart3, Settings, MessageSquare } from "lucide-react"
import { toast } from "sonner"

// 模拟商家数据
const mockMerchantData = {
  id: "merchant-001",
  name: "学生食堂",
  address: "校园大道1号",
  phone: "123-4567-8910",
  email: "contact@campus-food.com",
  status: "approved",
  createdAt: "2024-01-15",
  statistics: {
    totalOrders: 256,
    pendingOrders: 12,
    totalProducts: 45,
    totalRevenue: 15680
  }
}

export default function MerchantDashboard() {
  const router = useRouter()
  const { user, isAuthenticated } = useUser()
  const [merchantData, setMerchantData] = useState(mockMerchantData)

  // 检查用户是否为商家
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login")
    } else if (user?.role !== "merchant") {
      router.push("/")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.role !== "merchant") {
    return null // 等待重定向
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">商家后台</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">总订单数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{merchantData.statistics.totalOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">较上月增长 12%</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">待处理订单</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{merchantData.statistics.pendingOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">需要尽快处理</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">商品数量</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{merchantData.statistics.totalProducts}</div>
            <p className="text-xs text-muted-foreground mt-1">上架商品总数</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">总收入 (元)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{merchantData.statistics.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">较上月增长 8%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 订单管理 */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShoppingBag className="mr-2 h-5 w-5" />
              订单管理
            </CardTitle>
            <CardDescription>
              管理和处理客户订单
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              onClick={() => toast.info("订单管理功能正在开发中")}
            >
              查看订单
            </Button>
          </CardContent>
        </Card>

        {/* 商品管理 */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="mr-2 h-5 w-5" />
              商品管理
            </CardTitle>
            <CardDescription>
              管理商品信息和库存
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              onClick={() => toast.info("商品管理功能正在开发中")}
            >
              管理商品
            </Button>
          </CardContent>
        </Card>

        {/* 数据统计 */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              数据统计
            </CardTitle>
            <CardDescription>
              查看销售和业绩数据
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              onClick={() => toast.info("数据统计功能正在开发中")}
            >
              查看统计
            </Button>
          </CardContent>
        </Card>

        {/* 评价管理 */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="mr-2 h-5 w-5" />
              评价管理
            </CardTitle>
            <CardDescription>
              查看和回复客户评价
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              onClick={() => toast.info("评价管理功能正在开发中")}
            >
              查看评价
            </Button>
          </CardContent>
        </Card>

        {/* 店铺设置 */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5" />
              店铺设置
            </CardTitle>
            <CardDescription>
              管理店铺信息和设置
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              onClick={() => toast.info("店铺设置功能正在开发中")}
            >
              店铺设置
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 