"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  role: 'user' | 'merchant' | 'admin'
  status?: 'active' | 'inactive' | 'banned'
}

interface UserContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
  updateUserRole: (userId: string, role: 'user' | 'merchant' | 'admin') => Promise<void>
  updateUserStatus: (userId: string, status: 'active' | 'inactive' | 'banned') => Promise<void>
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
            role: 'user',
            status: 'active'
          }
          
          setUser(userData)
          localStorage.setItem('user', JSON.stringify(userData))
          setLoading(false)
          resolve()
        } else if (email === 'admin@example.com' && password === 'admin123') {
          const userData: User = {
            id: 'admin-001',
            username: '管理员',
            email: 'admin@example.com',
            avatar: 'https://i.pravatar.cc/150?img=5',
            role: 'admin',
            status: 'active'
          }
          
          setUser(userData)
          localStorage.setItem('user', JSON.stringify(userData))
          setLoading(false)
          resolve()
        } else if (email === 'merchant@example.com' && password === 'merchant123') {
          const userData: User = {
            id: 'merchant-001',
            username: '商家用户',
            email: 'merchant@example.com',
            avatar: 'https://i.pravatar.cc/150?img=4',
            role: 'merchant',
            status: 'active'
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
            role: 'user',
            status: 'active'
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

  // 更新用户角色
  const updateUserRole = async (userId: string, role: 'user' | 'merchant' | 'admin') => {
    setLoading(true)
    
    // 模拟API调用
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (user && user.id === userId) {
          const updatedUser = { ...user, role }
          setUser(updatedUser)
          localStorage.setItem('user', JSON.stringify(updatedUser))
          setLoading(false)
          resolve()
        } else {
          setLoading(false)
          resolve() // 不是当前用户，也视为成功
        }
      }, 1000)
    })
  }

  // 更新用户状态
  const updateUserStatus = async (userId: string, status: 'active' | 'inactive' | 'banned') => {
    setLoading(true)
    
    // 模拟API调用
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (user && user.id === userId) {
          const updatedUser = { ...user, status }
          setUser(updatedUser)
          localStorage.setItem('user', JSON.stringify(updatedUser))
          setLoading(false)
          resolve()
        } else {
          setLoading(false)
          resolve() // 不是当前用户，也视为成功
        }
      }, 1000)
    })
  }

  return (
    <UserContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      updateUserRole,
      updateUserStatus,
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