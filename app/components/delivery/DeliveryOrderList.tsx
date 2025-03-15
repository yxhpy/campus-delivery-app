"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Package, Timer } from "lucide-react"
import { cn } from "@/lib/utils"

export interface DeliveryOrder {
  id: string
  orderNumber: string
  status: "pending" | "accepted" | "picked_up" | "delivering" | "completed"
  pickupAddress: string
  deliveryAddress: string
  estimatedTime: string
  price: number
  items: {
    name: string
    quantity: number
  }[]
}

export interface DeliveryOrderListProps
  extends React.HTMLAttributes<HTMLDivElement> {
  orders: DeliveryOrder[]
  onAcceptOrder?: (orderId: string) => void
  onStartDelivery?: (orderId: string) => void
  onCompleteDelivery?: (orderId: string) => void
}

const statusMap = {
  pending: { label: "待接单", color: "bg-yellow-500" },
  accepted: { label: "已接单", color: "bg-blue-500" },
  picked_up: { label: "已取货", color: "bg-purple-500" },
  delivering: { label: "配送中", color: "bg-orange-500" },
  completed: { label: "已完成", color: "bg-green-500" },
}

const DeliveryOrderList = React.forwardRef<HTMLDivElement, DeliveryOrderListProps>(
  ({ orders = [], onAcceptOrder, onStartDelivery, onCompleteDelivery, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("grid gap-4 md:grid-cols-2 lg:grid-cols-3", className)} {...props}>
        {orders.map((order) => (
          <Card key={order.id} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                订单号: {order.orderNumber}
              </CardTitle>
              <Badge
                variant="secondary"
                className={cn("text-white", statusMap[order.status].color)}
              >
                {statusMap[order.status].label}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="h-4 w-4" />
                    <span className="font-medium">取货地址：</span>
                    <span className="text-muted-foreground">{order.pickupAddress}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="h-4 w-4" />
                    <span className="font-medium">送货地址：</span>
                    <span className="text-muted-foreground">{order.deliveryAddress}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <Package className="h-4 w-4" />
                    <span className="font-medium">商品：</span>
                    <span className="text-muted-foreground">
                      {order.items.map((item) => `${item.name}x${item.quantity}`).join(", ")}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Timer className="h-4 w-4" />
                    <span className="font-medium">预计送达时间：</span>
                    <span className="text-muted-foreground">{order.estimatedTime}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">¥{order.price.toFixed(2)}</span>
                  {order.status === "pending" && onAcceptOrder && (
                    <Button onClick={() => onAcceptOrder(order.id)}>
                      接单
                    </Button>
                  )}
                  {order.status === "accepted" && onStartDelivery && (
                    <Button onClick={() => onStartDelivery(order.id)}>
                      开始配送
                    </Button>
                  )}
                  {order.status === "delivering" && onCompleteDelivery && (
                    <Button onClick={() => onCompleteDelivery(order.id)}>
                      完成配送
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }
)

DeliveryOrderList.displayName = "DeliveryOrderList"

export { DeliveryOrderList } 