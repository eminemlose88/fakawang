我将使用 `Epusdt\epusdt-0.0.3\fw.ppk` 密钥通过 SSH 连接服务器并配置 `api_auth_token`。

# Epusdt 远程配置计划 (使用 PPK)

## 1. 密钥准备
*   **读取私钥**: `Epusdt\epusdt-0.0.3\fw.ppk` 包含 OpenSSH 格式的私钥（虽然扩展名是 .ppk，但内容是 `-----BEGIN OPENSSH PRIVATE KEY-----`，可以直接使用）。
*   **设置权限**: 确保密钥文件权限正确 (Windows 上通常不需要像 Linux 那样 `chmod 600`，但需要确保路径正确)。

## 2. 确认服务器信息
*   **重新确认 IP**: 之前的查询显示没有找到实例，可能是 Region 配置问题 (默认 `ap-southeast-1`)。我将再次确认您提供的 IP `18.139.217.127` 是否可达。
*   **用户名**: 尝试使用 `ec2-user` 或 `root` 连接。

## 3. 执行远程配置
我将直接使用 SSH 命令连接服务器并执行以下操作：
1.  **连接命令**: `ssh -i Epusdt/epusdt-0.0.3/fw.ppk ec2-user@18.139.217.127`
2.  **修改 Token**: 将 `.env` 文件中的 `api_auth_token` 修改为 `epusdt_live_91aed76e67883ac96f112b6ea5cf899c`。
3.  **重启服务**: `sudo systemctl restart epusdt`。
4.  **验证**: `grep` 确认修改生效。

是否确认执行？
