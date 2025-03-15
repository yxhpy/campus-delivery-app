// 订单服务模块
// 提供订单相关的功能

import { CartItem } from "@/components/CartSheet";

// 订单状态类型
export type OrderStatus = "pending" | "processing" | "delivered" | "cancelled";

// 订单项类型
export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

// 订单类型
export interface Order {
  id: string;
  merchantName: string;
  merchantId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  deliveryAddress: string;
  estimatedDeliveryTime?: string;
  paymentMethod: string;
  deliveryFee: number;
  serviceFee: number;
  contactPhone?: string;
  deliveryNotes?: string;
}

// 本地存储键
const ORDERS_STORAGE_KEY = 'campus_delivery_orders';

// 获取所有订单
export function getOrders(): Order[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const ordersJson = localStorage.getItem(ORDERS_STORAGE_KEY);
    console.log('从本地存储读取订单数据:', ordersJson ? '有数据' : '无数据');
    if (!ordersJson) return [];
    const orders = JSON.parse(ordersJson);
    console.log('解析后的订单数量:', orders.length);
    return orders;
  } catch (error) {
    console.error('获取订单失败:', error);
    return [];
  }
}

// 获取单个订单
export function getOrderById(orderId: string): Order | null {
  const orders = getOrders();
  return orders.find(order => order.id === orderId) || null;
}

// 创建新订单
export function createOrder(params: {
  items: CartItem[];
  totalAmount: number;
  deliveryFee: number;
  serviceFee: number;
  paymentMethod: string;
  deliveryAddress: string;
  notes?: string;
}): Order {
  console.log('创建订单参数:', JSON.stringify(params));
  const { items, totalAmount, deliveryFee, serviceFee, paymentMethod, deliveryAddress, notes } = params;
  
  if (!items || items.length === 0) {
    console.error('创建订单失败: 购物车为空');
    throw new Error('购物车为空，无法创建订单');
  }
  
  // 按商家分组
  const merchantGroups = items.reduce((groups, item) => {
    if (!groups[item.merchantId]) {
      groups[item.merchantId] = {
        merchantId: item.merchantId,
        merchantName: item.merchantName,
        items: []
      };
    }
    groups[item.merchantId].items.push(item);
    return groups;
  }, {} as Record<string, { merchantId: string; merchantName: string; items: CartItem[] }>);
  
  // 使用第一个商家的信息（简化处理，实际应用可能需要创建多个订单）
  const merchantValues = Object.values(merchantGroups);
  const firstMerchant = merchantValues.length > 0 ? merchantValues[0] : { 
    merchantId: "unknown", 
    merchantName: "未知商家",
    items: []
  };
  
  const orderId = `order-${Date.now()}`;
  console.log('生成订单ID:', orderId);
  
  const newOrder: Order = {
    id: orderId,
    merchantName: firstMerchant.merchantName,
    merchantId: firstMerchant.merchantId,
    items: items.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image
    })),
    totalAmount,
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deliveryAddress,
    estimatedDeliveryTime: "30-45分钟",
    paymentMethod,
    deliveryFee,
    serviceFee,
    deliveryNotes: notes
  };
  
  console.log('创建的新订单对象:', JSON.stringify(newOrder));
  
  // 保存到本地存储
  try {
    const orders = getOrders();
    console.log('当前订单数量:', orders.length);
    const updatedOrders = [newOrder, ...orders];
    
    if (typeof window !== 'undefined') {
      console.log('准备保存订单到本地存储...');
      const ordersJson = JSON.stringify(updatedOrders);
      console.log('序列化后的订单数据长度:', ordersJson.length);
      
      // 确保localStorage可用
      try {
        localStorage.setItem('test_key', 'test_value');
        const testValue = localStorage.getItem('test_key');
        if (testValue !== 'test_value') {
          console.error('localStorage测试失败');
          throw new Error('localStorage不可用');
        }
        localStorage.removeItem('test_key');
        console.log('localStorage测试成功');
      } catch (storageError) {
        console.error('localStorage测试出错:', storageError);
        throw new Error('localStorage不可用');
      }
      
      // 保存订单数据
      localStorage.setItem(ORDERS_STORAGE_KEY, ordersJson);
      console.log('订单已保存到本地存储, 新订单总数:', updatedOrders.length);
      
      // 验证保存是否成功
      const savedJson = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (savedJson) {
        const savedOrders = JSON.parse(savedJson);
        console.log('验证保存结果: 成功保存', savedOrders.length, '个订单');
        
        // 验证新订单是否在保存的数据中
        const savedOrder = savedOrders.find((order: Order) => order.id === orderId);
        if (savedOrder) {
          console.log('新订单已成功保存到本地存储');
        } else {
          console.error('新订单未能保存到本地存储');
          throw new Error('新订单保存验证失败');
        }
      } else {
        console.error('验证保存结果: 保存失败');
        throw new Error('订单保存失败');
      }
    }
  } catch (error) {
    console.error('保存订单失败:', error);
    throw error;
  }
  
  return newOrder;
}

// 更新订单状态
export function updateOrderStatus(orderId: string, status: OrderStatus): Order | null {
  const orders = getOrders();
  const orderIndex = orders.findIndex(order => order.id === orderId);
  
  if (orderIndex === -1) return null;
  
  const updatedOrder = {
    ...orders[orderIndex],
    status,
    updatedAt: new Date().toISOString()
  };
  
  orders[orderIndex] = updatedOrder;
  
  if (typeof window !== 'undefined') {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  }
  
  return updatedOrder;
} 