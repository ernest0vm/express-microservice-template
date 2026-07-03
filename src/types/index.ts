export interface ErrorMessage {
  code: string
  userMessage: string
  message: string
}

export interface AppConfig {
  app: {
    env: string
    port: number
    context: string
    secret: string | undefined
    jwtExpirationTime: number
    jwtIssuer: string | undefined
    authUsername: string
    authPassword: string
  }
  database: {
    url: string
  }
  logger: {
    morganFormat: 'development' | 'production'
    level: string
  }
}

export interface JwtPayload {
  roles?: string[]
  [key: string]: unknown
}
