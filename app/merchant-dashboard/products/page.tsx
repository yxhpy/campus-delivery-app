"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/lib/user-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, Search, Edit, Trash2, Plus, Eye, CheckCircle, XCircle } from "lucide-react"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// 商品状态类型
type ProductStatus = 'active' | 'out_of_stock' | 'hidden'

// 商品类型
interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  status: ProductStatus
  stock: number
  createdAt: string
}

// 模拟商品数据
const mockProducts: Product[] = [
  {
    id: "prod-001",
    name: "经典套餐",
    description: "包含米饭、两荤一素和一份汤",
    price: 15,
    category: "套餐",
    image: "https://images.pexels.com/photos/6646072/pexels-photo-6646072.jpeg?auto=compress&cs=tinysrgb&w=800",
    status: "active",
    stock: 100,
    createdAt: "2024-01-15"
  },
  {
    id: "prod-002",
    name: "红烧肉",
    description: "传统红烧肉，肥而不腻",
    price: 8,
    category: "荤菜",
    image: "https://images.pexels.com/photos/2673353/pexels-photo-2673353.jpeg?auto=compress&cs=tinysrgb&w=800",
    status: "active",
    stock: 50,
    createdAt: "2024-01-20"
  },
  {
    id: "prod-003",
    name: "炒青菜",
    description: "新鲜时蔬，清脆爽口",
    price: 5,
    category: "素菜",
    image: "https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=800",
    status: "active",
    stock: 80,
    createdAt: "2024-02-01"
  },
  {
    id: "prod-004",
    name: "紫菜蛋花汤",
    description: "营养美味的紫菜蛋花汤",
    price: 3,
    category: "汤类",
    image: "https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg?auto=compress&cs=tinysrgb&w=800",
    status: "out_of_stock",
    stock: 0,
    createdAt: "2024-02-10"
  },
  {
    id: "prod-005",
    name: "牛肉面",
    description: "手工面条配以香浓牛肉汤底",
    price: 12,
    category: "面食",
    image: "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=800",
    status: "hidden",
    stock: 30,
    createdAt: "2024-03-01"
  }
]

export default function MerchantProductsPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useUser()
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
<<<<<<< HEAD
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<string | null>(null)
=======
>>>>>>> 86379cbbdc7977370070e2dad05faaf66f1df083

  // 检查用户是否为商家
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login")
    } else if (user?.role !== "merchant") {
      router.push("/")
    }
  }, [isAuthenticated, user, router])

  // 获取所有商品分类
  const categories = Array.from(new Set(products.map(product => product.category)))

  // 过滤商品列表
  const filteredProducts = products.filter(product => {
    // 搜索条件
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.category.toLowerCase().includes(searchTerm.toLowerCase())
    
    // 状态过滤
    const matchesStatus = statusFilter === "all" || product.status === statusFilter
    
    // 分类过滤
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
    
    return matchesSearch && matchesStatus && matchesCategory
  })

  // 处理商品状态更新
  const handleStatusUpdate = (productId: string, newStatus: ProductStatus) => {
    setProducts(prev => prev.map(product => 
      product.id === productId ? { ...product, status: newStatus } : product
    ))
    
    const statusText = {
      'active': '上架',
      'out_of_stock': '缺货',
      'hidden': '下架'
    }
    
    toast.success(`商品状态已更新为${statusText[newStatus]}`)
  }

<<<<<<< HEAD
  // 查看商品详情
  const viewProductDetail = (product: Product) => {
    setSelectedProduct(product)
    setIsDetailModalOpen(true)
  }

  // 确认删除商品
  const confirmDeleteProduct = (productId: string) => {
    setProductToDelete(productId)
    setIsDeleteModalOpen(true)
  }

  // 删除商品
  const deleteProduct = () => {
    if (productToDelete) {
      setProducts(prev => prev.filter(product => product.id !== productToDelete))
      setProductToDelete(null)
      setIsDeleteModalOpen(false)
      toast.success("商品已删除")
=======
  // 删除商品
  const handleDeleteProduct = (productId: string) => {
    if (confirm('确定要删除这个商品吗？')) {
      setProducts(prev => prev.filter(product => product.id !== productId))
      toast.success('商品已删除')
>>>>>>> 86379cbbdc7977370070e2dad05faaf66f1df083
    }
  }

  // 渲染商品状态徽章
  const renderStatusBadge = (status: ProductStatus) => {
    switch (status) {
      case 'active':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            上架中
          </Badge>
        )
      case 'out_of_stock':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            缺货
          </Badge>
        )
      case 'hidden':
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            已下架
          </Badge>
        )
      default:
        return null
    }
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
        <h1 className="text-2xl font-bold">商品管理</h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>商品列表</CardTitle>
          <CardDescription>
            管理店铺商品信息和库存
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between mb-4 space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索商品..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[150px]">
                  <SelectValue placeholder="商品状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="active">上架中</SelectItem>
                  <SelectItem value="out_of_stock">缺货</SelectItem>
                  <SelectItem value="hidden">已下架</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-[150px]">
                  <SelectValue placeholder="商品分类" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部分类</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
<<<<<<< HEAD
              <Button onClick={() => toast.info("添加商品功能正在开发中")}>
=======
              <Button onClick={() => router.push("/merchant-dashboard/products/new")}>
>>>>>>> 86379cbbdc7977370070e2dad05faaf66f1df083
                <Plus className="h-4 w-4 mr-1" />
                添加商品
              </Button>
            </div>
          </div>

<<<<<<< HEAD
          <div className="rounded-md border">
=======
          <div className="border rounded-lg">
>>>>>>> 86379cbbdc7977370070e2dad05faaf66f1df083
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>商品名称</TableHead>
<<<<<<< HEAD
                  <TableHead>价格</TableHead>
                  <TableHead>分类</TableHead>
                  <TableHead>库存</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>¥{product.price.toFixed(2)}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>{product.stock}</TableCell>
                      <TableCell>{renderStatusBadge(product.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => viewProductDetail(product)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => toast.info("编辑商品功能正在开发中")}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          
                          {product.status === 'hidden' ? (
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleStatusUpdate(product.id, 'active')}
                            >
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </Button>
                          ) : (
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleStatusUpdate(product.id, 'hidden')}
                            >
                              <XCircle className="h-4 w-4 text-red-600" />
                            </Button>
                          )}
                          
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => confirmDeleteProduct(product.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      没有找到符合条件的商品
                    </TableCell>
                  </TableRow>
                )}
=======
                  <TableHead>分类</TableHead>
                  <TableHead>价格</TableHead>
                  <TableHead>库存</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">{product.description}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>¥{product.price}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>{renderStatusBadge(product.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => router.push(`/merchant-dashboard/products/${product.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => router.push(`/merchant-dashboard/products/${product.id}/edit`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        {product.status !== 'active' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleStatusUpdate(product.id, 'active')}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        {product.status !== 'hidden' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleStatusUpdate(product.id, 'hidden')}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
>>>>>>> 86379cbbdc7977370070e2dad05faaf66f1df083
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
<<<<<<< HEAD

      {/* 商品详情对话框 */}
      {selectedProduct && (
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${isDetailModalOpen ? 'block' : 'hidden'}`}>
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">商品详情</h2>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setIsDetailModalOpen(false)}
                >
                  <XCircle className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <div className="rounded-md overflow-hidden mb-4 h-48">
                    <img 
                      src={selectedProduct.image} 
                      alt={selectedProduct.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-muted-foreground">商品状态</p>
                      <div className="mt-1">{renderStatusBadge(selectedProduct.status)}</div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">创建时间</p>
                      <p>{selectedProduct.createdAt}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">商品名称</p>
                    <p className="font-medium text-lg">{selectedProduct.name}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">价格</p>
                    <p className="font-medium">¥{selectedProduct.price.toFixed(2)}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">分类</p>
                    <p>{selectedProduct.category}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">库存</p>
                    <p>{selectedProduct.stock}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">描述</p>
                    <p>{selectedProduct.description}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 mt-6">
                <Button 
                  variant="outline"
                  onClick={() => {
                    setIsDetailModalOpen(false)
                    toast.info("编辑商品功能正在开发中")
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  编辑商品
                </Button>
                
                {selectedProduct.status === 'hidden' ? (
                  <Button 
                    onClick={() => {
                      handleStatusUpdate(selectedProduct.id, 'active')
                      setIsDetailModalOpen(false)
                    }}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    上架商品
                  </Button>
                ) : (
                  <Button 
                    variant="outline"
                    onClick={() => {
                      handleStatusUpdate(selectedProduct.id, 'hidden')
                      setIsDetailModalOpen(false)
                    }}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    下架商品
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 删除确认对话框 */}
      <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${isDeleteModalOpen ? 'block' : 'hidden'}`}>
        <div className="bg-white rounded-lg w-full max-w-md">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">确认删除</h2>
            <p className="mb-6">确定要删除这个商品吗？此操作无法撤销。</p>
            
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                取消
              </Button>
              
              <Button 
                variant="destructive"
                onClick={deleteProduct}
              >
                确认删除
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
=======
    </div>
  )
}
>>>>>>> 86379cbbdc7977370070e2dad05faaf66f1df083
