const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const count = await prisma.goods.count()
  console.log(`Goods count: ${count}`)
  const goods = await prisma.goods.findMany()
  console.log(goods)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
