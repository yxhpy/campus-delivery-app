"use client"

import { ProductDetailPage } from "@/components/ProductDetailPage"
import { useEffect, useState } from "react"

// 模拟商品数据库
const productsDatabase = [
  {
    id: "prod-001",
    name: "经典套餐",
    price: 15,
    description: "包含米饭、两荤一素和一份汤，营养均衡，美味可口。这是学生食堂最受欢迎的套餐之一，每天限量供应，建议提前订购。",
    category: "套餐",
    merchantId: "merchant-001",
    merchantName: "学生食堂",
    ingredients: ["米饭", "红烧肉", "鱼香肉丝", "炒青菜", "紫菜蛋花汤"],
    nutritionInfo: {
      calories: 650,
      protein: "25g",
      carbs: "80g",
      fat: "20g"
    },
    allergens: ["大豆", "小麦"],
    preparationTime: "10分钟",
    isAvailable: true,
    isPopular: true,
    discount: null,
    rating: 4.7,
    reviewCount: 128,
    image: "https://images.pexels.com/photos/6646072/pexels-photo-6646072.jpeg?auto=compress&cs=tinysrgb&w=800",
    images: [
      "https://images.pexels.com/photos/6646072/pexels-photo-6646072.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/5836429/pexels-photo-5836429.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/5836358/pexels-photo-5836358.jpeg?auto=compress&cs=tinysrgb&w=800"
    ]
  },
  {
    id: "prod-002",
    name: "红烧肉",
    price: 8,
    description: "传统红烧肉，肥而不腻，口感鲜美。采用特制酱料慢炖而成，肉质酥烂，入口即化。是食堂的招牌菜品之一。",
    category: "荤菜",
    merchantId: "merchant-001",
    merchantName: "学生食堂",
    ingredients: ["五花肉", "酱油", "白糖", "料酒", "八角", "桂皮"],
    nutritionInfo: {
      calories: 350,
      protein: "15g",
      carbs: "10g",
      fat: "25g"
    },
    allergens: [],
    preparationTime: "5分钟",
    isAvailable: true,
    isPopular: true,
    discount: null,
    rating: 4.8,
    reviewCount: 95,
    image: "https://images.pexels.com/photos/2673353/pexels-photo-2673353.jpeg?auto=compress&cs=tinysrgb&w=800",
    images: [
      "https://images.pexels.com/photos/2673353/pexels-photo-2673353.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/6941010/pexels-photo-6941010.jpeg?auto=compress&cs=tinysrgb&w=800"
    ]
  },
  {
    id: "prod-003",
    name: "炒青菜",
    price: 5,
    description: "新鲜时蔬，清脆爽口，保留蔬菜的原汁原味。采用当季新鲜蔬菜，少油快炒，保留营养和口感。",
    category: "素菜",
    merchantId: "merchant-001",
    merchantName: "学生食堂",
    ingredients: ["青菜", "蒜", "盐", "食用油"],
    nutritionInfo: {
      calories: 120,
      protein: "5g",
      carbs: "15g",
      fat: "5g"
    },
    allergens: [],
    preparationTime: "3分钟",
    isAvailable: true,
    isPopular: false,
    discount: null,
    rating: 4.5,
    reviewCount: 62,
    image: "https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=800",
    images: [
      "https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=800"
    ]
  },
  {
    id: "prod-004",
    name: "紫菜蛋花汤",
    price: 3,
    description: "营养美味的紫菜蛋花汤，汤鲜味美，温暖舒适。选用优质紫菜和新鲜鸡蛋，熬制高汤，营养丰富。",
    category: "汤类",
    merchantId: "merchant-001",
    merchantName: "学生食堂",
    ingredients: ["紫菜", "鸡蛋", "葱花", "高汤"],
    nutritionInfo: {
      calories: 80,
      protein: "6g",
      carbs: "5g",
      fat: "3g"
    },
    allergens: ["鸡蛋"],
    preparationTime: "5分钟",
    isAvailable: true,
    isPopular: false,
    discount: null,
    rating: 4.3,
    reviewCount: 45,
    image: "https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg?auto=compress&cs=tinysrgb&w=800",
    images: [
      "https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg?auto=compress&cs=tinysrgb&w=800"
    ]
  },
  {
    id: "prod-005",
    name: "牛肉面",
    price: 12,
    description: "手工面条配以香浓牛肉汤底，牛肉鲜嫩，面条劲道。采用传统工艺制作的手工面，搭配炖煮8小时的牛肉汤底，口感丰富。",
    category: "面食",
    merchantId: "merchant-001",
    merchantName: "学生食堂",
    ingredients: ["手工面", "牛肉", "牛骨高汤", "葱姜蒜", "辣椒油"],
    nutritionInfo: {
      calories: 480,
      protein: "22g",
      carbs: "65g",
      fat: "12g"
    },
    allergens: ["小麦", "牛肉"],
    preparationTime: "8分钟",
    isAvailable: true,
    isPopular: true,
    discount: null,
    rating: 4.9,
    reviewCount: 156,
    image: "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=800",
    images: [
      "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/5409010/pexels-photo-5409010.jpeg?auto=compress&cs=tinysrgb&w=800"
    ]
  }
]

export default function ProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // 模拟API调用
    setTimeout(() => {
      const foundProduct = productsDatabase.find(p => p.id === params.id)
      if (foundProduct) {
        setProduct(foundProduct)
      } else {
        setError("商品未找到")
      }
      setLoading(false)
    }, 500)
  }, [params.id])

  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto py-8 px-4 flex justify-center">
        <div className="text-lg">加载中...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full max-w-5xl mx-auto py-8 px-4">
        <div className="text-lg text-red-500">{error}</div>
      </div>
    )
  }

  return <ProductDetailPage product={product} />
} 