"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/lib/user-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Store, Users, ShoppingBag, Settings, BarChart3 } from "lucide-react"

export default function AdminDashboard() {
  const router = useRouter()
  const { user, isAuthenticated } = useUser()

  // 检查用户是否为管理员
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login")
    } else if (user?.role !== "admin") {
      router.push("/")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.role !== "admin") {
    return null // 等待重定向
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">管理员后台</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 商家管理 */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Store className="mr-2 h-5 w-5" />
              商家管理
            </CardTitle>
            <CardDescription>
              管理平台商家信息和审核
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              onClick={() => router.push("/admin/merchants")}
            >
              进入商家管理
            </Button>
          </CardContent>
        </Card>

        {/* 用户管理 */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              用户管理
            </CardTitle>
            <CardDescription>
              管理平台用户账号和权限
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              onClick={() => router.push("/admin/users")}
            >
              进入用户管理
            </Button>
          </CardContent>
        </Card>

        {/* 订单管理 */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShoppingBag className="mr-2 h-5 w-5" />
              订单管理
            </CardTitle>
            <CardDescription>
              查看和处理平台订单
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              onClick={() => router.push("/admin/orders")}
            >
              进入订单管理
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
              查看平台运营数据和统计
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              onClick={() => router.push("/admin/statistics")}
            >
              查看数据统计
            </Button>
          </CardContent>
        </Card>

        {/* 系统设置 */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5" />
              系统设置
            </CardTitle>
            <CardDescription>
              管理系统配置和参数
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              onClick={() => router.push("/admin/settings")}
            >
              进入系统设置
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 