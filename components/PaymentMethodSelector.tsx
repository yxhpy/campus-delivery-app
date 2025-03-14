"use client"

import { useState, useEffect } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { PaymentMethod, getAvailablePaymentMethods, getPaymentPreference, savePaymentPreference } from "@/lib/payment-service"
import { CreditCard } from "lucide-react"

interface PaymentMethodSelectorProps {
  onSelect: (method: PaymentMethod) => void
  selectedMethod?: PaymentMethod
}

export function PaymentMethodSelector({ onSelect, selectedMethod }: PaymentMethodSelectorProps) {
  const [paymentMethods, setPaymentMethods] = useState(getAvailablePaymentMethods())
  const [selected, setSelected] = useState<PaymentMethod | undefined>(selectedMethod)

  // 初始化时，如果没有传入选中的支付方式，则尝试从本地存储获取
  useEffect(() => {
    if (!selected) {
      const preferred = getPaymentPreference()
      if (preferred) {
        setSelected(preferred)
        onSelect(preferred)
      } else if (paymentMethods.length > 0) {
        // 默认选择第一个支付方式
        setSelected(paymentMethods[0].id)
        onSelect(paymentMethods[0].id)
      }
    }
  }, [selected, onSelect, paymentMethods])

  const handleChange = (value: string) => {
    const method = value as PaymentMethod
    setSelected(method)
    onSelect(method)
    savePaymentPreference(method)
  }

  return (
    <RadioGroup value={selected} onValueChange={handleChange} className="space-y-3">
      {paymentMethods.map((method) => (
        <div key={method.id} className="flex items-center space-x-3 border rounded-md p-3 hover:bg-accent">
          <RadioGroupItem value={method.id} id={`payment-${method.id}`} />
          <Label htmlFor={`payment-${method.id}`} className="flex items-center flex-1 cursor-pointer">
            <div className="w-8 h-8 mr-3 flex items-center justify-center">
              {/* 如果有图标就显示图标，否则显示默认图标 */}
              {method.icon ? (
                <img src={method.icon} alt={method.name} className="w-6 h-6" />
              ) : (
                <CreditCard className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
            <span>{method.name}</span>
          </Label>
        </div>
      ))}
    </RadioGroup>
  )
} 