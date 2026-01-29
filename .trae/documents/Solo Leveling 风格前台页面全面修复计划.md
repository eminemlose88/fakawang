我将修复所有前台页面的暗黑风格适配问题，以确保整个网站的视觉体验统一。

### 1. 商品详情页 (`app/[lang]/goods/[id]/page.tsx` & `BuyForm.tsx`)
*   **背景**：`bg-gray-100` -> `bg-sl-dark`。
*   **卡片**：`bg-white` -> `bg-sl-card`，添加 `border border-white/5`。
*   **文字**：`text-gray-900` -> `text-white`，`text-gray-500` -> `text-gray-400`。
*   **图片**：添加暗角和渐变叠加效果。
*   **购买表单**：
    *   输入框：改为深色背景 (`bg-black/50`)，白色文字，青色聚焦边框。
    *   按钮：改为高对比度风格（悬停发光）。
    *   价格：添加发光效果。

### 2. 联系客服页 (`app/[lang]/contact/page.tsx`)
*   **背景**：`bg-gray-50` -> `bg-sl-dark`。
*   **卡片**：`bg-white` -> `bg-sl-card`，添加发光边框。
*   **按钮**：调整 Telegram 按钮的样式，使其更符合霓虹风格。

### 3. 收银台/支付页 (`app/[lang]/pay/[orderSn]/page.tsx`)
*   **背景**：`bg-gray-100` -> `bg-sl-dark`。
*   **容器**：`bg-white` -> `bg-sl-card`。
*   **图标**：`bg-blue-100` -> `bg-sl-blue/10`，`text-blue-600` -> `text-sl-blue`。
*   **订单信息**：深色背景，亮色文字。

### 4. 提交修复
*   确认所有修改无误后，一次性提交代码。

我将按照您的要求，优先修复前台页面，暂不触动管理后台。