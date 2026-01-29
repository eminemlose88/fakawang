const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Adding Cryptomus payment method...')

  const cryptomus = await prisma.pay.upsert({
    where: { payCheck: 'cryptomus' },
    update: {
      payHandleroute: '/api/pay/cryptomus/create',
      payMethod: 1, // Jump
      isOpen: 1
    },
    create: {
      payName: 'Cryptomus',
      payCheck: 'cryptomus',
      payMethod: 1, // Jump
      merchantId: process.env.CRYPTOMUS_MERCHANT_ID || 'replace-me',
      merchantKey: process.env.CRYPTOMUS_API_KEY || 'replace-me',
      payHandleroute: '/api/pay/cryptomus/create',
      isOpen: 1
    }
  })

  console.log('Cryptomus added:', cryptomus)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
