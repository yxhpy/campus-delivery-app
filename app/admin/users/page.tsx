"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/lib/user-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, ChevronLeft, Edit, Trash2, UserPlus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// 用户类型定义
interface User {
  id: string
  username: string
  email: string
  avatar?: string
  role: 'user' | 'merchant' | 'admin'
  createdAt: string
  lastLogin?: string
  status: 'active' | 'inactive' | 'banned'
}

// 模拟用户数据
const mockUsers: User[] = [
  {
    id: "u001",
    username: "张三",
    email: "zhangsan@example.com",
    avatar: "https://i.pravatar.cc/150?img=1",
    role: "user",
    createdAt: "2024-01-10",
    lastLogin: "2024-03-12",
    status: "active"
  },
  {
    id: "u002",
    username: "李四",
    email: "lisi@example.com",
    avatar: "https://i.pravatar.cc/150?img=2",
    role: "user",
    createdAt: "2024-01-15",
    lastLogin: "2024-03-10",
    status: "active"
  },
  {
    id: "u003",
    username: "王五",
    email: "wangwu@example.com",
    avatar: "https://i.pravatar.cc/150?img=3",
    role: "merchant",
    createdAt: "2024-02-01",
    lastLogin: "2024-03-14",
    status: "active"
  },
  {
    id: "u004",
    username: "赵六",
    email: "zhaoliu@example.com",
    avatar: "https://i.pravatar.cc/150?img=4",
    role: "user",
    createdAt: "2024-02-10",
    lastLogin: "2024-02-28",
    status: "inactive"
  },
  {
    id: "u005",
    username: "管理员",
    email: "admin@example.com",
    avatar: "https://i.pravatar.cc/150?img=5",
    role: "admin",
    createdAt: "2024-01-01",
    lastLogin: "2024-03-15",
    status: "active"
  },
  {
    id: "u006",
    username: "黑客",
    email: "hacker@example.com",
    avatar: "https://i.pravatar.cc/150?img=6",
    role: "user",
    createdAt: "2024-02-15",
    lastLogin: "2024-02-16",
    status: "banned"
  }
];

export default function UserManagementPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useUser()
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false)
  const [userToEdit, setUserToEdit] = useState<User | null>(null)
  const [selectedRole, setSelectedRole] = useState<string>("")
  const [selectedStatus, setSelectedStatus] = useState<string>("")

  // 检查用户是否为管理员
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login")
    } else if (user?.role !== "admin") {
      router.push("/")
    }
  }, [isAuthenticated, user, router])

  // 过滤用户列表
  const filteredUsers = users.filter(user => {
    // 搜索条件
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    // 角色过滤
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    
    // 状态过滤
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    
    return matchesSearch && matchesRole && matchesStatus
  })

  // 处理删除用户
  const handleDeleteUser = () => {
    if (userToDelete) {
      setUsers(prev => prev.filter(user => user.id !== userToDelete))
      setUserToDelete(null)
      setIsDeleteDialogOpen(false)
      toast.success("用户已删除")
    }
  }

  // 打开编辑角色对话框
  const openRoleDialog = (user: User) => {
    setUserToEdit(user)
    setSelectedRole(user.role)
    setSelectedStatus(user.status)
    setIsRoleDialogOpen(true)
  }

  // 更新用户角色和状态
  const handleUpdateUser = () => {
    if (userToEdit && selectedRole && selectedStatus) {
      setUsers(prev => prev.map(u => 
        u.id === userToEdit.id 
          ? { ...u, role: selectedRole as 'user' | 'merchant' | 'admin', status: selectedStatus as 'active' | 'inactive' | 'banned' } 
          : u
      ))
      setIsRoleDialogOpen(false)
      toast.success("用户信息已更新")
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
          <p>确定要删除这个用户吗？此操作无法撤销。</p>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
            取消
          </Button>
          <Button variant="destructive" onClick={handleDeleteUser}>
            确认删除
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )

  // 编辑角色对话框
  const EditRoleDialog = () => (
    <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>编辑用户信息</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          {userToEdit && (
            <div className="flex items-center space-x-4 mb-4">
              <Avatar>
                <AvatarImage src={userToEdit.avatar} alt={userToEdit.username} />
                <AvatarFallback>{userToEdit.username.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{userToEdit.username}</p>
                <p className="text-sm text-muted-foreground">{userToEdit.email}</p>
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-medium">用户角色</label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue placeholder="选择用户角色" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">普通用户</SelectItem>
                <SelectItem value="merchant">商家</SelectItem>
                <SelectItem value="admin">管理员</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">账号状态</label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="选择账号状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">正常</SelectItem>
                <SelectItem value="inactive">未激活</SelectItem>
                <SelectItem value="banned">已禁用</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>
            取消
          </Button>
          <Button onClick={handleUpdateUser}>
            保存更改
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
        <h1 className="text-2xl font-bold">用户管理</h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>用户列表</CardTitle>
          <CardDescription>
            管理平台上的所有用户
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between mb-4 space-y-4 md:space-y-0">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索用户..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="按角色筛选" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有角色</SelectItem>
                  <SelectItem value="user">普通用户</SelectItem>
                  <SelectItem value="merchant">商家</SelectItem>
                  <SelectItem value="admin">管理员</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="按状态筛选" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有状态</SelectItem>
                  <SelectItem value="active">正常</SelectItem>
                  <SelectItem value="inactive">未激活</SelectItem>
                  <SelectItem value="banned">已禁用</SelectItem>
                </SelectContent>
              </Select>
              
              <Button className="w-full md:w-auto">
                <UserPlus className="h-4 w-4 mr-1" />
                添加用户
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>用户名</TableHead>
                  <TableHead>邮箱</TableHead>
                  <TableHead>角色</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>注册时间</TableHead>
                  <TableHead>最后登录</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar} alt={user.username} />
                            <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <span>{user.username}</span>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {user.role === 'admin' && (
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                            管理员
                          </Badge>
                        )}
                        {user.role === 'merchant' && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            商家
                          </Badge>
                        )}
                        {user.role === 'user' && (
                          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                            普通用户
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {user.status === 'active' && (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            正常
                          </Badge>
                        )}
                        {user.status === 'inactive' && (
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                            未激活
                          </Badge>
                        )}
                        {user.status === 'banned' && (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            已禁用
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{user.createdAt}</TableCell>
                      <TableCell>{user.lastLogin || "从未登录"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 w-8 p-0"
                            onClick={() => openRoleDialog(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 w-8 p-0 text-red-600"
                            onClick={() => {
                              setUserToDelete(user.id)
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
                      没有找到符合条件的用户
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <DeleteConfirmationDialog />
      <EditRoleDialog />
    </div>
  )
} 