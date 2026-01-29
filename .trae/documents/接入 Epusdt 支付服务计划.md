我已更新计划，将直接为您完成 Epusdt 支付的接入，并通过 Vercel CLI 连接 Supabase 数据库进行配置。

# Epusdt 支付接入与自动配置计划

## 1. 环境配置与数据库连接
*   **拉取环境变量**: 尝试使用 Vercel CLI 运行 `vercel env pull .env`，以获取 Supabase 数据库的连接信息 (`POSTGRES_PRISMA_URL` 等)。
*   **验证连接**: 运行 `npx prisma db pull` 验证是否能成功连接到远程 Supabase 数据库。

## 2. 核心代码实现
*   **支付服务类**: 创建 `lib/pay/epusdt.ts`，实现签名生成、交易创建和回调验证逻辑。
*   **API 路由**:
    *   `app/api/pay/epusdt/create/route.ts`: 处理下单。
    *   `app/api/pay/epusdt/notify/route.ts`: 处理回调。

## 3. 自动化配置脚本
*   创建 `scripts/add-epusdt.js` 脚本。
*   **配置内容**:
    *   API 地址: `http://18.139.217.127:8000` (从文档获取)
    *   API Token: 将设置为占位符 `REPLACE_WITH_YOUR_TOKEN` (或从环境变量读取)，需要您后续在后台或数据库中更新。
*   **执行脚本**: 在代码实现完成后，我将直接运行此脚本，将 Epusdt 支付方式写入您的远程 Supabase 数据库。

## 4. 验证
*   确认脚本执行成功，数据库中已存在 Epusdt 配置。
*   此时您的网站应该已经具备了 Epusdt 支付功能。

请确认是否立即开始执行？
