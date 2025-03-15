"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/lib/user-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft } from "lucide-react"
import { toast } from "sonner"

// 商家分类选项
const categoryOptions = [
  { value: "快餐", label: "快餐" },
  { value: "甜品", label: "甜品" },
  { value: "超市", label: "超市" },
  { value: "水果", label: "水果" },
  { value: "书店", label: "书店" },
  { value: "其他", label: "其他" }
]

export default function NewMerchantPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useUser()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // 表单状态
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    address: "",
    phone: "",
    description: "",
    businessHours: "",
    contactPerson: ""
  })

  // 检查用户是否为管理员
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login")
    } else if (user?.role !== "admin") {
      router.push("/")
    }
  }, [isAuthenticated, user, router])

  // 处理表单输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // 处理选择框变化
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // 提交表单
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // 表单验证
    if (!formData.name.trim()) {
      toast.error("请输入商家名称")
      setIsSubmitting(false)
      return
    }

    if (!formData.category) {
      toast.error("请选择商家分类")
      setIsSubmitting(false)
      return
    }

    if (!formData.address.trim()) {
      toast.error("请输入商家地址")
      setIsSubmitting(false)
      return
    }

    if (!formData.phone.trim()) {
      toast.error("请输入联系电话")
      setIsSubmitting(false)
      return
    }

    // 模拟API调用
    setTimeout(() => {
      setIsSubmitting(false)
      toast.success("商家添加成功，等待审核")
      router.push("/admin/merchants")
    }, 1000)
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return null // 等待重定向
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          className="mr-2" 
          onClick={() => router.push("/admin/merchants")}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          返回
        </Button>
        <h1 className="text-2xl font-bold">添加商家</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>商家信息</CardTitle>
          <CardDescription>
            添加新商家到平台
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">商家名称 *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  placeholder="输入商家名称"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">商家分类 *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange("category", value)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="选择商家分类" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">商家地址 *</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                disabled={isSubmitting}
                placeholder="输入商家详细地址"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">联系电话 *</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  placeholder="输入联系电话"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPerson">联系人</Label>
                <Input
                  id="contactPerson"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  placeholder="输入联系人姓名"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessHours">营业时间</Label>
              <Input
                id="businessHours"
                name="businessHours"
                value={formData.businessHours}
                onChange={handleInputChange}
                disabled={isSubmitting}
                placeholder="例如：周一至周日 10:00-22:00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">商家描述</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                disabled={isSubmitting}
                placeholder="输入商家描述信息"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>商家Logo</Label>
              <div className="border rounded-md p-4">
                <Input
                  type="file"
                  disabled={isSubmitting}
                  accept="image/*"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  支持JPG、PNG格式，建议尺寸200x200像素
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/merchants")}
              disabled={isSubmitting}
            >
              取消
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "提交中..." : "添加商家"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
} 