导致“页面找不到 (404)”的根本原因是：**Epusdt 是一个独立的支付服务，它的支付页面不在您的网站程序 (Next.js) 里。**

当您在 `.env` 中设置 `app_uri=https://www.tasha991.uk` 时，Epusdt 生成的支付链接指向了您的网站路径 `/pay/checkout-counter/...`，但您的网站代码中并没有这个页面，所以报错 404。

# 解决方案：修改 Epusdt 外部链接地址

我们需要将支付跳转地址改回 Epusdt 服务自己的地址（即 IP + 端口）。

## 1. 修改服务器上的配置文件

请在 SSH 终端中执行：

```bash
nano /home/ec2-user/epusdt/epusdt-0.0.3/.env
```

找到 `app_uri` 这一行，将其修改为：

```ini
app_uri=http://18.139.217.127:8000
```

*(注意：这里必须用 http 和 IP 地址，不要用 https 或域名，除非您给 Epusdt 单独配了 Nginx 反向代理和 SSL 证书)*

## 2. 重启服务

修改保存后，重启服务以生效：

```bash
sudo systemctl restart epusdt
```

## 3. 重新测试

回到网站重新下单。这次点击支付后，浏览器应该会跳转到 `http://18.139.217.127:8000/pay/checkout-counter/...`，您应该能看到正常的 USDT 支付二维码页面了。
