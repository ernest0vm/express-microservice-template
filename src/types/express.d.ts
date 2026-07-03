import { JwtPayload } from './index'

declare global {
  namespace Express {
    interface Request {
      extraData?: JwtPayload & { bearerToken?: string }
    }
  }
}

export {}
