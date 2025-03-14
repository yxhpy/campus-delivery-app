"use client"

import { MerchantDetailPage } from "@/components/MerchantDetailPage"

// 模拟商家数据
const merchantData = {
  id: "merchant-001",
  name: "学生食堂",
  rating: 4.8,
  reviewCount: 243,
  address: "校园大道1号",
  openingHours: "周一至周五: 7:00-20:00, 周六至周日: 8:00-19:00",
  phone: "123-4567-8910",
  email: "contact@campus-food.com",
  description: "学生食堂提供各种美味可口的中式餐点，包括早餐、午餐和晚餐。我们使用新鲜的食材，提供营养均衡的饮食选择，满足学生的各种需求。",
  categories: ["快餐", "米饭", "面食"],
  products: [
    {
      id: "prod-001",
      name: "经典套餐",
      price: 15,
      description: "包含米饭、两荤一素和一份汤",
      category: "套餐",
      image: "https://images.pexels.com/photos/6646072/pexels-photo-6646072.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      id: "prod-002",
      name: "红烧肉",
      price: 8,
      description: "传统红烧肉，肥而不腻",
      category: "荤菜",
      image: "https://images.pexels.com/photos/2673353/pexels-photo-2673353.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      id: "prod-003",
      name: "炒青菜",
      price: 5,
      description: "新鲜时蔬，清脆爽口",
      category: "素菜",
      image: "https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      id: "prod-004",
      name: "紫菜蛋花汤",
      price: 3,
      description: "营养美味的紫菜蛋花汤",
      category: "汤类",
      image: "https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      id: "prod-005",
      name: "牛肉面",
      price: 12,
      description: "手工面条配以香浓牛肉汤底",
      category: "面食",
      image: "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=800"
    }
  ]
}

export default function MerchantPage({ params }: { params: { id: string } }) {
  // 在实际应用中，这里应该根据params.id从API获取商家数据
  // 这里为了演示，直接使用模拟数据
  return <MerchantDetailPage merchant={merchantData} />
} 