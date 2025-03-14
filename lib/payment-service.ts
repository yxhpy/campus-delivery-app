// 支付服务模块
// 提供支付方法接口和模拟支付功能

export interface PaymentMethod {
  id: string
  name: string
  icon: string
  description?: string
}

export interface PaymentRequest {
  orderId: string;
  amount: number;
  method: string;
  description?: string;
  metadata?: Record<string, any>;
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  message?: string;
  timestamp: string;
  paymentMethod: string;
}

// 模拟支付处理
export async function processPayment(request: PaymentRequest): Promise<PaymentResponse> {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // 模拟支付成功率 95%
  const isSuccess = Math.random() < 0.95;
  
  if (isSuccess) {
    return {
      success: true,
      transactionId: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      message: '支付成功',
      timestamp: new Date().toISOString(),
      paymentMethod: request.method
    };
  } else {
    // 模拟支付失败
    const errorMessages = {
      'wechat': '微信支付失败，请稍后重试',
      'alipay': '支付宝支付失败，请检查账户余额',
      'campus_card': '校园卡余额不足',
      'credit_card': '信用卡支付被拒绝，请联系发卡行'
    };
    
    return {
      success: false,
      message: errorMessages[request.method] || '支付失败，请稍后重试',
      timestamp: new Date().toISOString(),
      paymentMethod: request.method
    };
  }
}

// 获取可用的支付方式
export function getAvailablePaymentMethods(): PaymentMethod[] {
  return [
    {
      id: "wechat",
      name: "微信支付",
      icon: "/images/payment/wechat.svg",
      description: "使用微信扫码支付"
    },
    {
      id: "alipay",
      name: "支付宝",
      icon: "/images/payment/alipay.svg",
      description: "使用支付宝扫码支付"
    }
  ]
}

// 保存用户支付偏好
export function savePaymentPreference(method: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('preferredPaymentMethod', method);
  }
}

// 获取用户支付偏好
export function getPaymentPreference(): string | null {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('preferredPaymentMethod') as string;
    return saved || null;
  }
  return null;
}

// 创建支付订单
export async function createPaymentOrder(params: {
  amount: number
  method: string
  orderId: string
  description: string
}) {
  // 这里应该调用实际的支付API
  // 为了演示，我们返回模拟数据
  return {
    paymentId: `pay_${Date.now()}`,
    qrCode: "https://example.com/qr-code",
    amount: params.amount,
    method: params.method,
    orderId: params.orderId,
    status: "pending"
  }
}

// 查询支付状态
export async function queryPaymentStatus(paymentId: string) {
  // 这里应该调用实际的支付API查询状态
  // 为了演示，我们返回模拟数据
  return {
    status: "success",
    paymentId,
    paidAt: new Date().toISOString()
  }
} 