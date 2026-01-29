const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  // Create Admin User
  const password = await bcrypt.hash('123456', 10)
  const admin = await prisma.adminUser.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: password,
      name: 'Super Admin'
    }
  })
  console.log('Admin user seeded: admin / 123456')

/*
  const group = await prisma.goodsGroup.create({
    data: {
      gpName: 'Test Group',
      isOpen: 1,
      ord: 1
    }
  })

  const goods = await prisma.goods.create({
    data: {
      groupId: group.id,
      gdName: 'Test Product',
      gdDescription: 'This is a test product',
      gdKeywords: 'test, product',
      actualPrice: 10.00,
      inStock: 10,
      type: 1, // Auto delivery
      isOpen: 1
    }
  })

  const carmis = [
    { goodsId: goods.id, carmi: 'CODE-12345', status: 1 },
    { goodsId: goods.id, carmi: 'CODE-67890', status: 1 }
  ]

  for (const carmi of carmis) {
    await prisma.carmi.create({
      data: carmi
    })
  }

  await prisma.pay.create({
    data: {
      payName: 'Test Payment',
      payCheck: 'testpay',
      payMethod: 1,
      payHandleroute: '/api/pay/test',
      isOpen: 1
    }
  })
*/

  // System Settings
  const settings = [
    { slug: 'title', value: 'Fakawang 2.0' },
    { slug: 'logo', value: '/globe.svg' },
    { slug: 'notice', value: '<p>Welcome to <strong>Fakawang 2.0</strong>! This is a demo announcement.</p>' },
    { slug: 'footer', value: '© 2025 Fakawang 2.0. All rights reserved.' }
  ]

  for (const setting of settings) {
    await prisma.systemSetting.upsert({
      where: { slug: setting.slug },
      update: {},
      create: setting
    })
  }

  console.log('Seeded database')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
