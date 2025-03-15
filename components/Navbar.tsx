"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingBag } from "lucide-react"
import { useWishlist } from "@/lib/wishlist-context"
import { UserMenu } from "@/components/UserMenu"
import { CartSheet } from "@/components/CartSheet"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

export function Navbar() {
  const { items: wishlistItems } = useWishlist()
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">校园外卖</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === "/" ? "text-foreground" : "text-foreground/60"
              )}
            >
              首页
            </Link>
            <Link
              href="/wishlist"
              className={cn(
                "transition-colors hover:text-foreground/80 flex items-center",
                pathname === "/wishlist" ? "text-foreground" : "text-foreground/60"
              )}
            >
              <Heart className="mr-1 h-4 w-4" />
              收藏夹
              {wishlistItems.length > 0 && (
                <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                  {wishlistItems.length}
                </span>
              )}
            </Link>
            <Link
              href="/orders"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === "/orders" ? "text-foreground" : "text-foreground/60"
              )}
            >
              <span className="flex items-center">
                <ShoppingBag className="mr-1 h-4 w-4" />
                订单
              </span>
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <div className="flex items-center space-x-1">
            <UserMenu />
            <CartSheet />
          </div>
        </div>
      </div>
    </header>
  )
} 