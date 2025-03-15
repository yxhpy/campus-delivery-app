"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface User {
  id: string
  phone: string
  name: string
  role: "user" | "delivery" | "admin"
}

interface UserContextType {
  user: User | null
  setUser: (user: User | null) => void
  isLoading: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 检查本地存储中的用户信息
    const token = localStorage.getItem("delivery_token")
    if (token) {
      // TODO: 验证 token 并获取用户信息
      setUser({
        id: "1",
        phone: "13800138000",
        name: "测试配送员",
        role: "delivery"
      })
    }
    setIsLoading(false)
  }, [])

  return (
    <UserContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
} 