"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/lib/cart-context"
import { useUser } from "@/lib/user-context"
import { ArrowLeft, MapPin, CreditCard } from "lucide-react"
import { toast } from "sonner"
import { getAvailablePaymentMethods } from "@/lib/payment-service"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, clearCart, totalItems, subtotal } = useCart()
  const { isAuthenticated } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<string>("")
  const [deliveryFee] = useState(3) // 固定配送费
  const [serviceFee] = useState(1) // 固定服务费
  const [paymentMethods] = useState(getAvailablePaymentMethods())

  // 按商家分组购物车商品
  const itemsByMerchant = items.reduce((groups, item) => {
    const group = groups[item.merchantId] || {
      merchantId: item.merchantId,
      merchantName: item.merchantName,
      items: []
    }
    group.items.push(item)
    groups[item.merchantId] = group
    return groups
  }, {} as Record<string, { merchantId: string, merchantName: string, items: typeof items }>)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login")
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    if (items.length === 0) {
      router.push("/")
    }
  }, [items.length, router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const notes = formData.get("notes") as string

      if (!selectedPayment) {
        toast.error("请选择支付方式")
        return
      }

      // 这里应该调用实际的创建订单API
      // 为了演示，我们使用模拟延迟
      await new Promise(resolve => setTimeout(resolve, 1000))

      // 清空购物车
      clearCart()

      // 跳转到支付页面
      router.push(`/payment?amount=${totalAmount}&method=${selectedPayment}`)
    } catch (error) {
      toast.error("创建订单失败，请重试")
    } finally {
      setIsLoading(false)
    }
  }

  const totalAmount = subtotal + deliveryFee + serviceFee

  if (items.length === 0 || !isAuthenticated) {
    return null // 等待重定向
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800">
          <ArrowLeft className="mr-1 h-4 w-4" />
          返回首页
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">确认订单</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* 订单商品 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">订单商品</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.values(itemsByMerchant).map(group => (
                <div key={group.merchantId} className="space-y-4">
                  <div className="font-medium">{group.merchantName}</div>
                  <div className="space-y-4">
                    {group.items.map(item => (
                      <div key={item.id} className="flex items-start space-x-4">
                        {item.image && (
                          <div className="h-16 w-16 rounded overflow-hidden flex-shrink-0">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">
                            ¥{item.price.toFixed(2)} × {item.quantity}
                          </div>
                        </div>
                        <div className="font-medium">
                          ¥{(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Separator />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 配送地址 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">配送地址</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">校园公寓 3号楼 512室</p>
                    <p className="text-sm text-muted-foreground">广东省广州市天河区校园大道1号</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  修改地址
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 支付方式 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">支付方式</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={selectedPayment}
                onValueChange={setSelectedPayment}
                className="space-y-3"
              >
                {paymentMethods.map(method => (
                  <div
                    key={method.id}
                    className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors"
                  >
                    <RadioGroupItem value={method.id} id={method.id} />
                    <Label htmlFor={method.id} className="flex items-center gap-2 cursor-pointer">
                      <img src={method.icon} alt={method.name} className="h-6 w-6" />
                      <span>{method.name}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* 备注 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">订单备注</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                name="notes"
                placeholder="请输入订单备注（选填）"
                disabled={isLoading}
              />
            </CardContent>
          </Card>
        </div>

        {/* 订单金额 */}
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-lg">订单金额</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">商品总价</span>
                  <span>¥{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">配送费</span>
                  <span>¥{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">服务费</span>
                  <span>¥{serviceFee.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>实付金额</span>
                  <span className="text-lg">¥{totalAmount.toFixed(2)}</span>
                </div>
              </div>
              <form onSubmit={handleSubmit}>
                <Button 
                  className="w-full" 
                  size="lg"
                  disabled={isLoading}
                  type="submit"
                >
                  {isLoading ? "提交中..." : "提交订单"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 