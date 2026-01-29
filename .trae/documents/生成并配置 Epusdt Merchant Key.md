收到您的 AWS 密钥。我将尝试使用 AWS CLI 和 Systems Manager (SSM) 直接为您远程配置服务器。

# AWS 远程配置与密钥同步计划

## 1. 准备工作
*   **配置环境**: 使用您提供的 Access Key 和 Secret Key 设置 AWS CLI 环境 (默认区域尝试 `ap-southeast-1`)。
*   **生成密钥**: 生成一个高强度的随机 `api_auth_token` (例如 `epusdt_live_xxxxxxxx`)。
*   **更新数据库**: 运行脚本将此 Token 更新到您的 Supabase 数据库，确保网站端配置正确。

## 2. 远程更新服务器 (尝试自动化)
我将尝试查找您的 EC2 实例并通过 AWS SSM 执行以下操作：
1.  **定位实例**: 查找运行中的 Epusdt 实例。
2.  **修改配置**: 远程运行命令，替换服务器上 `.env` 文件中的 `api_auth_token`。
3.  **重启服务**: 执行 `systemctl restart epusdt` (或相应命令) 使配置生效。

*注意：如果您的服务器未安装 SSM Agent 或未配置 IAM 权限，此步骤可能会失败。届时我将为您提供替代的手动操作方案。*

## 3. 验证
*   检查数据库是否更新成功。
*   如果远程操作成功，您可以在网站上发起一笔测试支付来验证。

是否确认执行？
