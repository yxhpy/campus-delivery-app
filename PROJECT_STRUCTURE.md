# 校园外卖应用项目结构

本文档详细描述了校园外卖应用的项目结构、文件组织和组件关系。

## 目录结构

```
校园外卖应用/
├── app/                    # Next.js应用目录
│   ├── globals.css         # 全局样式
│   ├── layout.tsx          # 应用布局
│   ├── page.tsx            # 首页
│   └── merchant/           # 商家相关页面
│       └── [id]/           # 商家详情页（动态路由）
│           └── page.tsx    # 商家详情页面
├── components/             # 组件目录
│   ├── CampusDeliveryApp.tsx  # 首页主组件
│   ├── MerchantDetailPage.tsx # 商家详情页组件
│   └── ui/                 # UI组件
│       ├── badge.tsx       # 徽章组件
│       ├── button.tsx      # 按钮组件
│       ├── card.tsx        # 卡片组件
│       ├── input.tsx       # 输入框组件
│       ├── separator.tsx   # 分隔线组件
│       ├── sheet.tsx       # 抽屉组件
│       └── table.tsx       # 表格组件
├── lib/                    # 工具库
│   └── utils.ts            # 工具函数
├── public/                 # 静态资源目录
├── .next/                  # Next.js构建目录
├── node_modules/           # 依赖包
├── package.json            # 项目配置
├── package-lock.json       # 依赖锁定文件
├── postcss.config.js       # PostCSS配置
├── tailwind.config.js      # Tailwind配置
├── tsconfig.json           # TypeScript配置
├── next-env.d.ts           # Next.js类型声明
├── README.md               # 项目说明
├── ROADMAP.md              # 开发路线图
└── TODO.md                 # 待办事项列表
```

## 组件结构和关系

### 页面组件

1. **首页 (app/page.tsx)**
   - 导入并使用 `CampusDeliveryApp` 组件
   - 作为应用的入口点

2. **商家详情页 (app/merchant/[id]/page.tsx)**
   - 使用动态路由获取商家ID
   - 导入并使用 `MerchantDetailPage` 组件
   - 目前使用模拟数据，未来将通过API获取真实数据

### 主要组件

1. **CampusDeliveryApp.tsx**
   - 首页主组件
   - 包含商家列表、分类导航和搜索功能
   - 使用多个UI组件构建界面

2. **MerchantDetailPage.tsx**
   - 商家详情页主组件
   - 展示商家信息、商品列表和评价
   - 使用Card、Table等UI组件构建界面

### UI组件库

项目使用自定义UI组件库，基于Tailwind CSS构建：

1. **badge.tsx** - 用于显示标签和状态
2. **button.tsx** - 各种按钮组件
3. **card.tsx** - 卡片容器组件
4. **input.tsx** - 输入框组件
5. **separator.tsx** - 分隔线组件
6. **sheet.tsx** - 侧边抽屉组件
7. **table.tsx** - 表格组件

## 数据流

目前项目使用模拟数据，数据流如下：

1. 首页 (app/page.tsx) 加载 CampusDeliveryApp 组件
2. CampusDeliveryApp 组件内部定义并使用模拟数据
3. 用户点击商家卡片，导航到商家详情页
4. 商家详情页 (app/merchant/[id]/page.tsx) 加载 MerchantDetailPage 组件
5. 商家详情页使用模拟数据展示商家信息和商品

未来计划：
- 创建API服务
- 实现数据获取和状态管理
- 添加用户认证和权限控制

## 样式系统

项目使用Tailwind CSS进行样式管理：

1. **globals.css** - 全局样式和Tailwind导入
2. **tailwind.config.js** - Tailwind配置，包括主题和插件
3. **postcss.config.js** - PostCSS配置，用于处理CSS

组件使用Tailwind类名和cn工具函数（来自lib/utils.ts）进行条件样式应用。

## 路由系统

项目使用Next.js的App Router进行路由管理：

1. **/** - 首页，对应 app/page.tsx
2. **/merchant/[id]** - 商家详情页，对应 app/merchant/[id]/page.tsx

未来计划添加的路由：
- /auth/login - 登录页面
- /auth/register - 注册页面
- /profile - 用户个人资料
- /cart - 购物车
- /checkout - 结算页面
- /orders - 订单列表
- /orders/[id] - 订单详情

## 依赖关系

主要依赖包括：

- **next**: 14.1.0 - React框架
- **react**: 18.2.0 - UI库
- **react-dom**: 18.2.0 - React DOM渲染
- **lucide-react**: 0.344.0 - 图标库
- **tailwindcss**: 3.4.1 - CSS框架
- **typescript**: 5.3.3 - 类型系统
- **@radix-ui/react-***：UI组件原语

## 开发规范

1. **组件命名**：使用PascalCase
2. **文件命名**：使用kebab-case
3. **类型定义**：使用TypeScript接口
4. **样式应用**：使用Tailwind类名
5. **状态管理**：目前使用React内置状态管理

## 未来架构演进

随着项目的发展，架构将逐步演进：

1. **数据层**：添加数据获取和状态管理
2. **API层**：创建API客户端和服务
3. **认证层**：实现用户认证和授权
4. **业务逻辑层**：抽象业务逻辑到独立模块
5. **UI层**：扩展UI组件库

详细的演进计划请参考 [ROADMAP.md](./ROADMAP.md)。 