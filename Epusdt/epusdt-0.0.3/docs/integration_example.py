import hashlib
import json
import requests
import time

class EpusdtClient:
    def __init__(self, api_url, api_token):
        self.api_url = api_url.rstrip('/')
        self.api_token = api_token

    def sign(self, params):
        """
        生成签名
        """
        # 1. 过滤空值和 signature 字段
        filtered_params = {k: v for k, v in params.items() if v != '' and k != 'signature'}
        
        # 2. 按键名 ASCII 码从小到大排序
        sorted_keys = sorted(filtered_params.keys())
        
        # 3. 拼接参数 key=value&key=value
        sign_str = '&'.join([f"{key}={filtered_params[key]}" for key in sorted_keys])
        
        # 4. 追加 Token
        sign_str += self.api_token
        
        # 5. MD5 运算并转小写
        return hashlib.md5(sign_str.encode('utf-8')).hexdigest().lower()

    def create_transaction(self, order_id, amount, notify_url, redirect_url=''):
        """
        发起支付请求
        """
        data = {
            'order_id': order_id,
            'amount': amount,
            'notify_url': notify_url,
            'redirect_url': redirect_url
        }
        
        # 生成签名
        data['signature'] = self.sign(data)
        
        # 发送请求
        try:
            response = requests.post(
                f"{self.api_url}/api/v1/order/create-transaction",
                json=data,
                headers={'Content-Type': 'application/json'}
            )
            return response.json()
        except Exception as e:
            return {'status_code': 500, 'message': str(e)}

# --- 使用示例 ---

if __name__ == "__main__":
    # 配置信息
    API_URL = 'http://18.139.217.127:8000' # 您的 Epusdt 服务器地址
    API_TOKEN = 'epusdt_password_xasddawqe' # 务必修改为您 .env 中的 api_auth_token

    client = EpusdtClient(API_URL, API_TOKEN)

    # 发起支付
    order_id = f"ORDER_{int(time.time())}"
    amount = 100.00  # 100 CNY
    notify_url = 'http://your-domain.com/notify'
    redirect_url = 'http://your-domain.com/return'

    result = client.create_transaction(order_id, amount, notify_url, redirect_url)

    print(json.dumps(result, indent=2, ensure_ascii=False))
