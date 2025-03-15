"use client"

import { CartProvider } from "@/lib/cart-context"
import { UserProvider } from "@/lib/user-context"
import { WishlistProvider } from "@/lib/wishlist-context"
import { NotificationProvider } from "@/lib/notification-context"
import { Toaster } from "sonner"
import { Navbar } from "@/components/Navbar"

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <CartProvider>
        <WishlistProvider>
          <NotificationProvider>
            <div className="relative flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1 pt-14">
                {children}
              </main>
            </div>
            <Toaster position="top-center" richColors closeButton />
          </NotificationProvider>
        </WishlistProvider>
      </CartProvider>
    </UserProvider>
  )
} 