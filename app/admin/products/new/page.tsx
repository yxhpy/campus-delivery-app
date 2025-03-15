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
import { toast } from "sonner"
import { ArrowLeft, Upload } from "lucide-react"

// 商家列表
const mockMerchants = [
  { id: "1", name: "快乐汉堡" },
  { id: "2", name: "甜蜜奶茶" },
  { id: "3", name: "健康轻食" },
  { id: "4", name: "兰州拉面" },
  { id: "5", name: "甜心蛋糕" }
]

// 商品分类
const categoryOptions = [
  "快餐", "饮品", "甜品", "面食", "轻食", "水果", "零食", "其他"
]

export default function NewProductPage() {
  const router = useRouter()
  const { user, loading } = useUser()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    originalPrice: "",
    merchantId: "",
    category: "",
    description: "",
    image: null as File | null
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // 检查用户权限
  useEffect(() => {
    if (!loading && user && user.role !== "admin") {
      toast.error("您没有权限访问此页面")
      router.push("/")
    }
  }, [user, loading, router])

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // 清除对应字段的错误
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  // 处理选择变化
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // 清除对应字段的错误
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  // 处理图片上传
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    
    if (file) {
      setFormData(prev => ({ ...prev, image: file }))
      
      // 创建预览URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      
      // 清除图片错误
      if (errors.image) {
        setErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors.image
          return newErrors
        })
      }
    }
  }

  // 表单验证
  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = "商品名称不能为空"
    }
    
    if (!formData.price.trim()) {
      newErrors.price = "价格不能为空"
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.price = "价格必须是大于0的数字"
    }
    
    if (formData.originalPrice.trim() && (isNaN(parseFloat(formData.originalPrice)) || parseFloat(formData.originalPrice) <= 0)) {
      newErrors.originalPrice = "原价必须是大于0的数字"
    }
    
    if (!formData.merchantId) {
      newErrors.merchantId = "请选择商家"
    }
    
    if (!formData.category) {
      newErrors.category = "请选择商品分类"
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "商品描述不能为空"
    }
    
    if (!formData.image) {
      newErrors.image = "请上传商品图片"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error("请完善表单信息")
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // 成功后跳转到商品列表页
      toast.success("商品添加成功")
      router.push("/admin/products")
    } catch (error) {
      toast.error("添加失败，请重试")
      console.error("添加商品错误:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">加载中...</div>
  }

  if (!user || user.role !== "admin") {
    return null
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">添加商品</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>商品信息</CardTitle>
          <CardDescription>填写商品的详细信息</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">商品名称 <span className="text-red-500">*</span></Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="输入商品名称"
                  disabled={isSubmitting}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="merchantId">所属商家 <span className="text-red-500">*</span></Label>
                <Select
                  value={formData.merchantId}
                  onValueChange={(value) => handleSelectChange("merchantId", value)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择商家" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockMerchants.map(merchant => (
                      <SelectItem key={merchant.id} value={merchant.id}>
                        {merchant.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.merchantId && <p className="text-sm text-red-500">{errors.merchantId}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">价格 (¥) <span className="text-red-500">*</span></Label>
                <Input
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="输入商品价格"
                  type="number"
                  step="0.01"
                  min="0"
                  disabled={isSubmitting}
                />
                {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="originalPrice">原价 (¥)</Label>
                <Input
                  id="originalPrice"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleInputChange}
                  placeholder="输入商品原价（可选）"
                  type="number"
                  step="0.01"
                  min="0"
                  disabled={isSubmitting}
                />
                {errors.originalPrice && <p className="text-sm text-red-500">{errors.originalPrice}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">商品分类 <span className="text-red-500">*</span></Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange("category", value)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择分类" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">商品描述 <span className="text-red-500">*</span></Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="输入商品详细描述"
                  rows={4}
                  disabled={isSubmitting}
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="image">商品图片 <span className="text-red-500">*</span></Label>
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("image")?.click()}
                    disabled={isSubmitting}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    选择图片
                  </Button>
                  <Input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={isSubmitting}
                  />
                  <span className="text-sm text-muted-foreground">
                    {formData.image ? formData.image.name : "未选择文件"}
                  </span>
                </div>
                {errors.image && <p className="text-sm text-red-500">{errors.image}</p>}
                
                {imagePreview && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">图片预览</p>
                    <div className="relative w-40 h-40 rounded-md overflow-hidden border">
                      <img
                        src={imagePreview}
                        alt="商品预览"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/products")}
              disabled={isSubmitting}
            >
              取消
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "提交中..." : "添加商品"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
} 