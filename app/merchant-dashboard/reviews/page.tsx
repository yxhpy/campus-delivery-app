"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/lib/user-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronLeft, Search, Star, MessageSquare, Filter } from "lucide-react"
import { toast } from "sonner"

// 评价类型
interface Review {
  id: string
  orderId: string
  productName: string
  customerName: string
  customerAvatar: string
  rating: number
  content: string
  images: string[]
  createdAt: string
  reply?: string
  repliedAt?: string
}

// 模拟评价数据
const mockReviews: Review[] = [
  {
    id: "review-001",
    orderId: "order-123",
    productName: "黄焖鸡米饭",
    customerName: "张同学",
    customerAvatar: "",
    rating: 5,
    content: "味道很好，送餐速度快，包装也很好，下次还会再来！",
    images: [
      "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    createdAt: "2024-03-10T08:30:00Z",
    reply: "感谢您的好评，欢迎下次再来！",
    repliedAt: "2024-03-10T10:15:00Z"
  },
  {
    id: "review-002",
    orderId: "order-124",
    productName: "麻辣香锅",
    customerName: "李同学",
    customerAvatar: "",
    rating: 4,
    content: "味道不错，但是有点辣，希望下次可以根据顾客需求调整辣度。",
    images: [],
    createdAt: "2024-03-09T12:45:00Z",
    reply: "感谢您的建议，我们会考虑增加辣度选择功能。",
    repliedAt: "2024-03-09T14:20:00Z"
  },
  {
    id: "review-003",
    orderId: "order-125",
    productName: "鱼香肉丝盖饭",
    customerName: "王同学",
    customerAvatar: "",
    rating: 3,
    content: "味道一般，送餐有点慢，希望能改进。",
    images: [],
    createdAt: "2024-03-08T18:20:00Z"
  },
  {
    id: "review-004",
    orderId: "order-126",
    productName: "宫保鸡丁",
    customerName: "赵同学",
    customerAvatar: "",
    rating: 5,
    content: "宫保鸡丁做得很好吃，花生酥脆，鸡肉嫩滑，下次还会点！",
    images: [
      "https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    createdAt: "2024-03-07T19:10:00Z"
  },
  {
    id: "review-005",
    orderId: "order-127",
    productName: "水煮肉片",
    customerName: "刘同学",
    customerAvatar: "",
    rating: 2,
    content: "太辣了，而且肉片有点老，希望能改进。",
    images: [],
    createdAt: "2024-03-06T12:30:00Z"
  }
]

export default function MerchantReviewsPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useUser()
  const [activeTab, setActiveTab] = useState("all")
  const [reviews, setReviews] = useState<Review[]>(mockReviews)
  const [filteredReviews, setFilteredReviews] = useState<Review[]>(mockReviews)
  const [searchTerm, setSearchTerm] = useState("")
  const [ratingFilter, setRatingFilter] = useState("all")
  const [replyContent, setReplyContent] = useState<Record<string, string>>({})

  // 检查用户是否为商家
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login")
    } else if (user?.role !== "merchant") {
      router.push("/")
    }
  }, [isAuthenticated, user, router])

  // 处理标签页变化
  useEffect(() => {
    filterReviews(searchTerm, ratingFilter, activeTab)
  }, [activeTab])

  // 处理搜索和筛选
  const filterReviews = (search: string, rating: string, tab: string) => {
    let filtered = [...reviews]
    
    // 搜索过滤
    if (search) {
      filtered = filtered.filter(review => 
        review.productName.toLowerCase().includes(search.toLowerCase()) ||
        review.content.toLowerCase().includes(search.toLowerCase()) ||
        review.customerName.toLowerCase().includes(search.toLowerCase())
      )
    }
    
    // 评分过滤
    if (rating !== "all") {
      const ratingValue = parseInt(rating)
      filtered = filtered.filter(review => review.rating === ratingValue)
    }
    
    // 标签页过滤
    if (tab === "unreplied") {
      filtered = filtered.filter(review => !review.reply)
    } else if (tab === "replied") {
      filtered = filtered.filter(review => review.reply)
    }
    
    setFilteredReviews(filtered)
  }

  // 处理搜索
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    filterReviews(value, ratingFilter, activeTab)
  }

  // 处理评分筛选
  const handleRatingFilter = (value: string) => {
    setRatingFilter(value)
    filterReviews(searchTerm, value, activeTab)
  }

  // 处理回复内容变化
  const handleReplyChange = (reviewId: string, content: string) => {
    setReplyContent(prev => ({
      ...prev,
      [reviewId]: content
    }))
  }

  // 提交回复
  const submitReply = (reviewId: string) => {
    const content = replyContent[reviewId]
    if (!content || content.trim() === "") {
      toast.error("回复内容不能为空")
      return
    }
    
    // 更新评价数据
    const updatedReviews = reviews.map(review => {
      if (review.id === reviewId) {
        return {
          ...review,
          reply: content,
          repliedAt: new Date().toISOString()
        }
      }
      return review
    })
    
    setReviews(updatedReviews)
    filterReviews(searchTerm, ratingFilter, activeTab)
    
    // 清空回复内容
    setReplyContent(prev => ({
      ...prev,
      [reviewId]: ""
    }))
    
    toast.success("回复成功")
  }

  // 渲染星级
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      <Star 
        key={index} 
        className={`h-4 w-4 ${index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
      />
    ))
  }

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!isAuthenticated || user?.role !== "merchant") {
    return null // 等待重定向
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          className="mr-2" 
          onClick={() => router.push("/merchant-dashboard")}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          返回
        </Button>
        <h1 className="text-2xl font-bold">评价管理</h1>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索评价"
            className="pl-8"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={ratingFilter} onValueChange={handleRatingFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="评分筛选" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部评分</SelectItem>
              <SelectItem value="5">5星</SelectItem>
              <SelectItem value="4">4星</SelectItem>
              <SelectItem value="3">3星</SelectItem>
              <SelectItem value="2">2星</SelectItem>
              <SelectItem value="1">1星</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all">全部评价</TabsTrigger>
          <TabsTrigger value="unreplied">待回复</TabsTrigger>
          <TabsTrigger value="replied">已回复</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <div className="space-y-6">
            {filteredReviews.length > 0 ? (
              filteredReviews.map(review => (
                <Card key={review.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={review.customerAvatar} alt={review.customerName} />
                          <AvatarFallback>{review.customerName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{review.customerName}</div>
                          <div className="text-sm text-muted-foreground">{formatDate(review.createdAt)}</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="text-sm font-medium text-muted-foreground mb-1">
                        订单: {review.orderId} | 商品: {review.productName}
                      </div>
                      <p className="text-sm">{review.content}</p>
                    </div>
                    
                    {review.images && review.images.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {review.images.map((image, index) => (
                          <div key={index} className="w-20 h-20 rounded overflow-hidden">
                            <img src={image} alt="评价图片" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {review.reply && (
                      <div className="bg-muted p-3 rounded-md mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <div className="font-medium text-sm">商家回复</div>
                          <div className="text-xs text-muted-foreground">
                            {review.repliedAt && formatDate(review.repliedAt)}
                          </div>
                        </div>
                        <p className="text-sm">{review.reply}</p>
                      </div>
                    )}
                    
                    {!review.reply && (
                      <div className="mt-4">
                        <Textarea
                          placeholder="输入回复内容..."
                          className="mb-2"
                          value={replyContent[review.id] || ""}
                          onChange={(e) => handleReplyChange(review.id, e.target.value)}
                        />
                        <Button 
                          size="sm" 
                          onClick={() => submitReply(review.id)}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          提交回复
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">暂无评价</h3>
                <p className="text-muted-foreground">当前筛选条件下没有找到评价</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 