"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { createPaymentOrder, queryPaymentStatus } from "@/lib/payment-service"
import { toast } from "sonner"
import { QRCodeSVG } from "qrcode.react"

export default function PaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const amount = searchParams.get("amount")
  const method = searchParams.get("method")
  const [qrCode, setQrCode] = useState<string>("")
  const [paymentId, setPaymentId] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [isPaid, setIsPaid] = useState(false)

  useEffect(() => {
    if (!amount || !method) {
      toast.error("支付参数错误")
      router.push("/")
      return
    }

    // 创建支付订单
    createPaymentOrder({
      amount: parseFloat(amount),
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

    const interval = setInterval(async () => {
      try {
        const result = await queryPaymentStatus(paymentId)
        if (result.status === "success") {
          setIsPaid(true)
          toast.success("支付成功")
          // 延迟跳转到订单页面
          setTimeout(() => {
            router.push("/orders")
          }, 1500)
        }
      } catch (error) {
        console.error("查询支付状态失败:", error)
      }
    }, 3000) // 每3秒查询一次

    return () => clearInterval(interval)
  }, [paymentId, isPaid, router])

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
            ¥{parseFloat(amount).toFixed(2)}
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