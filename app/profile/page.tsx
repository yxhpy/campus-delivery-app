"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUser } from "@/lib/user-context"
import Link from "next/link"
import { toast } from "sonner"
import { ArrowLeft, User } from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated } = useUser()
  
  // 如果未登录，重定向到登录页面
  if (!isAuthenticated) {
    router.push("/auth/login")
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

      <h1 className="text-2xl font-bold mb-6">个人资料</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 mb-4 flex items-center justify-center">
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.username} 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-16 w-16 text-gray-400" />
                )}
              </div>
              <h2 className="text-xl font-medium">{user?.username}</h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <p className="text-xs text-muted-foreground mt-1 capitalize">
                {user?.role === 'user' ? '普通用户' : 
                 user?.role === 'merchant' ? '商家' : '管理员'}
              </p>
              
              <Button className="mt-4 w-full">
                修改头像
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">基本信息</CardTitle>
              <CardDescription>
                更新您的个人信息
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">用户名</Label>
                <Input 
                  id="username" 
                  defaultValue={user?.username}
                  disabled
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">邮箱</Label>
                <Input 
                  id="email" 
                  type="email" 
                  defaultValue={user?.email}
                  disabled
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">手机号</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  placeholder="请输入手机号"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                保存修改
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">安全设置</CardTitle>
              <CardDescription>
                更新您的密码和安全选项
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">当前密码</Label>
                <Input 
                  id="currentPassword" 
                  type="password" 
                  placeholder="输入当前密码"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newPassword">新密码</Label>
                <Input 
                  id="newPassword" 
                  type="password" 
                  placeholder="输入新密码"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">确认新密码</Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  placeholder="再次输入新密码"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                更新密码
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
} 