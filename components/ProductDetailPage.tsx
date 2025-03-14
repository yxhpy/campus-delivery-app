"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Clock, ArrowLeft, ShoppingCart, Heart, Share2, Info, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useCart } from "@/lib/cart-context"
import { toast } from "sonner"

interface ProductDetail {
  id: string
  name: string
  price: number
  description: string
  category: string
  merchantId: string
  merchantName: string
  ingredients: string[]
  nutritionInfo: {
    calories: number
    protein: string
    carbs: string
    fat: string
  }
  allergens: string[]
  preparationTime: string
  isAvailable: boolean
  isPopular: boolean
  discount: number | null
  rating: number
  reviewCount: number
  image: string
  images: string[]
}

interface ProductDetailPageProps extends React.HTMLAttributes<HTMLDivElement> {
  product: ProductDetail
}

export const ProductDetailPage = React.forwardRef<HTMLDivElement, ProductDetailPageProps>(
  ({ product, className, ...props }, ref) => {
    const [quantity, setQuantity] = useState(1)
    const [selectedImage, setSelectedImage] = useState(product.image)
    const [isWished, setIsWished] = useState(false)
    const { addItem } = useCart()

    useEffect(() => {
      if (product.images && product.images.length > 0) {
        setSelectedImage(product.images[0])
      }
    }, [product.images])

    const increaseQuantity = () => {
      setQuantity(prev => prev + 1)
    }

    const decreaseQuantity = () => {
      if (quantity > 1) {
        setQuantity(prev => prev - 1)
      }
    }

    const toggleWishlist = () => {
      setIsWished(prev => !prev)
    }

    const handleAddToCart = () => {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: product.image,
        merchantId: product.merchantId,
        merchantName: product.merchantName
      })
      
      toast.success(`已添加 ${quantity} 份 ${product.name} 到购物车`)
    }

    return (
      <div ref={ref} className={cn("w-full max-w-5xl mx-auto py-8 px-4", className)} {...props}>
        <div className="mb-6">
          <Link href={`/merchant/${product.merchantId}`} className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800">
            <ArrowLeft className="mr-1 h-4 w-4" />
            返回 {product.merchantName}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 商品图片区域 */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg border">
              <Image 
                src={selectedImage} 
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              {product.isPopular && (
                <Badge className="absolute top-2 left-2 bg-red-500">热门</Badge>
              )}
              {product.discount && (
                <Badge className="absolute top-2 right-2 bg-green-500">
                  {product.discount}% 优惠
                </Badge>
              )}
            </div>
            
            {/* 缩略图列表 */}
            {product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    className={cn(
                      "relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border",
                      selectedImage === img && "ring-2 ring-blue-500"
                    )}
                    onClick={() => setSelectedImage(img)}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} - 图片 ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 商品信息区域 */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between">
                <h1 className="text-2xl font-bold text-foreground">{product.name}</h1>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className={cn(isWished && "text-red-500")}
                    onClick={toggleWishlist}
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="mt-2 flex items-center space-x-2">
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1 text-sm font-medium">{product.rating}</span>
                </div>
                <span className="text-sm text-muted-foreground">({product.reviewCount} 评价)</span>
                <Badge variant="outline">{product.category}</Badge>
              </div>
            </div>

            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold">¥{product.price.toFixed(2)}</span>
              {product.discount && (
                <span className="text-lg text-muted-foreground line-through">
                  ¥{(product.price * (1 + product.discount / 100)).toFixed(2)}
                </span>
              )}
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="font-medium">商品描述</h3>
              <p className="text-sm text-muted-foreground">{product.description}</p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">准备时间</h3>
              <div className="flex items-center text-sm">
                <Clock className="mr-1 h-4 w-4" />
                <span>{product.preparationTime}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">配料</h3>
              <div className="flex flex-wrap gap-1">
                {product.ingredients.map((ingredient, index) => (
                  <Badge key={index} variant="secondary">{ingredient}</Badge>
                ))}
              </div>
            </div>

            {product.allergens.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium">过敏原</h3>
                <div className="flex items-start rounded-md bg-yellow-50 p-2">
                  <AlertCircle className="mr-2 h-4 w-4 text-yellow-600" />
                  <div className="text-sm text-yellow-700">
                    <span>可能含有: </span>
                    {product.allergens.join(", ")}
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <h3 className="font-medium">营养信息</h3>
              <div className="grid grid-cols-4 gap-2 text-sm">
                <div className="rounded-md bg-gray-100 p-2 text-center">
                  <div className="font-medium">{product.nutritionInfo.calories}</div>
                  <div className="text-xs text-muted-foreground">卡路里</div>
                </div>
                <div className="rounded-md bg-gray-100 p-2 text-center">
                  <div className="font-medium">{product.nutritionInfo.protein}</div>
                  <div className="text-xs text-muted-foreground">蛋白质</div>
                </div>
                <div className="rounded-md bg-gray-100 p-2 text-center">
                  <div className="font-medium">{product.nutritionInfo.carbs}</div>
                  <div className="text-xs text-muted-foreground">碳水</div>
                </div>
                <div className="rounded-md bg-gray-100 p-2 text-center">
                  <div className="font-medium">{product.nutritionInfo.fat}</div>
                  <div className="text-xs text-muted-foreground">脂肪</div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex items-center space-x-4">
              <div className="flex items-center rounded-md border">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-r-none"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                >
                  <span className="text-lg">-</span>
                </Button>
                <span className="w-10 text-center">{quantity}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-l-none"
                  onClick={increaseQuantity}
                >
                  <span className="text-lg">+</span>
                </Button>
              </div>
              <Button className="flex-1" onClick={handleAddToCart}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                加入购物车
              </Button>
            </div>
          </div>
        </div>

        {/* 相关商品推荐 */}
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">你可能还喜欢</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* 这里可以添加相关商品推荐，暂时留空 */}
          </div>
        </div>
      </div>
    )
  }
) 