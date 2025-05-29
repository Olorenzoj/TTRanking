import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma

// Add connection health check
prisma.$connect()
  .then(() => console.log('✅ Database connected'))
  .catch((err: unknown) => console.error('❌ Database connection error:', err))

// Add graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})

export default prisma