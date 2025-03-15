"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/lib/user-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Package, BarChart3, Star, Settings, Clock } from "lucide-react"
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
            <CardTitle className="text-sm font-medium text-muted-foreground">总订单</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground mt-1">较上周 +12%</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">待处理订单</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground mt-1">较昨日 +2</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">商品总数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground mt-1">本周新增 3</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">总收入</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥1,280</div>
            <p className="text-xs text-muted-foreground mt-1">较上周 +8%</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>订单管理</CardTitle>
            <CardDescription>查看和处理顾客订单</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              onClick={() => router.push("/merchant-dashboard/orders")}
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              查看订单
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>商品管理</CardTitle>
            <CardDescription>管理店铺商品和库存</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              onClick={() => router.push("/merchant-dashboard/products")}
            >
              <Package className="mr-2 h-4 w-4" />
              管理商品
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>数据统计</CardTitle>
            <CardDescription>查看销售和订单数据</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              onClick={() => router.push("/merchant-dashboard/statistics")}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              查看统计
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>评价管理</CardTitle>
            <CardDescription>查看和回复顾客评价</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              onClick={() => router.push("/merchant-dashboard/reviews")}
            >
              <Star className="mr-2 h-4 w-4" />
              查看评价
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>店铺设置</CardTitle>
            <CardDescription>管理店铺基本信息</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              onClick={() => router.push("/merchant-dashboard/settings")}
            >
              <Settings className="mr-2 h-4 w-4" />
              店铺设置
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>营业时间</CardTitle>
            <CardDescription>设置店铺营业时间</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              onClick={() => router.push("/merchant-dashboard/settings?tab=business-hours")}
            >
              <Clock className="mr-2 h-4 w-4" />
              设置时间
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 