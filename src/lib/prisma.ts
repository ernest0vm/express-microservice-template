import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import config from '../config'
import { PrismaClient } from '../generated/prisma/client'

const pool = new Pool({
  connectionString: config.database.url
})

const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

export default prisma
