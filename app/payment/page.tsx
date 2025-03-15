"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { createPaymentOrder, queryPaymentStatus } from "@/lib/payment-service"
import { toast } from "sonner"
import { QRCodeSVG } from "qrcode.react"
import { useCart } from "@/lib/cart-context"
import { createOrder } from "@/lib/order-service"

export default function PaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const amountParam = searchParams.get("amount")
  const methodParam = searchParams.get("method")
  const [qrCode, setQrCode] = useState<string>("")
  const [paymentId, setPaymentId] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [isPaid, setIsPaid] = useState(false)
  const [amount, setAmount] = useState<number | null>(null)
  const [method, setMethod] = useState<string | null>(null)
  const { clearCart, items, subtotal } = useCart()
  const [orderId, setOrderId] = useState<string | null>(null)
  
  // 验证并设置参数
  useEffect(() => {
    if (!amountParam || !methodParam) {
      toast.error("支付参数错误")
      router.push("/")
      return
    }

    const parsedAmount = parseFloat(amountParam)
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error("金额参数无效")
      router.push("/")
      return
    }

    setAmount(parsedAmount)
    setMethod(methodParam)
  }, [amountParam, methodParam, router])

  // 创建支付订单
  useEffect(() => {
    if (!amount || !method) return;

    // 创建支付订单
    createPaymentOrder({
      amount,
      method,
      orderId: `order_${Date.now()}`,
      description: "校园外卖订单"
    }).then(response => {
      setQrCode(response.qrCode)
      setPaymentId(response.paymentId)
      setIsLoading(false)
    }).catch(error => {
      toast.error("创建支付订单失败")
      router.push("/")
    })
  }, [amount, method, router])

  // 轮询支付状态
  useEffect(() => {
    if (!paymentId || isPaid) return

    console.log('开始轮询支付状态，paymentId:', paymentId);
    
    const interval = setInterval(async () => {
      try {
        console.log('查询支付状态...');
        const result = await queryPaymentStatus(paymentId)
        console.log('支付状态查询结果:', result);
        
        if (result.status === "success") {
          console.log('支付成功，准备创建订单');
          setIsPaid(true)
          
          // 创建订单
          if (items.length > 0 && amount && method) {
            try {
              console.log("创建订单，商品数量:", items.length, "金额:", amount, "支付方式:", method);
              const newOrder = createOrder({
                items,
                totalAmount: amount,
                deliveryFee: 3, // 固定配送费
                serviceFee: 1, // 固定服务费
                paymentMethod: method === "wechat" ? "微信支付" : "支付宝",
                deliveryAddress: "校园公寓 3号楼 512室", // 固定地址，实际应用中应该从用户配置获取
                notes: ""
              });
              console.log("订单创建成功:", newOrder.id, "订单详情:", JSON.stringify(newOrder));
              setOrderId(newOrder.id);
              toast.success("支付成功，订单已创建");
              
              // 验证订单是否已保存到本地存储
              const savedOrders = localStorage.getItem('campus_delivery_orders');
              console.log('本地存储中的订单数据:', savedOrders ? '有数据' : '无数据');
            } catch (orderError) {
              console.error("创建订单失败:", orderError);
              toast.error("订单创建失败，请联系客服");
            }
          } else {
            console.warn("无法创建订单: 购物车为空或金额/支付方式未设置", 
              "购物车商品:", items.length, 
              "金额:", amount, 
              "支付方式:", method
            );
            toast.success("支付成功");
          }
          
          // 确保清空购物车
          clearCart()
          console.log('购物车已清空');
          
          // 延迟跳转到订单页面
          console.log('准备跳转到订单页面...');
          setTimeout(() => {
            console.log('执行跳转到订单页面');
            router.push("/orders")
          }, 3000) // 延长到3秒，确保订单创建完成
        }
      } catch (error) {
        console.error("查询支付状态失败:", error)
      }
    }, 3000) // 每3秒查询一次

    return () => {
      console.log('清除支付状态轮询');
      clearInterval(interval)
    }
  }, [paymentId, isPaid, router, clearCart, items, amount, method])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">正在创建支付订单...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">请扫码支付</h1>
          <p className="text-3xl font-bold text-primary mb-6">
            ¥{amount?.toFixed(2) || "0.00"}
          </p>
          
          <div className="bg-white p-4 rounded-lg inline-block mb-6">
            <QRCodeSVG
              value={qrCode}
              size={200}
              level="H"
              includeMargin
              className={isPaid ? "opacity-50" : ""}
            />
          </div>

          {isPaid ? (
            <div className="text-green-500 font-medium">
              支付成功！正在跳转...
            </div>
          ) : (
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>请使用{method === "wechat" ? "微信" : "支付宝"}扫描二维码完成支付</p>
              <p>支付完成后页面会自动跳转</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
} 