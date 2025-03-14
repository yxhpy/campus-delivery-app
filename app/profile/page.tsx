"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useUser } from "@/lib/user-context"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { MapPin, Phone, Mail, User, Lock, CreditCard, LogOut, ShoppingBag } from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated, logout } = useUser()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login")
    }
  }, [isAuthenticated, router])

  const handleLogout = async () => {
    try {
      await logout()
      toast.success("已成功退出登录")
      router.push("/")
    } catch (error) {
      toast.error("退出登录失败，请重试")
    }
  }

  const handleUpdateProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    // 模拟更新个人资料
    setTimeout(() => {
      setIsLoading(false)
      toast.success("个人资料已更新")
    }, 1000)
  }

  const handleUpdatePassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    // 模拟更新密码
    setTimeout(() => {
      setIsLoading(false)
      toast.success("密码已更新")
    }, 1000)
  }

  if (!isAuthenticated || !user) {
    return null // 等待重定向
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">个人中心</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* 侧边栏 */}
        <Card className="md:col-span-1">
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/images/avatar.png" alt={user.username} />
                <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h2 className="text-xl font-medium">{user.username}</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <Separator />
              <div className="w-full space-y-2">
                <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/orders")}>
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  我的订单
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <CreditCard className="mr-2 h-4 w-4" />
                  支付方式
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  退出登录
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 主内容区 */}
        <div className="md:col-span-3">
          <Tabs defaultValue="profile">
            <TabsList className="mb-4">
              <TabsTrigger value="profile">个人资料</TabsTrigger>
              <TabsTrigger value="password">修改密码</TabsTrigger>
              <TabsTrigger value="address">收货地址</TabsTrigger>
            </TabsList>

            {/* 个人资料 */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>个人资料</CardTitle>
                  <CardDescription>
                    更新您的个人信息
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleUpdateProfile}>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="username">
                          <User className="inline-block w-4 h-4 mr-1" />
                          用户名
                        </Label>
                        <Input
                          id="username"
                          defaultValue={user.username}
                          disabled={isLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">
                          <Mail className="inline-block w-4 h-4 mr-1" />
                          邮箱
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          defaultValue={user.email}
                          disabled={isLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">
                          <Phone className="inline-block w-4 h-4 mr-1" />
                          手机号码
                        </Label>
                        <Input
                          id="phone"
                          defaultValue="13800138000"
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "保存中..." : "保存更改"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            {/* 修改密码 */}
            <TabsContent value="password">
              <Card>
                <CardHeader>
                  <CardTitle>修改密码</CardTitle>
                  <CardDescription>
                    更新您的账户密码
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleUpdatePassword}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">
                        <Lock className="inline-block w-4 h-4 mr-1" />
                        当前密码
                      </Label>
                      <Input
                        id="current-password"
                        type="password"
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">
                        <Lock className="inline-block w-4 h-4 mr-1" />
                        新密码
                      </Label>
                      <Input
                        id="new-password"
                        type="password"
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">
                        <Lock className="inline-block w-4 h-4 mr-1" />
                        确认新密码
                      </Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "更新中..." : "更新密码"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            {/* 收货地址 */}
            <TabsContent value="address">
              <Card>
                <CardHeader>
                  <CardTitle>收货地址</CardTitle>
                  <CardDescription>
                    管理您的收货地址
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="font-medium">校园公寓 3号楼 512室</div>
                        <div className="text-sm text-muted-foreground">广东省广州市天河区校园大道1号</div>
                        <div className="text-sm">张三 (13800138000)</div>
                        <div className="inline-flex items-center text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                          <MapPin className="w-3 h-3 mr-1" />
                          默认地址
                        </div>
                      </div>
                      <div className="space-x-2">
                        <Button variant="outline" size="sm">编辑</Button>
                        <Button variant="outline" size="sm">删除</Button>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    添加新地址
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
} 