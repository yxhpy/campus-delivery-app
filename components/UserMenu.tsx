"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { User, LogIn, LogOut, UserPlus, ShoppingBag } from "lucide-react"
import { useUser } from "@/lib/user-context"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

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
      <Button variant="outline" size="icon" asChild>
        <Link href="/profile" aria-label="个人资料">
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
        </Link>
      </Button>
      
      <Button variant="outline" size="icon" asChild className="hidden md:flex">
        <Link href="/orders" aria-label="我的订单">
          <ShoppingBag className="h-5 w-5" />
        </Link>
      </Button>
      
      <Button 
        variant="outline" 
        size="icon" 
        onClick={handleLogout}
        aria-label="退出登录"
      >
        <LogOut className="h-5 w-5" />
      </Button>
    </div>
  )
} 