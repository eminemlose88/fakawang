问题出在您使用了 `127.0.0.1`，但您的 `.env` 配置显示您的数据库是 **AWS RDS** 远程数据库，而不是本地数据库。

请使用以下命令（已替换为您配置中的真实 RDS 地址）：

```bash
mysql -h epusdt-db.ctm8g60gqptk.ap-southeast-1.rds.amazonaws.com -u root -p'Epusdt_2024_Pass!' epusdt -e "INSERT INTO wallet_address (token, status, created_at, updated_at) VALUES ('TJpuLCJhhVbQWP2vLihtFdxUJ11MvY9Ag1', 1, NOW(), NOW());"
```

这应该就能成功了！
