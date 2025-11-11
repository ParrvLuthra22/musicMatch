const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

async function main() {
  const email = process.env.SEED_USER_EMAIL || 'demo@example.com'
  const name = process.env.SEED_USER_NAME || 'Demo User'
  const password = process.env.SEED_USER_PASSWORD || 'password123'

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    console.log(`Seed: user already exists -> ${email}`)
    return
  }

  const hashed = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({ data: { name, email, password: hashed } })
  console.log('Seed: created user', { id: user.id, email: user.email })
}

main()
  .catch((e) => {
    console.error('Seed error', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
