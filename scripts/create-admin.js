const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function main() {
  const username = 'admin'
  const password = 'password' // Default password
  const hashedPassword = await bcrypt.hash(password, 10)

  console.log(`Creating admin user...`)
  console.log(`Username: ${username}`)
  console.log(`Password: ${password}`)

  const admin = await prisma.adminUser.upsert({
    where: { username },
    update: {
      password: hashedPassword,
    },
    create: {
      username,
      password: hashedPassword,
      name: 'Super Admin',
    },
  })

  console.log('Admin user created successfully:', admin)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
