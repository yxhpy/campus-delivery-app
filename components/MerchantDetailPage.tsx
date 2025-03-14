"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Clock, Phone, Mail, ExternalLink, ShoppingCart } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"
import { toast } from "sonner"

interface MerchantDetail {
  id: string
  name: string
  rating: number
  reviewCount: number
  address: string
  openingHours: string
  phone: string
  email: string
  description: string
  categories: string[]
  products: {
    id: string
    name: string
    price: number
    description: string
    category: string
    image?: string
  }[]
}

interface MerchantDetailPageProps extends React.HTMLAttributes<HTMLDivElement> {
  merchant: MerchantDetail
}

const MerchantDetailPage = React.forwardRef<HTMLDivElement, MerchantDetailPageProps>(
  ({ merchant, className, ...props }, ref) => {
    const { addItem } = useCart()

    const handleAddToCart = (product: any) => {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
        merchantId: merchant.id,
        merchantName: merchant.name
      })
      
      toast.success(`已添加 ${product.name} 到购物车`)
    }

    return (
      <div ref={ref} className={cn("w-full max-w-5xl mx-auto py-8 px-4", className)} {...props}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-foreground">{merchant.name}</h1>
                      <div className="flex items-center mt-2 space-x-2">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                          <span className="ml-1 text-sm font-medium">{merchant.rating}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">({merchant.reviewCount} 评价)</span>
                        <div className="flex flex-wrap gap-2">
                          {merchant.categories.map((category) => (
                            <Badge key={category} variant="secondary" className="text-xs">
                              {category}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2">
                      <ExternalLink className="w-4 h-4" />
                      <span>访问网站</span>
                    </Button>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">地址</p>
                        <p className="text-sm text-muted-foreground">{merchant.address}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">营业时间</p>
                        <p className="text-sm text-muted-foreground">{merchant.openingHours}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">电话</p>
                        <p className="text-sm text-muted-foreground">{merchant.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">邮箱</p>
                        <p className="text-sm text-muted-foreground">{merchant.email}</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h2 className="text-lg font-semibold mb-2">关于商家</h2>
                    <p className="text-sm text-muted-foreground">{merchant.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">商品列表</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {merchant.products.map((product) => (
                    <div key={product.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      <Link href={`/product/${product.id}`} className="block">
                        <div className="aspect-video relative overflow-hidden bg-muted">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                              暂无图片
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium">{product.name}</h3>
                            <div className="font-medium text-primary">¥{product.price.toLocaleString()}</div>
                          </div>
                          <div className="mt-1">
                            <Badge variant="outline" className="text-xs">{product.category}</Badge>
                          </div>
                          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                          <div className="mt-3 flex space-x-2">
                            <Button size="sm" className="w-full">查看详情</Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-shrink-0"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleAddToCart(product)
                              }}
                            >
                              <ShoppingCart className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-6">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-lg font-semibold">联系信息</h2>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{merchant.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{merchant.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{merchant.address}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{merchant.openingHours}</span>
                  </div>
                </div>
                <Separator />
                <div className="pt-2">
                  <Button className="w-full">联系商家</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }
)

MerchantDetailPage.displayName = "MerchantDetailPage"

export { MerchantDetailPage } 