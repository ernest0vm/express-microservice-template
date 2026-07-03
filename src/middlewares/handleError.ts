import { Request, Response, NextFunction, ErrorRequestHandler } from 'express'
import config from '../config'
import messages from '../lib/messages'
import { logger } from '../loggers/loggers'

interface HttpError extends Error {
  httpStatus?: number
}

const handleError: ErrorRequestHandler = (
  err: HttpError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (
    err.message.match(/invalid signature/) ||
    err.message.match(/No Authorization header/) ||
    err.message.match(/malformed/)
  ) {
    res.status(401).send(messages.notAuthenticated)
    return
  }

  if (err.message === 'jwt expired') {
    res.status(401).send(messages.tokenExpired)
    return
  }

  logger.error('An error ocurred: ' + err)

  let message: string | { name: string; description: string; stack?: string } = 'Fatal Error'

  if (config.app.env !== 'production') {
    message = {
      name: err.name,
      description: err.message,
      stack: err.stack
    }
  }

  res.status(err.httpStatus || 500).send({
    code: 'EA0001',
    userMessage: 'F0001',
    message
  })
}

export default handleError
