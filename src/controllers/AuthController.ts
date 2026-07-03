import { Request, Response, NextFunction } from 'express'
import * as jwt from '../lib/jwt'
import config from '../config'
import messages from '../lib/messages'

class AuthController {
  static async token(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { username, password } = req.body

      if (
        username !== config.app.authUsername ||
        password !== config.app.authPassword
      ) {
        res.status(401).send(messages.invalidCredentials)
        return
      }

      const expiresIn = config.app.jwtExpirationTime
      const token = await jwt.sign(
        { sub: username, roles: ['ADMIN'] },
        config.app.secret as string,
        {
          expiresIn,
          issuer: config.app.jwtIssuer
        }
      )

      res.status(200).send({
        token,
        tokenType: 'Bearer',
        expiresIn
      })
    } catch (err) {
      next(err)
    }
  }
}

export default AuthController
