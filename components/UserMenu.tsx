"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { User, LogIn, LogOut, UserPlus, ShoppingBag, ShieldCheck, Store } from "lucide-react"
import { useUser } from "@/lib/user-context"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function UserMenu() {
  const { user, logout, isAuthenticated } = useUser()
  const router = useRouter()
  
  const handleLogout = () => {
    logout()
    toast.success("已成功退出登录")
  }
  
  if (!isAuthenticated) {
    return (
      <div className="flex items-center space-x-1">
        <Button variant="outline" size="icon" asChild>
          <Link href="/auth/login" aria-label="登录">
            <LogIn className="h-5 w-5" />
          </Link>
        </Button>
        <Button variant="outline" size="icon" asChild className="hidden md:flex">
          <Link href="/auth/register" aria-label="注册">
            <UserPlus className="h-5 w-5" />
          </Link>
        </Button>
      </div>
    )
  }
  
  return (
    <div className="flex items-center space-x-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            {user?.avatar ? (
              <div className="h-full w-full rounded-full overflow-hidden">
                <img 
                  src={user.avatar} 
                  alt={user.username} 
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <User className="h-5 w-5" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            <div className="flex flex-col">
              <span>{user?.username}</span>
              <span className="text-xs text-muted-foreground">{user?.email}</span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => router.push("/profile")}>
            <User className="mr-2 h-4 w-4" />
            个人资料
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => router.push("/orders")}>
            <ShoppingBag className="mr-2 h-4 w-4" />
            我的订单
          </DropdownMenuItem>
          
          {user?.role === "admin" && (
            <DropdownMenuItem onClick={() => router.push("/admin")}>
              <ShieldCheck className="mr-2 h-4 w-4" />
              管理后台
            </DropdownMenuItem>
          )}
          
          {user?.role === "merchant" && (
            <DropdownMenuItem onClick={() => router.push("/merchant-dashboard")}>
              <Store className="mr-2 h-4 w-4" />
              商家后台
            </DropdownMenuItem>
          )}
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            退出登录
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
} 