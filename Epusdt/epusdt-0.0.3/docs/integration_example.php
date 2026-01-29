<?php

class EpusdtClient
{
    private $apiUrl;
    private $apiToken;

    public function __construct($apiUrl, $apiToken)
    {
        $this->apiUrl = rtrim($apiUrl, '/');
        $this->apiToken = $apiToken;
    }

    /**
     * 生成签名
     */
    public function sign(array $parameter)
    {
        ksort($parameter); // 字典序排序
        $sign = '';
        foreach ($parameter as $key => $val) {
            if ($val === '' || $key === 'signature') continue;
            if ($sign !== '') $sign .= "&";
            $sign .= "$key=$val";
        }
        $sign .= $this->apiToken; // 加盐
        return strtolower(md5($sign));
    }

    /**
     * 发起支付请求
     */
    public function createTransaction($orderId, $amount, $notifyUrl, $redirectUrl = '')
    {
        $data = [
            'order_id' => $orderId,
            'amount' => $amount,
            'notify_url' => $notifyUrl,
            'redirect_url' => $redirectUrl,
        ];

        // 生成签名
        $data['signature'] = $this->sign($data);

        // 发送请求
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $this->apiUrl . '/api/v1/order/create-transaction');
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        
        $response = curl_exec($ch);
        curl_close($ch);

        return json_decode($response, true);
    }
}

// --- 使用示例 ---

// 配置信息
$apiUrl = 'http://18.139.217.127:8000'; // 您的 Epusdt 服务器地址
$apiToken = 'epusdt_password_xasddawqe'; // 务必修改为您 .env 中的 api_auth_token

$client = new EpusdtClient($apiUrl, $apiToken);

// 发起支付
$orderId = 'ORDER_' . time();
$amount = 100.00; // 100 CNY
$notifyUrl = 'http://your-domain.com/notify.php';
$redirectUrl = 'http://your-domain.com/return.php';

$result = $client->createTransaction($orderId, $amount, $notifyUrl, $redirectUrl);

print_r($result);
