"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  role: 'user' | 'merchant' | 'admin'
}

interface UserContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // 从localStorage加载用户数据
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('user')
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser))
        } catch (e) {
          console.error('Failed to parse user data', e)
        }
      }
      setLoading(false)
    }
  }, [])

  // 模拟登录功能
  const login = async (email: string, password: string) => {
    setLoading(true)
    
    // 模拟API调用
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // 简单验证
        if (email === 'test@example.com' && password === 'password') {
          const userData: User = {
            id: 'user-001',
            username: '测试用户',
            email: 'test@example.com',
            avatar: 'https://i.pravatar.cc/150?img=3',
            role: 'user'
          }
          
          setUser(userData)
          localStorage.setItem('user', JSON.stringify(userData))
          setLoading(false)
          resolve()
        } else {
          setLoading(false)
          reject(new Error('邮箱或密码不正确'))
        }
      }, 1000)
    })
  }

  // 模拟注册功能
  const register = async (username: string, email: string, password: string) => {
    setLoading(true)
    
    // 模拟API调用
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // 简单验证
        if (email && password && username) {
          const userData: User = {
            id: `user-${Date.now()}`,
            username,
            email,
            role: 'user'
          }
          
          setUser(userData)
          localStorage.setItem('user', JSON.stringify(userData))
          setLoading(false)
          resolve()
        } else {
          setLoading(false)
          reject(new Error('请填写所有必填字段'))
        }
      }, 1000)
    })
  }

  // 登出功能
  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  return (
    <UserContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
} 