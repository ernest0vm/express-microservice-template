import jwt from 'jsonwebtoken'
import bearer from 'token-extractor'
import { Request } from 'express'
import { JwtPayload } from '../types'

const sign = (payload: JwtPayload, secret: string, options?: jwt.SignOptions): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secret, options ?? {}, (err, token) => {
      if (err) {
        return reject(err)
      }

      resolve(token as string)
    })
  })
}

const verify = (
  token: string,
  secret: string,
  options?: jwt.VerifyOptions
): Promise<JwtPayload> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, options ?? {}, (err, decoded) => {
      if (err) {
        return reject(err)
      }

      resolve(decoded as JwtPayload)
    })
  })
}

const extractToken = (req: Request): Promise<string> => {
  return new Promise((resolve, reject) => {
    bearer(req, (err: Error | null, token: string) => {
      if (err) {
        return reject(err)
      }

      resolve(token)
    })
  })
}

export { sign, verify, extractToken }
