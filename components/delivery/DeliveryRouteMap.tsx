"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getBestRoute, updateRouteStatus } from "@/lib/route-planning"
import { useNotification } from "@/lib/notification-context"
import { MapPin, Navigation, CheckCircle } from "lucide-react"

interface RoutePoint {
  location: {
    id: string
    name: string
    address: string
    latitude: number
    longitude: number
  }
  estimatedArrivalTime: Date
  estimatedDepartureTime: Date
  status: "pending" | "arrived" | "completed"
  orderIds: string[]
}

interface Route {
  id: string
  deliveryPersonId: string
  points: RoutePoint[]
  totalDistance: number
  estimatedDuration: number
  startTime: Date
  endTime: Date | null
  status: "planning" | "in_progress" | "completed" | "cancelled"
}

export function DeliveryRouteMap() {
  const [route, setRoute] = useState<Route | null>(null)
  const [loading, setLoading] = useState(false)
  const { addNotification } = useNotification()

  // 获取最佳路线
  const fetchBestRoute = async () => {
    setLoading(true)
    try {
      const bestRoute = await getBestRoute("delivery-person-1", [])
      setRoute(bestRoute)
      
      // 添加通知
      addNotification({
        type: "delivery",
        title: "路线已优化",
        message: `已为您规划最佳配送路线，共 ${bestRoute.points.length} 个配送点，总距离 ${(bestRoute.totalDistance / 1000).toFixed(2)} 公里。`
      })
    } catch (error) {
      console.error("获取最佳路线失败:", error)
    } finally {
      setLoading(false)
    }
  }

  // 更新路线点状态
  const handleUpdatePointStatus = async (pointIndex: number, status: "arrived" | "completed") => {
    if (!route) return

    try {
      // 更新本地状态
      const updatedPoints = [...route.points]
      updatedPoints[pointIndex] = {
        ...updatedPoints[pointIndex],
        status
      }

      setRoute({
        ...route,
        points: updatedPoints
      })

      // 调用API更新状态
      await updateRouteStatus(route.id, pointIndex, status)

      // 添加通知
      const point = route.points[pointIndex]
      addNotification({
        type: "delivery",
        title: status === "arrived" ? "已到达配送点" : "已完成配送",
        message: status === "arrived" 
          ? `您已到达 ${point.location.name}，请开始配送。` 
          : `您已完成 ${point.location.name} 的配送任务。`
      })
    } catch (error) {
      console.error("更新路线点状态失败:", error)
    }
  }

  // 开始配送
  const handleStartDelivery = () => {
    if (!route) return

    setRoute({
      ...route,
      status: "in_progress"
    })

    // 添加通知
    addNotification({
      type: "delivery",
      title: "开始配送",
      message: "您已开始配送任务，请按照规划路线进行配送。"
    })
  }

  // 完成配送
  const handleCompleteDelivery = () => {
    if (!route) return

    setRoute({
      ...route,
      status: "completed",
      endTime: new Date()
    })

    // 添加通知
    addNotification({
      type: "delivery",
      title: "配送完成",
      message: `您已完成所有配送任务，总配送时间 ${formatDuration(route.estimatedDuration)}。`
    })
  }

  // 格式化时间
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  // 格式化持续时间
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    
    if (hours > 0) {
      return `${hours}小时${minutes}分钟`
    }
    return `${minutes}分钟`
  }

  // 计算剩余配送点数量
  const getRemainingPoints = () => {
    if (!route) return 0
    return route.points.filter(point => point.status !== "completed").length
  }

  // 计算已完成配送点数量
  const getCompletedPoints = () => {
    if (!route) return 0
    return route.points.filter(point => point.status === "completed").length
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>配送路线</span>
          {!route && (
            <Button onClick={fetchBestRoute} disabled={loading}>
              {loading ? "规划中..." : "规划最佳路线"}
            </Button>
          )}
          {route && route.status === "planning" && (
            <Button onClick={handleStartDelivery}>
              开始配送
            </Button>
          )}
          {route && route.status === "in_progress" && (
            <Button onClick={handleCompleteDelivery}>
              完成所有配送
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {route ? (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-muted p-4 rounded-lg text-center">
                <div className="text-2xl font-bold">{route.points.length}</div>
                <div className="text-sm text-muted-foreground">总配送点</div>
              </div>
              <div className="bg-muted p-4 rounded-lg text-center">
                <div className="text-2xl font-bold">{(route.totalDistance / 1000).toFixed(2)} 公里</div>
                <div className="text-sm text-muted-foreground">总距离</div>
              </div>
              <div className="bg-muted p-4 rounded-lg text-center">
                <div className="text-2xl font-bold">{formatDuration(route.estimatedDuration)}</div>
                <div className="text-sm text-muted-foreground">预计时间</div>
              </div>
            </div>

            <div className="space-y-2 mt-4">
              {route.points.map((point, index) => (
                <div 
                  key={point.location.id}
                  className={`p-4 border rounded-lg ${
                    point.status === "completed" 
                      ? "bg-muted" 
                      : point.status === "arrived" 
                        ? "border-blue-500 bg-blue-50" 
                        : ""
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {point.location.name}
                      </div>
                      <div className="text-sm text-muted-foreground">{point.location.address}</div>
                      <div className="text-sm mt-1">
                        预计到达: {formatTime(point.estimatedArrivalTime)}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {route.status === "in_progress" && point.status === "pending" && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleUpdatePointStatus(index, "arrived")}
                        >
                          <Navigation className="h-4 w-4 mr-1" />
                          已到达
                        </Button>
                      )}
                      {route.status === "in_progress" && point.status === "arrived" && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleUpdatePointStatus(index, "completed")}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          已完成
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            点击"规划最佳路线"按钮开始规划配送路线
          </div>
        )}
      </CardContent>
    </Card>
  )
} 