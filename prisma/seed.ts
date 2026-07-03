import prisma from '../src/lib/prisma'

async function main(): Promise<void> {
  const count = await prisma.example.count()
  if (count === 0) {
    await prisma.example.create({
      data: { name: 'Example item' }
    })
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (err) => {
    console.error(err)
    await prisma.$disconnect()
    process.exit(1)
  })
