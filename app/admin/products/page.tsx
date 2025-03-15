"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/lib/user-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Search, Plus, Edit, Trash2, Filter } from "lucide-react"

// 商品接口定义
interface Product {
  id: string
  name: string
  image: string
  price: number
  originalPrice: number
  merchantId: string
  merchantName: string
  category: string
  status: "available" | "soldout" | "hidden"
  createdAt: string
  description: string
  sales: number
  rating: number
}

// 模拟商品数据
const mockProducts: Product[] = [
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

// 商品状态映射
const statusMap = {
  available: { label: "在售", color: "success" },
  soldout: { label: "售罄", color: "warning" },
  hidden: { label: "隐藏", color: "secondary" }
}

export default function ProductManagementPage() {
  const router = useRouter()
  const { user, loading } = useUser()
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<string | null>(null)

  // 检查用户权限
  useEffect(() => {
    if (!loading && user && user.role !== "admin") {
      toast.error("您没有权限访问此页面")
      router.push("/")
    }
  }, [user, loading, router])

  // 处理搜索和筛选
  useEffect(() => {
    let result = [...products]
    
    // 搜索过滤
    if (searchTerm) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.merchantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    // 分类过滤
    if (selectedCategory !== "all") {
      result = result.filter(product => product.category === selectedCategory)
    }
    
    // 状态过滤
    if (selectedStatus !== "all") {
      result = result.filter(product => product.status === selectedStatus)
    }
    
    setFilteredProducts(result)
  }, [products, searchTerm, selectedCategory, selectedStatus])

  // 处理商品状态更新
  const handleStatusUpdate = (id: string, newStatus: "available" | "soldout" | "hidden") => {
    const updatedProducts = products.map(product => 
      product.id === id ? { ...product, status: newStatus } : product
    )
    setProducts(updatedProducts)
    toast.success("商品状态已更新")
  }

  // 处理商品删除
  const handleDelete = (id: string) => {
    setProductToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (productToDelete) {
      const updatedProducts = products.filter(product => product.id !== productToDelete)
      setProducts(updatedProducts)
      toast.success("商品已删除")
      setDeleteDialogOpen(false)
      setProductToDelete(null)
    }
  }

  // 获取所有商品分类
  const categories = Array.from(new Set(products.map(product => product.category)))

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">加载中...</div>
  }

  if (!user || user.role !== "admin") {
    return null
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">商品管理</h1>
        <Button onClick={() => router.push("/admin/products/new")}>
          <Plus className="mr-2 h-4 w-4" />
          添加商品
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>商品列表</CardTitle>
          <CardDescription>管理所有商家的商品信息</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索商品名称、商家或描述..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="商品分类" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有分类</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="商品状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有状态</SelectItem>
                  <SelectItem value="available">在售</SelectItem>
                  <SelectItem value="soldout">售罄</SelectItem>
                  <SelectItem value="hidden">隐藏</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>商品名称</TableHead>
                  <TableHead>价格</TableHead>
                  <TableHead>商家</TableHead>
                  <TableHead>分类</TableHead>
                  <TableHead>销量</TableHead>
                  <TableHead>评分</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4">
                      没有找到符合条件的商品
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>
                        ¥{product.price.toFixed(2)}
                        {product.originalPrice > product.price && (
                          <span className="text-muted-foreground line-through ml-2">
                            ¥{product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>{product.merchantName}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>{product.sales}</TableCell>
                      <TableCell>{product.rating.toFixed(1)}</TableCell>
                      <TableCell>
                        <Badge variant={statusMap[product.status].color as any}>
                          {statusMap[product.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/admin/products/${product.id}`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 删除确认对话框 */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              您确定要删除这个商品吗？此操作无法撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 