"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/lib/user-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, ChevronLeft, Plus, Edit, Trash2, CheckCircle, XCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

// 商家类型定义
interface Merchant {
  id: string
  name: string
  logo: string
  address: string
  phone: string
  category: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
}

// 模拟商家数据
const mockMerchants: Merchant[] = [
  {
    id: "m001",
    name: "校园快餐店",
    logo: "/images/merchants/restaurant1.jpg",
    address: "大学城东路123号",
    phone: "13800138001",
    category: "快餐",
    status: "approved",
    createdAt: "2024-01-15"
  },
  {
    id: "m002",
    name: "甜品奶茶屋",
    logo: "/images/merchants/restaurant2.jpg",
    address: "大学城西路45号",
    phone: "13800138002",
    category: "甜品",
    status: "approved",
    createdAt: "2024-01-20"
  },
  {
    id: "m003",
    name: "校园超市",
    logo: "/images/merchants/store1.jpg",
    address: "大学城北路78号",
    phone: "13800138003",
    category: "超市",
    status: "approved",
    createdAt: "2024-02-01"
  },
  {
    id: "m004",
    name: "新鲜水果店",
    logo: "/images/merchants/store2.jpg",
    address: "大学城南路56号",
    phone: "13800138004",
    category: "水果",
    status: "pending",
    createdAt: "2024-03-05"
  },
  {
    id: "m005",
    name: "校园书店",
    logo: "/images/merchants/store3.jpg",
    address: "大学城中心广场12号",
    phone: "13800138005",
    category: "书店",
    status: "rejected",
    createdAt: "2024-03-10"
  }
];

export default function MerchantManagementPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useUser()
  const [merchants, setMerchants] = useState<Merchant[]>(mockMerchants)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [merchantToDelete, setMerchantToDelete] = useState<string | null>(null)

  // 检查用户是否为管理员
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login")
    } else if (user?.role !== "admin") {
      router.push("/")
    }
  }, [isAuthenticated, user, router])

  // 过滤商家列表
  const filteredMerchants = merchants.filter(merchant => {
    // 搜索条件
    const matchesSearch = merchant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          merchant.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          merchant.category.toLowerCase().includes(searchTerm.toLowerCase())
    
    // 状态过滤
    const matchesStatus = statusFilter === "all" || merchant.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  // 处理商家状态变更
  const handleStatusChange = (merchantId: string, newStatus: 'approved' | 'rejected') => {
    setMerchants(prev => prev.map(merchant => 
      merchant.id === merchantId ? { ...merchant, status: newStatus } : merchant
    ))
    
    toast.success(`商家状态已更新为${newStatus === 'approved' ? '已批准' : '已拒绝'}`)
  }

  // 处理删除商家
  const handleDeleteMerchant = () => {
    if (merchantToDelete) {
      setMerchants(prev => prev.filter(merchant => merchant.id !== merchantToDelete))
      setMerchantToDelete(null)
      setIsDeleteDialogOpen(false)
      toast.success("商家已删除")
    }
  }

  // 确认删除对话框
  const DeleteConfirmationDialog = () => (
    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>确认删除</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>确定要删除这个商家吗？此操作无法撤销。</p>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
            取消
          </Button>
          <Button variant="destructive" onClick={handleDeleteMerchant}>
            确认删除
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )

  if (!isAuthenticated || user?.role !== "admin") {
    return null // 等待重定向
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          className="mr-2" 
          onClick={() => router.push("/admin")}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          返回
        </Button>
        <h1 className="text-2xl font-bold">商家管理</h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>商家列表</CardTitle>
          <CardDescription>
            管理平台上的所有商家
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between mb-4 space-y-4 md:space-y-0">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索商家..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <Tabs 
                defaultValue="all" 
                value={statusFilter} 
                onValueChange={setStatusFilter}
                className="w-full md:w-auto"
              >
                <TabsList>
                  <TabsTrigger value="all">全部</TabsTrigger>
                  <TabsTrigger value="pending">待审核</TabsTrigger>
                  <TabsTrigger value="approved">已批准</TabsTrigger>
                  <TabsTrigger value="rejected">已拒绝</TabsTrigger>
                </TabsList>
              </Tabs>
              <Button onClick={() => router.push("/admin/merchants/new")}>
                <Plus className="h-4 w-4 mr-1" />
                添加商家
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>商家名称</TableHead>
                  <TableHead>分类</TableHead>
                  <TableHead>地址</TableHead>
                  <TableHead>联系电话</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMerchants.length > 0 ? (
                  filteredMerchants.map((merchant) => (
                    <TableRow key={merchant.id}>
                      <TableCell className="font-medium">{merchant.name}</TableCell>
                      <TableCell>{merchant.category}</TableCell>
                      <TableCell>{merchant.address}</TableCell>
                      <TableCell>{merchant.phone}</TableCell>
                      <TableCell>
                        {merchant.status === 'pending' && (
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                            待审核
                          </Badge>
                        )}
                        {merchant.status === 'approved' && (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            已批准
                          </Badge>
                        )}
                        {merchant.status === 'rejected' && (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            已拒绝
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{merchant.createdAt}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          {merchant.status === 'pending' && (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-8 w-8 p-0 text-green-600"
                                onClick={() => handleStatusChange(merchant.id, 'approved')}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-8 w-8 p-0 text-red-600"
                                onClick={() => handleStatusChange(merchant.id, 'rejected')}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 w-8 p-0"
                            onClick={() => router.push(`/admin/merchants/${merchant.id}`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 w-8 p-0 text-red-600"
                            onClick={() => {
                              setMerchantToDelete(merchant.id)
                              setIsDeleteDialogOpen(true)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                      没有找到符合条件的商家
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <DeleteConfirmationDialog />
    </div>
  )
} 