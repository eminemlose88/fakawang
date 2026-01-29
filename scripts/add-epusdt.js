const { PrismaClient } = require('@prisma/client')
const crypto = require('crypto')
const prisma = new PrismaClient()

async function main() {
  console.log('Adding Epusdt payment method...')

  // 生成一个随机 Token
  const generatedToken = 'epusdt_live_' + crypto.randomBytes(16).toString('hex')
  
  // 从环境变量获取，或者使用默认值
  const apiUrl = process.env.EPUSDT_API_URL || 'http://18.139.217.127:8000'
  // 优先使用环境变量中的 Token，否则使用新生成的
  const apiToken = process.env.EPUSDT_API_TOKEN || generatedToken

  console.log(`Using API URL: ${apiUrl}`)
  console.log(`Using API Token: ${apiToken}`)

  const epusdt = await prisma.pay.upsert({
    where: { payCheck: 'epusdt' },
    update: {
      payName: 'USDT (Epusdt)',
      payMethod: 1, // Jump
      merchantId: apiUrl,
      merchantKey: apiToken,
      payHandleroute: '/api/pay/epusdt/create',
      isOpen: 1
    },
    create: {
      payName: 'USDT (Epusdt)',
      payCheck: 'epusdt',
      payMethod: 1, // Jump
      merchantId: apiUrl,
      merchantKey: apiToken,
      payHandleroute: '/api/pay/epusdt/create',
      isOpen: 1
    }
  })

  console.log('Epusdt added/updated:', epusdt)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
