"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingBag, Search, MapPin, Menu } from "lucide-react"
import { useWishlist } from "@/lib/wishlist-context"
import { UserMenu } from "@/components/UserMenu"
import { CartSheet } from "@/components/CartSheet"
import { NotificationCenter } from "@/components/NotificationCenter"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"
import { useUser } from "@/lib/user-context"

export function Navbar() {
  const { items: wishlistItems } = useWishlist()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user } = useUser()
  
  const isDeliveryPath = pathname?.startsWith("/delivery")

  const renderDeliveryNav = () => {
    if (!user) {
      return (
        <>
          <Link href="/delivery/login">
            <Button variant="ghost">登录</Button>
          </Link>
          <Link href="/delivery/register">
            <Button>注册</Button>
          </Link>
        </>
      )
    }

    return (
      <>
        <Link href="/delivery/orders">
          <Button variant="ghost">订单管理</Button>
        </Link>
        <Link href="/delivery/profile">
          <Button variant="ghost">个人中心</Button>
        </Link>
      </>
    )
  }

  const renderUserNav = () => {
    if (!user) {
      return (
        <>
          <Link href="/login">
            <Button variant="ghost">登录</Button>
          </Link>
          <Link href="/register">
            <Button>注册</Button>
          </Link>
        </>
      )
    }

    return (
      <>
        <Link href="/restaurants">
          <Button variant="ghost">餐厅</Button>
        </Link>
        <Link href="/orders">
          <Button variant="ghost">订单</Button>
        </Link>
        <Link href="/profile">
          <Button variant="ghost">个人中心</Button>
        </Link>
      </>
    )
  }

  // 如果是配送员相关页面，显示配送员导航栏
  if (pathname.startsWith("/delivery")) {
    return (
      <header className="fixed top-0 z-50 w-full border-b bg-background">
        <div className="container flex h-14 items-center">
          <Link href="/delivery" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">校园外卖配送端</span>
          </Link>
          <nav className="flex flex-1 items-center space-x-6 text-sm">
            {renderDeliveryNav()}
          </nav>
          {user && (
            <div className="flex items-center space-x-2">
              <NotificationCenter />
            </div>
          )}
        </div>
      </header>
    )
  }

  // 默认显示用户端导航栏
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">校园外卖</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
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
        
        <div className="flex-1 px-4 hidden md:block">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="搜索商家、商品"
              className="w-full h-9 pl-10 pr-4 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <div className="flex items-center space-x-1">
            {user && <NotificationCenter />}
            <UserMenu />
            <CartSheet />
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80%] sm:max-w-sm">
                <SheetHeader>
                  <SheetTitle>菜单</SheetTitle>
                </SheetHeader>
                <div className="py-4">
                  <nav className="flex flex-col gap-2">
                    <Link href="/" className="py-2 px-4 hover:bg-muted rounded-md">首页</Link>
                    <Link href="/wishlist" className="py-2 px-4 hover:bg-muted rounded-md">收藏夹</Link>
                    <Link href="/orders" className="py-2 px-4 hover:bg-muted rounded-md">订单</Link>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
} 