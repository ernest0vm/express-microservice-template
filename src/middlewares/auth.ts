import { Request, Response, NextFunction, RequestHandler } from 'express'
import * as jwt from '../lib/jwt'
import config from '../config'
import messages from '../lib/messages'

function hasRoles(roles: string[]): RequestHandler {
  return async function (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = await jwt.extractToken(req)
      const payload = await jwt.verify(token, config.app.secret as string)

      if (!payload.roles) {
        res.status(403).send(messages.userHaventRoles)
        return
      }

      const found = payload.roles.some((r: string) => roles.indexOf(r.toUpperCase()) >= 0)
      if (!found) {
        res.status(403).send(messages.userHaventRoles)
        return
      }

      next()
    } catch (e) {
      next(e)
    }
  }
}

async function isAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const token = await jwt.extractToken(req)
    const payload = await jwt.verify(token, config.app.secret as string)
    req.extraData = { ...payload, bearerToken: token }
    next()
  } catch (e) {
    next(e)
  }
}

export { hasRoles, isAuth }
