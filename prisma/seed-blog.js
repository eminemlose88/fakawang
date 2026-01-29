const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const post = await prisma.post.upsert({
    where: { slug: 'how-to-securely-buy-aws-accounts' },
    update: {},
    create: {
      title: '如何安全地购买和使用 AWS 账号',
      slug: 'how-to-securely-buy-aws-accounts',
      excerpt: '了解购买和管理 AWS 账号的最佳实践，确保账号的长期稳定和安全。',
      author: 'Tech Admin',
      tags: 'AWS, Cloud, Security, Guide',
      content: `
# 如何安全地购买和使用 AWS 账号

在数字化时代，云计算已成为现代技术的支柱。Amazon Web Services (AWS) 是该领域的领导者，为各种规模的企业提供强大的解决方案。然而，获取和管理 AWS 账号有时可能具有挑战性。本指南将带您了解如何从我们的平台安全地购买和使用 AWS 账号。

## 为什么要购买 AWS 账号？

购买现成的 AWS 账号可以节省您的时间和行政麻烦。无论您是需要账号进行测试、开发，还是扩展业务，我们经过验证的账号都可以立即使用。

### 主要优势：
- **即时访问**：无需等待验证过程。
- **高配额**：我们的许多账号都带有更高的 vCPU 配额。
- **全区域解锁**：即时访问所有 AWS 区域。

## 使用购买账号的最佳实践

为了确保账号的长期使用，请遵循以下最佳实践：

### 1. 使用干净的 IP 地址
始终从干净、未被列入黑名单的 IP 地址登录。避免使用公共 VPN，因为它们经常被 AWS 安全系统标记。建议使用住宅代理。

### 2. 账号预热
不要立即启动数百个实例。从小规模开始，比如一个 t2.micro 实例，让它运行几个小时。在几天内逐渐增加您的使用量。

### 3. 保护根账号
- 购买后立即更改密码。
- 启用多因素认证 (MFA)。
- 为日常任务创建 IAM 用户，而不是直接使用根账号。

### 4. 监控账单
设置账单警报以避免意外费用。即使您使用的是免费层资源，关注使用情况也是一个好习惯。

## 结论

购买 AWS 账号是开启云之旅的绝佳方式。通过遵循这些安全提示，您可以确保顺畅且持久的体验。查看我们的商店，获取最新高质量的 AWS 账号！
      `
    }
  })

  console.log('Seed data created:', post)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
