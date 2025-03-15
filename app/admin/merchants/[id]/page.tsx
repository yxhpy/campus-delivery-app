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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, Save, Store, ShoppingBag, Star, Clock, MapPin, Phone, Mail, User } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

// 商家分类选项
const categoryOptions = [
  { value: "快餐", label: "快餐" },
  { value: "甜品", label: "甜品" },
  { value: "超市", label: "超市" },
  { value: "水果", label: "水果" },
  { value: "书店", label: "书店" },
  { value: "其他", label: "其他" }
]

// 模拟商品数据
const mockProducts = [
  { id: "p001", name: "香辣鸡腿堡", price: 15, category: "汉堡", sales: 120 },
  { id: "p002", name: "双层牛肉堡", price: 20, category: "汉堡", sales: 98 },
  { id: "p003", name: "薯条(大)", price: 12, category: "小吃", sales: 200 },
  { id: "p004", name: "可乐(中)", price: 7, category: "饮料", sales: 180 },
  { id: "p005", name: "冰淇淋", price: 6, category: "甜品", sales: 150 }
]

// 模拟商家数据
const mockMerchants = [
  {
    id: "m001",
    name: "校园快餐店",
    logo: "/images/merchants/restaurant1.jpg",
    address: "大学城东路123号",
    phone: "13800138001",
    category: "快餐",
    status: "approved",
    createdAt: "2024-01-15",
    description: "提供各种美味快餐，价格实惠，服务周到。",
    businessHours: "周一至周日 10:00-22:00",
    contactPerson: "张经理",
    email: "restaurant1@example.com"
  },
  {
    id: "m002",
    name: "甜品奶茶屋",
    logo: "/images/merchants/restaurant2.jpg",
    address: "大学城西路45号",
    phone: "13800138002",
    category: "甜品",
    status: "approved",
    createdAt: "2024-01-20",
    description: "专业甜品店，提供各种甜点和奶茶。",
    businessHours: "周一至周日 11:00-23:00",
    contactPerson: "李经理",
    email: "dessert@example.com"
  }
]

export default function MerchantDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user, isAuthenticated } = useUser()
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("info")
  
  // 获取商家数据
  const merchantData = mockMerchants.find(m => m.id === params.id)
  
  // 表单状态
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    address: "",
    phone: "",
    description: "",
    businessHours: "",
    contactPerson: "",
    email: "",
    status: ""
  })

  // 初始化表单数据
  useEffect(() => {
    if (merchantData) {
      setFormData({
        name: merchantData.name,
        category: merchantData.category,
        address: merchantData.address,
        phone: merchantData.phone,
        description: merchantData.description || "",
        businessHours: merchantData.businessHours || "",
        contactPerson: merchantData.contactPerson || "",
        email: merchantData.email || "",
        status: merchantData.status
      })
    }
  }, [merchantData])

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
      setIsEditing(false)
      toast.success("商家信息已更新")
    }, 1000)
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return null // 等待重定向
  }

  if (!merchantData) {
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
          <h1 className="text-2xl font-bold">商家详情</h1>
        </div>
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">未找到商家信息</p>
            <Button 
              className="mt-4" 
              onClick={() => router.push("/admin/merchants")}
            >
              返回商家列表
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          className="mr-2" 
          onClick={() => router.push("/admin/merchants")}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          返回
        </Button>
        <h1 className="text-2xl font-bold">商家详情</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 侧边信息卡片 */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                <Store className="h-12 w-12 text-gray-400" />
              </div>
            </div>
            <CardTitle className="text-center mt-2">{merchantData.name}</CardTitle>
            <div className="flex justify-center">
              {merchantData.status === 'pending' && (
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                  待审核
                </Badge>
              )}
              {merchantData.status === 'approved' && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  已批准
                </Badge>
              )}
              {merchantData.status === 'rejected' && (
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  已拒绝
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                <span className="text-sm">{merchantData.address}</span>
              </div>
              <div className="flex items-start">
                <Phone className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                <span className="text-sm">{merchantData.phone}</span>
              </div>
              {merchantData.email && (
                <div className="flex items-start">
                  <Mail className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                  <span className="text-sm">{merchantData.email}</span>
                </div>
              )}
              {merchantData.contactPerson && (
                <div className="flex items-start">
                  <User className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                  <span className="text-sm">{merchantData.contactPerson}</span>
                </div>
              )}
              {merchantData.businessHours && (
                <div className="flex items-start">
                  <Clock className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                  <span className="text-sm">{merchantData.businessHours}</span>
                </div>
              )}
              <Separator />
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">商品数量</span>
                  <span className="text-sm">{mockProducts.length}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">创建时间</span>
                  <span className="text-sm">{merchantData.createdAt}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 主内容区 */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="info">基本信息</TabsTrigger>
              <TabsTrigger value="products">商品管理</TabsTrigger>
              <TabsTrigger value="orders">订单管理</TabsTrigger>
              <TabsTrigger value="reviews">评价管理</TabsTrigger>
            </TabsList>

            {/* 基本信息 */}
            <TabsContent value="info">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>商家信息</CardTitle>
                    <CardDescription>
                      查看和编辑商家基本信息
                    </CardDescription>
                  </div>
                  <Button 
                    variant={isEditing ? "outline" : "default"}
                    onClick={() => setIsEditing(!isEditing)}
                    disabled={isSubmitting}
                  >
                    {isEditing ? "取消编辑" : "编辑信息"}
                  </Button>
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
                          disabled={!isEditing || isSubmitting}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">商家分类 *</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => handleSelectChange("category", value)}
                          disabled={!isEditing || isSubmitting}
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
                        disabled={!isEditing || isSubmitting}
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
                          disabled={!isEditing || isSubmitting}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">电子邮箱</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          disabled={!isEditing || isSubmitting}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="contactPerson">联系人</Label>
                        <Input
                          id="contactPerson"
                          name="contactPerson"
                          value={formData.contactPerson}
                          onChange={handleInputChange}
                          disabled={!isEditing || isSubmitting}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="businessHours">营业时间</Label>
                        <Input
                          id="businessHours"
                          name="businessHours"
                          value={formData.businessHours}
                          onChange={handleInputChange}
                          disabled={!isEditing || isSubmitting}
                          placeholder="例如：周一至周日 10:00-22:00"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">商家描述</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        disabled={!isEditing || isSubmitting}
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">商家状态</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) => handleSelectChange("status", value)}
                        disabled={!isEditing || isSubmitting}
                      >
                        <SelectTrigger id="status">
                          <SelectValue placeholder="选择商家状态" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">待审核</SelectItem>
                          <SelectItem value="approved">已批准</SelectItem>
                          <SelectItem value="rejected">已拒绝</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                  {isEditing && (
                    <CardFooter>
                      <Button type="submit" disabled={isSubmitting} className="ml-auto">
                        {isSubmitting ? "保存中..." : "保存更改"}
                      </Button>
                    </CardFooter>
                  )}
                </form>
              </Card>
            </TabsContent>

            {/* 商品管理 */}
            <TabsContent value="products">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>商品管理</CardTitle>
                    <CardDescription>
                      管理商家的所有商品
                    </CardDescription>
                  </div>
                  <Button>
                    添加商品
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="py-3 px-4 text-left font-medium">商品名称</th>
                          <th className="py-3 px-4 text-left font-medium">分类</th>
                          <th className="py-3 px-4 text-left font-medium">价格</th>
                          <th className="py-3 px-4 text-left font-medium">销量</th>
                          <th className="py-3 px-4 text-right font-medium">操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockProducts.map((product) => (
                          <tr key={product.id} className="border-b">
                            <td className="py-3 px-4">{product.name}</td>
                            <td className="py-3 px-4">{product.category}</td>
                            <td className="py-3 px-4">¥{product.price}</td>
                            <td className="py-3 px-4">{product.sales}</td>
                            <td className="py-3 px-4 text-right">
                              <Button variant="ghost" size="sm">编辑</Button>
                              <Button variant="ghost" size="sm" className="text-red-600">删除</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 订单管理 */}
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>订单管理</CardTitle>
                  <CardDescription>
                    管理商家的所有订单
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="py-8 text-center text-muted-foreground">
                    <ShoppingBag className="mx-auto h-12 w-12 opacity-30" />
                    <p className="mt-2">暂无订单数据</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 评价管理 */}
            <TabsContent value="reviews">
              <Card>
                <CardHeader>
                  <CardTitle>评价管理</CardTitle>
                  <CardDescription>
                    管理商家的所有评价
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="py-8 text-center text-muted-foreground">
                    <Star className="mx-auto h-12 w-12 opacity-30" />
                    <p className="mt-2">暂无评价数据</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
} 