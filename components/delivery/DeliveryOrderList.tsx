"use client"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Order {
  id: string
  restaurantName: string
  customerAddress: string
  status: "pending" | "delivering" | "completed"
  amount: number
  createdAt: string
}

interface DeliveryOrderListProps {
  orders: Order[]
  onAcceptOrder: (orderId: string) => void
  onCompleteOrder: (orderId: string) => void
}

export function DeliveryOrderList({
  orders,
  onAcceptOrder,
  onCompleteOrder,
}: DeliveryOrderListProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>订单号</TableHead>
            <TableHead>餐厅</TableHead>
            <TableHead>配送地址</TableHead>
            <TableHead>状态</TableHead>
            <TableHead>金额</TableHead>
            <TableHead>下单时间</TableHead>
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.restaurantName}</TableCell>
              <TableCell>{order.customerAddress}</TableCell>
              <TableCell>
                {order.status === "pending" && "待接单"}
                {order.status === "delivering" && "配送中"}
                {order.status === "completed" && "已完成"}
              </TableCell>
              <TableCell>¥{order.amount.toFixed(2)}</TableCell>
              <TableCell>{order.createdAt}</TableCell>
              <TableCell>
                {order.status === "pending" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAcceptOrder(order.id)}
                  >
                    接单
                  </Button>
                )}
                {order.status === "delivering" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onCompleteOrder(order.id)}
                  >
                    完成配送
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 