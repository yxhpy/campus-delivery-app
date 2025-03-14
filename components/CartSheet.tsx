"use client"

import * as React from "react"
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Trash2, Plus, Minus, X } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  merchantId: string
  merchantName: string
}

interface CartSheetProps {
  children?: React.ReactNode
}

export const CartSheet: React.FC<CartSheetProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { items, removeItem, updateQuantity, clearCart, totalItems, subtotal } = useCart()

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
  }, {} as Record<string, { merchantId: string, merchantName: string, items: CartItem[] }>)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {children || (
          <Button variant="outline" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center">
            <ShoppingCart className="mr-2 h-5 w-5" />
            购物车
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({totalItems} 件商品)
            </span>
          </SheetTitle>
        </SheetHeader>
        
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
            <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">购物车是空的</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              您的购物车中还没有商品，浏览商家并添加一些商品吧！
            </p>
            <SheetClose asChild>
              <Button asChild>
                <Link href="/">
                  浏览商家
                </Link>
              </Button>
            </SheetClose>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto py-4">
              {Object.values(itemsByMerchant).map(group => (
                <div key={group.merchantId} className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{group.merchantName}</h3>
                    <Link 
                      href={`/merchant/${group.merchantId}`} 
                      className="text-sm text-blue-600 hover:text-blue-800"
                      onClick={() => setIsOpen(false)}
                    >
                      查看商家
                    </Link>
                  </div>
                  
                  <div className="space-y-3">
                    {group.items.map(item => (
                      <div key={item.id} className="flex items-start space-x-3 bg-accent/50 p-3 rounded-md">
                        {item.image && (
                          <div className="h-16 w-16 rounded overflow-hidden flex-shrink-0">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between">
                            <h4 className="font-medium truncate">{item.name}</h4>
                            <button 
                              onClick={() => removeItem(item.id)}
                              className="text-muted-foreground hover:text-destructive"
                              aria-label="移除商品"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                          
                          <div className="text-sm text-muted-foreground mt-1">
                            ¥{item.price.toFixed(2)}
                          </div>
                          
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center border rounded-md">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-1 hover:bg-accent"
                                disabled={item.quantity <= 1}
                                aria-label="减少数量"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="px-2 text-sm">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1 hover:bg-accent"
                                aria-label="增加数量"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            
                            <div className="font-medium">
                              ¥{(item.price * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div>
              <Separator className="my-4" />
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">小计</span>
                  <span className="font-medium">¥{subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">配送费</span>
                  <span className="font-medium">¥0.00</span>
                </div>
                
                <Separator className="my-2" />
                
                <div className="flex justify-between text-lg font-medium">
                  <span>总计</span>
                  <span>¥{subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex space-x-2 mt-4">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={clearCart}
                    aria-label="清空购物车"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  
                  <SheetClose asChild>
                    <Button className="flex-1" asChild>
                      <Link href="/checkout">
                        去结算
                      </Link>
                    </Button>
                  </SheetClose>
                </div>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
} 