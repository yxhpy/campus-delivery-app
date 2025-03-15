"use client"

import { Bell } from "lucide-react"
import { useNotification } from "@/lib/notification-context"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { formatDistanceToNow } from "date-fns"
import { zhCN } from "date-fns/locale"

export function NotificationCenter() {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    clearNotifications 
  } = useNotification()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader className="flex flex-row items-center justify-between">
          <SheetTitle>通知中心</SheetTitle>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              全部标为已读
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearNotifications}
              disabled={notifications.length === 0}
            >
              清空
            </Button>
          </div>
        </SheetHeader>
        <div className="mt-6 space-y-4 max-h-[80vh] overflow-y-auto pr-2">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">暂无通知</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-4 rounded-lg border ${notification.read ? 'bg-background' : 'bg-muted'}`}
                onClick={() => !notification.read && markAsRead(notification.id)}
              >
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-medium">
                    {notification.title}
                    {!notification.read && (
                      <span className="ml-2 inline-block h-2 w-2 rounded-full bg-blue-500"></span>
                    )}
                  </h4>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(notification.createdAt, { 
                      addSuffix: true,
                      locale: zhCN
                    })}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{notification.message}</p>
                {notification.type === "order" && (
                  <div className="mt-2">
                    <Button variant="outline" size="sm" className="w-full">
                      查看订单
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
} 