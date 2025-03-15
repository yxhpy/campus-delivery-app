import { NextResponse } from "next/server"

// 模拟数据库中的用户数据
const mockUsers = [
  {
    id: "1",
    phone: "13800138000",
    password: "123456", // 实际应用中应该使用加密密码
    name: "测试配送员",
  },
]

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { phone, password } = body

    // 验证请求数据
    if (!phone || !password) {
      return NextResponse.json(
        { error: "手机号和密码不能为空" },
        { status: 400 }
      )
    }

    // 查找用户
    const user = mockUsers.find(
      (u) => u.phone === phone && u.password === password
    )

    if (!user) {
      return NextResponse.json(
        { error: "手机号或密码错误" },
        { status: 401 }
      )
    }

    // 生成 token（实际应用中应该使用 JWT）
    const token = Buffer.from(`${user.id}:${Date.now()}`).toString("base64")

    // 返回用户信息和 token
    return NextResponse.json({
      token,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "服务器错误" },
      { status: 500 }
    )
  }
} 