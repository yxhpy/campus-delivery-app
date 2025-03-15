"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useUser } from "@/lib/user-context"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Store, ShieldCheck } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { login, loading } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [userType, setUserType] = useState("normal")

  // 根据用户角色重定向到相应页面
  const redirectBasedOnRole = (role: string) => {
    switch (role) {
      case "admin":
        router.push("/admin");
        break;
      case "merchant":
        router.push("/merchant-dashboard");
        break;
      default:
        router.push("/");
        break;
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const username = formData.get("username") as string
      const password = formData.get("password") as string

      // 使用用户名作为邮箱（在实际应用中可能需要调整）
      const email = username.includes('@') ? username : `${username}@example.com`
      
      // 正确调用login函数，传递email和password
      const userData = await login(email, password)

      toast.success("登录成功")
      // 根据用户角色重定向
      redirectBasedOnRole(userData.role)
    } catch (error) {
      toast.error("登录失败，请重试")
      console.error("登录错误:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = async (role: string) => {
    setIsLoading(true)

    try {
      let email, password;
      
      switch (role) {
        case "user":
          email = "test@example.com";
          password = "password";
          break;
        case "merchant":
          email = "merchant@example.com";
          password = "merchant123";
          break;
        case "admin":
          email = "admin@example.com";
          password = "admin123";
          break;
        default:
          email = "test@example.com";
          password = "password";
      }
      
      const userData = await login(email, password);
      toast.success("登录成功");
      // 根据用户角色重定向
      redirectBasedOnRole(userData.role);
    } catch (error) {
      toast.error("登录失败，请重试");
      console.error("登录错误:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">登录</CardTitle>
          <CardDescription>
            登录您的账号以使用校园外卖服务
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="normal" onValueChange={setUserType}>
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="normal">普通登录</TabsTrigger>
              <TabsTrigger value="demo">演示账号</TabsTrigger>
            </TabsList>
            
            <TabsContent value="normal">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">用户名</Label>
                  <Input
                    id="username"
                    name="username"
                    placeholder="请输入用户名"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">密码</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="请输入密码"
                    required
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "登录中..." : "登录"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="demo">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground text-center mb-4">
                  选择一个演示账号快速体验系统功能
                </p>
                
                <div className="grid gap-2">
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => handleDemoLogin("user")}
                    disabled={isLoading}
                  >
                    <User className="mr-2 h-4 w-4" />
                    普通用户账号
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => handleDemoLogin("merchant")}
                    disabled={isLoading}
                  >
                    <Store className="mr-2 h-4 w-4" />
                    商家账号
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => handleDemoLogin("admin")}
                    disabled={isLoading}
                  >
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    管理员账号
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm">
            还没有账号？{" "}
            <Link href="/auth/register" className="text-primary hover:underline">
              立即注册
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
} 