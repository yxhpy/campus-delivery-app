"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Address } from "@/lib/address-service"
import { toast } from "sonner"

interface AddressFormProps {
  address?: Address
  onSubmit: (address: Omit<Address, 'id'>) => void
  onCancel: () => void
  isSubmitting: boolean
}

export default function AddressForm({
  address,
  onSubmit,
  onCancel,
  isSubmitting
}: AddressFormProps) {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [province, setProvince] = useState("")
  const [city, setCity] = useState("")
  const [district, setDistrict] = useState("")
  const [detail, setDetail] = useState("")
  const [isDefault, setIsDefault] = useState(false)

  // 如果是编辑模式，填充表单
  useEffect(() => {
    if (address) {
      setName(address.name)
      setPhone(address.phone)
      setProvince(address.province)
      setCity(address.city)
      setDistrict(address.district)
      setDetail(address.detail)
      setIsDefault(address.isDefault)
    }
  }, [address])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // 表单验证
    if (!name.trim()) {
      toast.error("请输入收货人姓名")
      return
    }

    if (!phone.trim()) {
      toast.error("请输入联系电话")
      return
    }

    if (!province.trim() || !city.trim() || !district.trim()) {
      toast.error("请输入完整的地址信息")
      return
    }

    if (!detail.trim()) {
      toast.error("请输入详细地址")
      return
    }

    // 提交表单
    onSubmit({
      name,
      phone,
      province,
      city,
      district,
      detail,
      isDefault
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">收货人姓名</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isSubmitting}
            placeholder="请输入收货人姓名"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">联系电话</Label>
          <Input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={isSubmitting}
            placeholder="请输入联系电话"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="province">省份</Label>
          <Input
            id="province"
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            disabled={isSubmitting}
            placeholder="省份"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">城市</Label>
          <Input
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            disabled={isSubmitting}
            placeholder="城市"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="district">区/县</Label>
          <Input
            id="district"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            disabled={isSubmitting}
            placeholder="区/县"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="detail">详细地址</Label>
        <Input
          id="detail"
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          disabled={isSubmitting}
          placeholder="详细地址，如街道、门牌号、楼层等"
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isDefault"
          checked={isDefault}
          onCheckedChange={(checked: boolean) => setIsDefault(checked)}
          disabled={isSubmitting}
        />
        <Label htmlFor="isDefault" className="text-sm font-normal">
          设为默认地址
        </Label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          取消
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "保存中..." : "保存地址"}
        </Button>
      </div>
    </form>
  )
} 