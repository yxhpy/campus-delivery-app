# 校园外卖应用

这是一个基于Next.js和React开发的校园外卖应用，旨在为校园内的学生提供便捷的外卖订餐服务。

## 项目当前状态

目前项目处于开发初期阶段，已完成的功能包括：

- 首页展示（商家列表）
- 商家详情页面（包含商品列表）
- 商品详情页面
- 购物车功能
- 用户注册和登录
- 用户个人资料页面
- 结算页面

## 技术栈

- **前端框架**：Next.js 14.1.0
- **UI库**：React 18.2.0
- **样式**：Tailwind CSS
- **图标**：Lucide React
- **组件库**：自定义UI组件

## 项目结构

```
校园外卖应用/
├── app/                    # Next.js应用目录
│   ├── globals.css         # 全局样式
│   ├── layout.tsx          # 应用布局
│   ├── page.tsx            # 首页
│   ├── auth/               # 认证相关页面
│   │   ├── login/          # 登录页面
│   │   └── register/       # 注册页面
│   ├── checkout/           # 结算页面
│   ├── profile/            # 用户个人资料页面
│   ├── product/            # 商品相关页面
│   │   └── [id]/           # 商品详情页（动态路由）
│   └── merchant/           # 商家相关页面
│       └── [id]/           # 商家详情页（动态路由）
│           └── page.tsx    # 商家详情页面
├── components/             # 组件目录
│   ├── CampusDeliveryApp.tsx  # 首页主组件
│   ├── MerchantDetailPage.tsx # 商家详情页组件
│   ├── ProductDetailPage.tsx  # 商品详情页组件
│   ├── CartSheet.tsx          # 购物车抽屉组件
│   ├── UserMenu.tsx           # 用户菜单组件
│   └── ui/                 # UI组件
│       ├── badge.tsx       # 徽章组件
│       ├── button.tsx      # 按钮组件
│       ├── card.tsx        # 卡片组件
│       ├── input.tsx       # 输入框组件
│       ├── label.tsx       # 标签组件
│       ├── separator.tsx   # 分隔线组件
│       ├── sheet.tsx       # 抽屉组件
│       └── table.tsx       # 表格组件
├── lib/                    # 工具库
│   ├── utils.ts            # 工具函数
│   ├── cart-context.tsx    # 购物车上下文
│   └── user-context.tsx    # 用户上下文
├── public/                 # 静态资源目录
├── .next/                  # Next.js构建目录
├── node_modules/           # 依赖包
├── package.json            # 项目配置
├── package-lock.json       # 依赖锁定文件
├── postcss.config.js       # PostCSS配置
├── tailwind.config.js      # Tailwind配置
├── tsconfig.json           # TypeScript配置
├── next-env.d.ts           # Next.js类型声明
├── PROGRESS_REPORT.md      # 进度报告
├── PROJECT_STRUCTURE.md    # 项目结构文档
├── ROADMAP.md              # 开发路线图
└── TODO.md                 # 待办事项列表
```

## 开发指南

### 环境要求

- Node.js 18.x 或更高版本
- npm 9.x 或更高版本

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

开发服务器将在 http://localhost:3000 启动。

### 构建生产版本

```bash
npm run build
```

### 启动生产服务器

```bash
npm run start
```

## 数据模型

目前项目使用模拟数据，主要数据模型包括：

### 商家(Merchant)

```typescript
interface MerchantDetail {
  id: string
  name: string
  rating: number
  reviewCount: number
  address: string
  openingHours: string
  phone: string
  email: string
  description: string
  categories: string[]
  products: Product[]
}
```

### 商品(Product)

```typescript
interface Product {
  id: string
  name: string
  price: number
  description: string
  category: string
  image?: string
}
```

### 用户(User)

```typescript
interface User {
  id: string
  username: string
  email: string
  name?: string
  phone?: string
  address?: string[]
}
```

### 购物车(Cart)

```typescript
interface CartItem {
  id: string
  productId: string
  merchantId: string
  name: string
  price: number
  quantity: number
  image?: string
}
```

## 待完成功能

详见 [TODO.md](./TODO.md) 文件和 [ROADMAP.md](./ROADMAP.md) 文件。

## 贡献指南

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交你的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启一个 Pull Request

## 许可证

[MIT](LICENSE)