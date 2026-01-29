为了隐藏您的 IP 和端口，我已在 Next.js 中配置了**反向代理**。现在所有的支付流量都会通过您的域名 `https://www.tasha991.uk` 转发到后端的 8000 端口，用户将看不到真实的服务器 IP。

# 接下来的步骤：更新 Epusdt 配置

为了配合这个改动，您需要最后修改一次服务器上的配置文件。

## 1. 修改 .env 文件

请在 SSH 终端中执行：

```bash
nano /home/ec2-user/epusdt/epusdt-0.0.3/.env
```

将 `app_uri` 修改回您的域名：

```ini
app_uri=https://www.tasha991.uk
```

*(之前我们改成 IP 是为了测试，现在有了反向代理，就可以改回域名了)*

## 2. 重启服务

```bash
sudo systemctl restart epusdt
```

## 3. 提交代码并部署

我稍后会将 Next.js 的反向代理配置推送到 GitHub。等 Vercel 自动部署完成后（约 2-3 分钟），您的支付链接就会变成 `https://www.tasha991.uk/pay/checkout-counter/...`，完美隐藏后端 IP。
