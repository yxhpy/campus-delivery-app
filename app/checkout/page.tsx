"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/lib/cart-context"
import { ArrowLeft, CreditCard, MapPin, Clock, AlertCircle } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [address, setAddress] = useState("校园公寓 3号楼 512室")
  const [paymentMethod, setPaymentMethod] = useState("微信支付")
  const [deliveryTime, setDeliveryTime] = useState("尽快送达")
  
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

  // 如果购物车为空，重定向到首页
  useEffect(() => {
    if (items.length === 0) {
      router.push("/")
    }
  }, [items, router])

  const handleSubmitOrder = () => {
    setLoading(true)
    
    // 模拟订单提交
    setTimeout(() => {
      toast.success("订单提交成功！")
      clearCart()
      router.push("/")
      setLoading(false)
    }, 1500)
  }

  if (items.length === 0) {
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
                <div key={group.merchantId}>
                  <div className="font-medium mb-3">{group.merchantName}</div>
                  <div className="space-y-3">
                    {group.items.map(item => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          {item.image && (
                            <div className="h-12 w-12 rounded overflow-hidden mr-3">
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className="h-full w-full object-cover"
                              />
                            </div>
                          )}
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-muted-foreground">
                              ¥{item.price.toFixed(2)} × {item.quantity}
                            </div>
                          </div>
                        </div>
                        <div className="font-medium">
                          ¥{(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Separator className="my-4" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 配送信息 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">配送信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium">配送地址</div>
                  <div className="text-muted-foreground">{address}</div>
                  <Button variant="link" className="h-auto p-0 text-blue-600">
                    修改地址
                  </Button>
                </div>
              </div>
              
              <div className="flex items-start">
                <Clock className="h-5 w-5 mr-2 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium">配送时间</div>
                  <div className="text-muted-foreground">{deliveryTime}</div>
                  <div className="text-sm text-muted-foreground">
                    预计送达时间：30-45分钟
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 支付方式 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">支付方式</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-muted-foreground" />
                <div>
                  <div className="font-medium">{paymentMethod}</div>
                  <Button variant="link" className="h-auto p-0 text-blue-600">
                    更换支付方式
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 订单摘要 */}
        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="text-lg">订单摘要</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">商品小计</span>
                <span>¥{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">配送费</span>
                <span>¥3.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">服务费</span>
                <span>¥1.00</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>总计</span>
                <span>¥{(subtotal + 4).toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <div className="w-full space-y-3">
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleSubmitOrder}
                  disabled={loading}
                >
                  {loading ? "处理中..." : "提交订单"}
                </Button>
                <div className="text-xs text-center text-muted-foreground">
                  点击"提交订单"，表示您同意我们的
                  <Link href="#" className="text-blue-600 hover:underline">服务条款</Link>
                  和
                  <Link href="#" className="text-blue-600 hover:underline">隐私政策</Link>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
} 