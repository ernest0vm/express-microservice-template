import dotenv from 'dotenv'

dotenv.config({ quiet: true })

import { AppConfig } from './types'

const config: AppConfig = {
  app: {
    env: process.env.NODE_ENV || 'development',
    port: Number(process.env.SERVER_PORT) || 3000,
    context: process.env.SERVICE_CONTEXT || '/my-service/v1',
    secret: process.env.SECRET,
    jwtExpirationTime: Number(process.env.JWT_EXPIRATION_TIME) || 3600,
    jwtIssuer: process.env.JWT_ISSUER,
    authUsername: process.env.AUTH_USERNAME || 'admin',
    authPassword: process.env.AUTH_PASSWORD || 'admin'
  },
  database: {
    url: process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5432/my_service'
  },
  logger: {
    morganFormat: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    level: process.env.LOG_LEVEL || 'debug'
  }
}

export default config
