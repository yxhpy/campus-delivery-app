"use client"

import { createContext, useContext, useEffect, useState } from "react"

interface WishlistItem {
  id: string
  name: string
  price: number
  image: string
  merchantId: string
  merchantName: string
}

interface WishlistContextType {
  items: WishlistItem[]
  addItem: (item: WishlistItem) => void
  removeItem: (itemId: string) => void
  isInWishlist: (itemId: string) => boolean
  clearWishlist: () => void
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([])

  // 从本地存储加载收藏夹数据
  useEffect(() => {
    const savedItems = localStorage.getItem("wishlist")
    if (savedItems) {
      setItems(JSON.parse(savedItems))
    }
  }, [])

  // 保存收藏夹数据到本地存储
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(items))
  }, [items])

  const addItem = (item: WishlistItem) => {
    setItems(prev => {
      if (!prev.some(i => i.id === item.id)) {
        return [...prev, item]
      }
      return prev
    })
  }

  const removeItem = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId))
  }

  const isInWishlist = (itemId: string) => {
    return items.some(item => item.id === itemId)
  }

  const clearWishlist = () => {
    setItems([])
  }

  return (
    <WishlistContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        isInWishlist,
        clearWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
} 