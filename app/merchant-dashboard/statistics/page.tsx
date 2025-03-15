"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/lib/user-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, Download, Calendar } from "lucide-react"
import { format, subDays, subMonths, parseISO } from "date-fns"
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from "recharts"

// 模拟销售数据
const generateSalesData = (days: number) => {
  const data = []
  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(new Date(), i)
    data.push({
      date: format(date, 'MM-dd'),
      sales: Math.floor(Math.random() * 1000) + 500,
      orders: Math.floor(Math.random() * 20) + 5,
    })
  }
  return data
}

// 模拟订单数据
const generateOrdersData = () => {
  return [
    { status: '待处理', value: 12, color: '#ff8c00' },
    { status: '配送中', value: 8, color: '#0088fe' },
    { status: '已完成', value: 35, color: '#00c49f' },
    { status: '已取消', value: 5, color: '#ff0000' },
  ]
}

// 模拟商品销量数据
const generateProductsData = () => {
  return [
    { name: '黄焖鸡米饭', sales: 65 },
    { name: '麻辣香锅', sales: 59 },
    { name: '鱼香肉丝盖饭', sales: 45 },
    { name: '宫保鸡丁', sales: 38 },
    { name: '水煮肉片', sales: 32 },
    { name: '酸菜鱼', sales: 28 },
    { name: '回锅肉', sales: 25 },
    { name: '红烧排骨', sales: 22 },
    { name: '糖醋里脊', sales: 18 },
    { name: '麻婆豆腐', sales: 15 },
  ]
}

export default function MerchantStatisticsPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useUser()
  const [activeTab, setActiveTab] = useState("sales")
  const [timeRange, setTimeRange] = useState("7days")
  const [salesData, setSalesData] = useState(generateSalesData(7))
  const [ordersData, setOrdersData] = useState(generateOrdersData())
  const [productsData, setProductsData] = useState(generateProductsData())

  // 检查用户是否为商家
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login")
    } else if (user?.role !== "merchant") {
      router.push("/")
    }
  }, [isAuthenticated, user, router])

  // 处理时间范围变化
  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value)
    
    let days = 7
    switch (value) {
      case "7days":
        days = 7
        break
      case "30days":
        days = 30
        break
      case "90days":
        days = 90
        break
    }
    
    setSalesData(generateSalesData(days))
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
        <h1 className="text-2xl font-bold">数据统计</h1>
      </div>

      <div className="flex justify-between items-center mb-6">
        <Select value={timeRange} onValueChange={handleTimeRangeChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="选择时间范围" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">最近7天</SelectItem>
            <SelectItem value="30days">最近30天</SelectItem>
            <SelectItem value="90days">最近90天</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          导出数据
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">总销售额</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥{salesData.reduce((sum, item) => sum + item.sales, 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">较上周 +8%</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">总订单数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{salesData.reduce((sum, item) => sum + item.orders, 0)}</div>
            <p className="text-xs text-muted-foreground mt-1">较上周 +12%</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">平均订单金额</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ¥{Math.round(salesData.reduce((sum, item) => sum + item.sales, 0) / 
                salesData.reduce((sum, item) => sum + item.orders, 0))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">较上周 -2%</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="sales">销售趋势</TabsTrigger>
          <TabsTrigger value="orders">订单分析</TabsTrigger>
          <TabsTrigger value="products">商品销量</TabsTrigger>
        </TabsList>

        {/* 销售趋势 */}
        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>销售趋势</CardTitle>
              <CardDescription>
                查看销售额和订单数量的变化趋势
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={salesData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="sales" 
                      name="销售额 (元)" 
                      stroke="#8884d8" 
                      activeDot={{ r: 8 }} 
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="orders" 
                      name="订单数" 
                      stroke="#82ca9d" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 订单分析 */}
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>订单状态分布</CardTitle>
              <CardDescription>
                查看不同状态订单的分布情况
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ordersData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {ordersData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} 个订单`, '数量']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 商品销量 */}
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>商品销量排行</CardTitle>
              <CardDescription>
                查看销量最高的商品
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={productsData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sales" name="销量 (份)" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 