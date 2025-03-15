"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function DeliveryLoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // TODO: 实现登录接口调用
      const response = await fetch("/api/delivery/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("登录失败，请检查账号密码是否正确")
      }

      const data = await response.json()
      // 存储登录信息
      localStorage.setItem("delivery_token", data.token)
      // 跳转到配送员主页
      router.push("/delivery")
    } catch (err) {
      setError(err instanceof Error ? err.message : "登录失败，请稍后重试")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="grid w-full grow place-items-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>配送员登录</CardTitle>
          <CardDescription>
            请输入您的手机号和密码登录系统
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="text-sm text-red-500">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="phone">手机号</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="请输入手机号"
                required
                pattern="^1[3-9]\d{9}$"
                value={formData.phone}
                onChange={handleChange}
                aria-describedby="phone-description"
              />
              <p id="phone-description" className="text-sm text-muted-foreground">
                请输入11位手机号码
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="请输入密码"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                aria-describedby="password-description"
                autoComplete="current-password"
              />
              <p id="password-description" className="text-sm text-muted-foreground">
                密码长度至少6位
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "登录中..." : "登录"}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              还没有账号？
              <Link 
                href="/delivery/register" 
                className="text-primary hover:underline"
              >
                立即注册
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
} 