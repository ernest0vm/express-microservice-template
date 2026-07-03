import { Request, Response, NextFunction } from 'express'
import messages from '../lib/messages'

function validateName(req: Request, res: Response, next: NextFunction): void {
  const { name } = req.body

  if (!name || String(name).trim().length === 0) {
    res.status(400).send(messages.nameIsRequired)
    return
  }

  next()
}

function validateCredentials(req: Request, res: Response, next: NextFunction): void {
  const { username, password } = req.body

  if (
    !username ||
    !password ||
    String(username).trim().length === 0 ||
    String(password).trim().length === 0
  ) {
    res.status(400).send(messages.credentialsRequired)
    return
  }

  next()
}

export { validateName, validateCredentials }
