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
import { ArrowLeft, Upload, Save } from "lucide-react"

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

// 商品状态选项
const statusOptions = [
  { value: "available", label: "在售" },
  { value: "soldout", label: "售罄" },
  { value: "hidden", label: "隐藏" }
]

// 模拟商品数据
const mockProducts = [
  {
    id: "1",
    name: "香辣鸡腿堡",
    image: "/images/products/burger.jpg",
    price: 15.9,
    originalPrice: 18.9,
    merchantId: "1",
    merchantName: "快乐汉堡",
    category: "快餐",
    status: "available",
    createdAt: "2023-01-15",
    description: "新鲜制作的香辣鸡腿堡，口感鲜嫩多汁",
    sales: 1250,
    rating: 4.7
  },
  {
    id: "2",
    name: "珍珠奶茶",
    image: "/images/products/milk-tea.jpg",
    price: 12.0,
    originalPrice: 12.0,
    merchantId: "2",
    merchantName: "甜蜜奶茶",
    category: "饮品",
    status: "available",
    createdAt: "2023-02-10",
    description: "使用进口珍珠和优质茶叶制作",
    sales: 980,
    rating: 4.5
  },
  {
    id: "3",
    name: "水果沙拉",
    image: "/images/products/salad.jpg",
    price: 18.5,
    originalPrice: 22.0,
    merchantId: "3",
    merchantName: "健康轻食",
    category: "轻食",
    status: "available",
    createdAt: "2023-03-05",
    description: "新鲜水果搭配酸奶，健康美味",
    sales: 560,
    rating: 4.8
  },
  {
    id: "4",
    name: "牛肉拉面",
    image: "/images/products/noodle.jpg",
    price: 22.0,
    originalPrice: 22.0,
    merchantId: "4",
    merchantName: "兰州拉面",
    category: "面食",
    status: "soldout",
    createdAt: "2023-01-20",
    description: "传统工艺，手工拉制，配以精选牛肉",
    sales: 1500,
    rating: 4.9
  },
  {
    id: "5",
    name: "巧克力蛋糕",
    image: "/images/products/cake.jpg",
    price: 28.0,
    originalPrice: 32.0,
    merchantId: "5",
    merchantName: "甜心蛋糕",
    category: "甜品",
    status: "available",
    createdAt: "2023-02-25",
    description: "比利时进口巧克力制作，口感丝滑",
    sales: 780,
    rating: 4.6
  },
  {
    id: "6",
    name: "鸡肉卷",
    image: "/images/products/wrap.jpg",
    price: 16.5,
    originalPrice: 16.5,
    merchantId: "1",
    merchantName: "快乐汉堡",
    category: "快餐",
    status: "hidden",
    createdAt: "2023-03-15",
    description: "新鲜鸡肉配以特制酱料，口感丰富",
    sales: 420,
    rating: 4.3
  }
]

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user, loading } = useUser()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [product, setProduct] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    originalPrice: "",
    merchantId: "",
    category: "",
    description: "",
    status: "",
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

  // 获取商品数据
  useEffect(() => {
    if (params.id) {
      // 模拟API调用
      const foundProduct = mockProducts.find(p => p.id === params.id)
      
      if (foundProduct) {
        setProduct(foundProduct)
        setFormData({
          name: foundProduct.name,
          price: foundProduct.price.toString(),
          originalPrice: foundProduct.originalPrice.toString(),
          merchantId: foundProduct.merchantId,
          category: foundProduct.category,
          description: foundProduct.description,
          status: foundProduct.status,
          image: null
        })
        setImagePreview(foundProduct.image)
      } else {
        toast.error("商品不存在")
        router.push("/admin/products")
      }
    }
  }, [params.id, router])

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
    
    if (!formData.status) {
      newErrors.status = "请选择商品状态"
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "商品描述不能为空"
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
      
      // 更新本地数据
      if (product) {
        const updatedProduct = {
          ...product,
          name: formData.name,
          price: parseFloat(formData.price),
          originalPrice: parseFloat(formData.originalPrice) || parseFloat(formData.price),
          merchantId: formData.merchantId,
          merchantName: mockMerchants.find(m => m.id === formData.merchantId)?.name || product.merchantName,
          category: formData.category,
          description: formData.description,
          status: formData.status,
          // 如果有新图片，则使用新图片的预览URL，否则保持原图片
          image: imagePreview || product.image
        }
        
        setProduct(updatedProduct)
      }
      
      toast.success("商品更新成功")
    } catch (error) {
      toast.error("更新失败，请重试")
      console.error("更新商品错误:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading || !product) {
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
        <h1 className="text-3xl font-bold">编辑商品</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>商品信息</CardTitle>
              <CardDescription>编辑商品的详细信息</CardDescription>
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

                  <div className="space-y-2">
                    <Label htmlFor="status">商品状态 <span className="text-red-500">*</span></Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleSelectChange("status", value)}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择状态" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
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
                    <Label htmlFor="image">商品图片</Label>
                    <div className="flex items-center gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("image")?.click()}
                        disabled={isSubmitting}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        更换图片
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
                        {formData.image ? formData.image.name : "保持原图片"}
                      </span>
                    </div>
                    {errors.image && <p className="text-sm text-red-500">{errors.image}</p>}
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
                  {isSubmitting ? (
                    "保存中..."
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      保存修改
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>商品预览</CardTitle>
              <CardDescription>当前商品的展示效果</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {imagePreview && (
                <div className="rounded-md overflow-hidden border aspect-square">
                  <img
                    src={imagePreview}
                    alt={formData.name || "商品预览"}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="space-y-2">
                <h3 className="font-semibold text-lg">{formData.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-lg">¥{parseFloat(formData.price).toFixed(2)}</span>
                  {formData.originalPrice && parseFloat(formData.originalPrice) > parseFloat(formData.price) && (
                    <span className="text-muted-foreground line-through">
                      ¥{parseFloat(formData.originalPrice).toFixed(2)}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{formData.description}</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">商家:</span>
                  <span>{mockMerchants.find(m => m.id === formData.merchantId)?.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">分类:</span>
                  <span>{formData.category}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">状态:</span>
                  <span>{statusOptions.find(s => s.value === formData.status)?.label}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">销量:</span>
                  <span>{product.sales}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">评分:</span>
                  <span>{product.rating.toFixed(1)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">创建时间:</span>
                  <span>{product.createdAt}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 