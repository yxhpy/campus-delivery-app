"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

interface Notification {
  id: string
  type: "order" | "system" | "delivery"
  title: string
  message: string
  read: boolean
  createdAt: Date
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, "id" | "read" | "createdAt">) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearNotifications: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  
  // 计算未读通知数量
  const unreadCount = notifications.filter(notification => !notification.read).length

  // 添加新通知
  const addNotification = (notification: Omit<Notification, "id" | "read" | "createdAt">) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      read: false,
      createdAt: new Date()
    }
    
    // 添加到通知列表
    setNotifications(prev => [newNotification, ...prev])
    
    // 如果支持，发送浏览器通知
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(notification.title, { body: notification.message })
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission()
      }
    }
  }

  // 标记通知为已读
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
  }

  // 标记所有通知为已读
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  // 清除所有通知
  const clearNotifications = () => {
    setNotifications([])
  }

  // 监听WebSocket连接以接收实时通知
  useEffect(() => {
    // 模拟WebSocket连接
    const interval = setInterval(() => {
      // 这里将来会替换为真实的WebSocket连接
      console.log("检查新通知...")
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  return (
    <NotificationContext.Provider 
      value={{ 
        notifications, 
        unreadCount, 
        addNotification, 
        markAsRead, 
        markAllAsRead, 
        clearNotifications 
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider")
  }
  return context
} 