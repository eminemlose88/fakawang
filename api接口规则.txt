# Epusdt API 接口对接指南

我为您整理了完整的 API 接口文档，主要包含**签名算法**、**创建交易**和**异步回调**三个核心部分。

## 1. 签名算法 (安全认证)
所有接口请求都需要携带 `signature` 参数进行安全验证。

### 签名步骤
1.  **排序**：将所有非空参数（不包含 `signature` 本身）按参数名 ASCII 码从小到大排序（字典序）。
2.  **拼接**：将排序后的参数按 `key=value` 格式用 `&` 连接。
3.  **加盐**：在拼接好的字符串末尾直接追加您的 `api_auth_token`（在 `.env` 文件中配置）。
4.  **加密**：对最终字符串进行 MD5 运算。
5.  **转小写**：将 MD5 结果转换为小写，即为 `signature`。

### 签名示例 (PHP)
```php
function epusdtSign(array $parameter, string $signKey)
{
    ksort($parameter); // 1. 字典序排序
    $sign = '';
    foreach ($parameter as $key => $val) {
        if ($val == '' || $key == 'signature') continue; // 排除空值和signature
        if ($sign != '') $sign .= "&";
        $sign .= "$key=$val"; // 2. 拼接
    }
    $sign .= $signKey; // 3. 加盐
    return strtolower(md5($sign)); // 4. 加密 & 5. 转小写
}
```

---

## 2. 创建交易 (发起支付)
您的系统在用户点击支付时调用此接口。

*   **接口地址**: `POST http://18.139.217.127:8000/api/v1/order/create-transaction`
*   **Content-Type**: `application/json`

### 请求参数 (Body)
| 参数名 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| `order_id` | string | 是 | **您的唯一订单号** (例如: "ORDER_20240101") |
| `amount` | number | 是 | **支付金额 (CNY)** (例如: 100.00，保留2位小数) |
| `notify_url` | string | 是 | **异步回调地址** (支付成功后 Epusdt 通知您的地址) |
| `redirect_url` | string | 否 | **同步跳转地址** (用户支付完成后浏览器跳转的地址) |
| `signature` | string | 是 | **签名** (见上方算法) |

### 响应示例 (成功)
```json
{
  "status_code": 200,
  "message": "success",
  "data": {
    "trade_id": "20220327...",      // Epusdt 内部交易号
    "order_id": "ORDER_20240101",   // 您的订单号
    "amount": 100,                  // 人民币金额
    "actual_amount": 13.88,         // **实际需支付 USDT 金额**
    "token": "TNEns8t9...",         // **收款钱包地址**
    "expiration_time": 1648381192,  // 过期时间戳
    "payment_url": "http://..."     // 收银台链接 (可直接跳转让用户扫码)
  }
}
```

---

## 3. 异步回调 (接收结果)
用户支付成功后，Epusdt 会向您提供的 `notify_url` 发送 POST 请求。**这是判断支付是否成功的唯一标准。**

*   **请求方式**: `POST`

### 回调参数
| 参数名 | 类型 | 说明 |
| :--- | :--- | :--- |
| `trade_id` | string | Epusdt 交易号 |
| `order_id` | string | **您的订单号** |
| `amount` | float | 订单金额 (CNY) |
| `actual_amount` | float | 实际支付 USDT 金额 |
| `token` | string | 收款钱包地址 |
| `block_transaction_id` | string | 区块链交易哈希 (TxID) |
| `status` | int | **订单状态** (2 表示支付成功) |
| `signature` | string | 签名 (请务必验证此签名以防伪造) |

### 响应要求
您的服务器收到回调并处理成功后，**必须返回纯字符串 `ok`**。否则 Epusdt 会认为通知失败并不断重试（最多 5 次）。

---

## 4. 常见状态码
*   `200`: 成功
*   `401`: 签名错误 (检查 Token 是否正确，排序是否正确)
*   `10003`: 无可用钱包地址 (请在后台添加收款钱包)
*   `10004`: 金额过小 (无法满足最小支付单位)

需不需要我为您生成一个具体的对接代码示例（例如 PHP 或 Python）？