"use client"

import { useWishlist } from "@/lib/wishlist-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"
import { toast } from "sonner"

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlist()
  const { addItem: addToCart } = useCart()

  const handleAddToCart = (item: any) => {
    addToCart({
      ...item,
      quantity: 1
    })
    toast.success(`已添加 ${item.name} 到购物车`)
  }

  if (items.length === 0) {
    return (
      <div className="w-full max-w-5xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">我的收藏</h1>
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">您的收藏夹还是空的</p>
          <Link href="/" className="mt-4 inline-block">
            <Button>去逛逛</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">我的收藏</h1>
        <Button variant="outline" onClick={clearWishlist}>
          清空收藏夹
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(item => (
          <Card key={item.id} className="overflow-hidden">
            <div className="relative aspect-video">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <Link 
                  href={`/product/${item.id}`}
                  className="text-lg font-medium hover:text-blue-600"
                >
                  {item.name}
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold">¥{item.price.toFixed(2)}</div>
                  <Link 
                    href={`/merchant/${item.merchantId}`}
                    className="text-sm text-muted-foreground hover:text-blue-600"
                  >
                    {item.merchantName}
                  </Link>
                </div>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => handleAddToCart(item)}
                >
                  <ShoppingCart className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 