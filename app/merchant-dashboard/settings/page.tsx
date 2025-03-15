"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useUser } from "@/lib/user-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ChevronLeft, Save, Clock, MapPin, Phone, Mail, Image as ImageIcon } from "lucide-react"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// 商家信息类型
interface MerchantInfo {
  id: string
  name: string
  description: string
  address: string
  phone: string
  email: string
  logo: string
  coverImage: string
  businessHours: {
    monday: { open: string; close: string; isOpen: boolean }
    tuesday: { open: string; close: string; isOpen: boolean }
    wednesday: { open: string; close: string; isOpen: boolean }
    thursday: { open: string; close: string; isOpen: boolean }
    friday: { open: string; close: string; isOpen: boolean }
    saturday: { open: string; close: string; isOpen: boolean }
    sunday: { open: string; close: string; isOpen: boolean }
  }
  deliveryRange: number
  minOrderAmount: number
  deliveryFee: number
}

// 模拟商家数据
const mockMerchantInfo: MerchantInfo = {
  id: "merchant-001",
  name: "学生食堂",
  description: "提供各种美味可口的校园餐饮，包括中式、西式多种选择。",
  address: "校园大道1号",
  phone: "123-4567-8910",
  email: "contact@campus-food.com",
  logo: "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=800",
  coverImage: "https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=800",
  businessHours: {
    monday: { open: "07:30", close: "20:00", isOpen: true },
    tuesday: { open: "07:30", close: "20:00", isOpen: true },
    wednesday: { open: "07:30", close: "20:00", isOpen: true },
    thursday: { open: "07:30", close: "20:00", isOpen: true },
    friday: { open: "07:30", close: "20:00", isOpen: true },
    saturday: { open: "08:00", close: "19:00", isOpen: true },
    sunday: { open: "08:00", close: "19:00", isOpen: true }
  },
  deliveryRange: 3,
  minOrderAmount: 10,
  deliveryFee: 2
}

// 星期映射
const dayNameMap: Record<string, string> = {
  monday: '星期一',
  tuesday: '星期二',
  wednesday: '星期三',
  thursday: '星期四',
  friday: '星期五',
  saturday: '星期六',
  sunday: '星期日'
}

export default function MerchantSettingsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isAuthenticated } = useUser()
  const [merchantInfo, setMerchantInfo] = useState<MerchantInfo>(mockMerchantInfo)
  const [activeTab, setActiveTab] = useState("basic")
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(mockMerchantInfo)

  // 检查用户是否为商家
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login")
    } else if (user?.role !== "merchant") {
      router.push("/")
    }
  }, [isAuthenticated, user, router])

  // 处理URL参数，设置初始标签页
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && ['basic', 'business-hours', 'delivery'].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  // 处理表单输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // 处理数字输入变化
  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }))
  }

  // 处理营业时间变化
  const handleBusinessHoursChange = (
    day: keyof MerchantInfo['businessHours'], 
    field: 'open' | 'close' | 'isOpen', 
    value: string | boolean
  ) => {
    setFormData(prev => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: {
          ...prev.businessHours[day],
          [field]: value
        }
      }
    }))
  }

  // 切换营业状态
  const toggleBusinessDay = (day: keyof MerchantInfo['businessHours'], isOpen: boolean) => {
    handleBusinessHoursChange(day, 'isOpen', isOpen)
  }

  // 保存设置
  const saveSettings = () => {
    setMerchantInfo(formData)
    setIsEditing(false)
    toast.success("店铺设置已保存")
  }

  // 取消编辑
  const cancelEdit = () => {
    setFormData(merchantInfo)
    setIsEditing(false)
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
        <h1 className="text-2xl font-bold">店铺设置</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="basic">基本信息</TabsTrigger>
          <TabsTrigger value="business-hours">营业时间</TabsTrigger>
          <TabsTrigger value="delivery">配送设置</TabsTrigger>
        </TabsList>

        {/* 基本信息 */}
        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>基本信息</CardTitle>
              <CardDescription>
                管理店铺的基本信息和联系方式
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">店铺名称</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">联系电话</Label>
                    <Input 
                      id="phone" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">电子邮箱</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">店铺地址</Label>
                  <Input 
                    id="address" 
                    name="address" 
                    value={formData.address} 
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">店铺描述</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    value={formData.description} 
                    onChange={handleInputChange}
                    rows={4}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>店铺Logo</Label>
                    <div className="border rounded-md p-4 flex flex-col items-center">
                      <div className="w-32 h-32 rounded-md overflow-hidden mb-4">
                        <img 
                          src={formData.logo} 
                          alt="店铺Logo" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {isEditing && (
                        <Button variant="outline" onClick={() => toast.info("图片上传功能正在开发中")}>
                          <ImageIcon className="h-4 w-4 mr-2" />
                          更换Logo
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>店铺封面图</Label>
                    <div className="border rounded-md p-4 flex flex-col items-center">
                      <div className="w-full h-32 rounded-md overflow-hidden mb-4">
                        <img 
                          src={formData.coverImage} 
                          alt="店铺封面图" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {isEditing && (
                        <Button variant="outline" onClick={() => toast.info("图片上传功能正在开发中")}>
                          <ImageIcon className="h-4 w-4 mr-2" />
                          更换封面图
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  {isEditing ? (
                    <>
                      <Button variant="outline" onClick={cancelEdit}>
                        取消
                      </Button>
                      <Button onClick={saveSettings}>
                        <Save className="h-4 w-4 mr-2" />
                        保存设置
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)}>
                      编辑信息
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 营业时间 */}
        <TabsContent value="business-hours">
          <Card>
            <CardHeader>
              <CardTitle>营业时间</CardTitle>
              <CardDescription>
                设置店铺的营业时间
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(formData.businessHours).map(([day, hours]) => {
                  const dayName = dayNameMap[day] || day
                  
                  return (
                    <div key={day} className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-20 font-medium">{dayName}</div>
                        <div className="flex items-center">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="sr-only peer"
                              checked={hours.isOpen}
                              onChange={(e) => toggleBusinessDay(day as keyof MerchantInfo['businessHours'], e.target.checked)}
                              disabled={!isEditing}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                          </label>
                          <span className="ml-2 text-sm text-muted-foreground">
                            {hours.isOpen ? '营业' : '休息'}
                          </span>
                        </div>
                      </div>
                      
                      {hours.isOpen && (
                        <div className="flex items-center space-x-2">
                          <div className="flex flex-col">
                            <Label htmlFor={`${day}-open`} className="text-xs mb-1">开始时间</Label>
                            <Input 
                              id={`${day}-open`}
                              type="time"
                              value={hours.open}
                              onChange={(e) => 
                                handleBusinessHoursChange(day as keyof MerchantInfo['businessHours'], 'open', e.target.value)
                              }
                              className="w-24"
                              disabled={!isEditing}
                            />
                          </div>
                          <span className="mt-6">至</span>
                          <div className="flex flex-col">
                            <Label htmlFor={`${day}-close`} className="text-xs mb-1">结束时间</Label>
                            <Input 
                              id={`${day}-close`}
                              type="time"
                              value={hours.close}
                              onChange={(e) => 
                                handleBusinessHoursChange(day as keyof MerchantInfo['businessHours'], 'close', e.target.value)
                              }
                              className="w-24"
                              disabled={!isEditing}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
                
                <div className="flex justify-end space-x-2 pt-4">
                  {isEditing ? (
                    <>
                      <Button variant="outline" onClick={cancelEdit}>
                        取消
                      </Button>
                      <Button onClick={saveSettings}>
                        <Save className="h-4 w-4 mr-2" />
                        保存设置
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)}>
                      编辑营业时间
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 配送设置 */}
        <TabsContent value="delivery">
          <Card>
            <CardHeader>
              <CardTitle>配送设置</CardTitle>
              <CardDescription>
                管理店铺的配送范围和费用
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="deliveryRange">配送范围 (公里)</Label>
                    <Input 
                      id="deliveryRange" 
                      name="deliveryRange" 
                      type="number"
                      min="0"
                      step="0.1"
                      value={formData.deliveryRange} 
                      onChange={handleNumberInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="minOrderAmount">最低订单金额 (元)</Label>
                    <Input 
                      id="minOrderAmount" 
                      name="minOrderAmount" 
                      type="number"
                      min="0"
                      step="0.1"
                      value={formData.minOrderAmount} 
                      onChange={handleNumberInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="deliveryFee">配送费 (元)</Label>
                    <Input 
                      id="deliveryFee" 
                      name="deliveryFee" 
                      type="number"
                      min="0"
                      step="0.1"
                      value={formData.deliveryFee} 
                      onChange={handleNumberInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  {isEditing ? (
                    <>
                      <Button variant="outline" onClick={cancelEdit}>
                        取消
                      </Button>
                      <Button onClick={saveSettings}>
                        <Save className="h-4 w-4 mr-2" />
                        保存设置
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)}>
                      编辑配送设置
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 