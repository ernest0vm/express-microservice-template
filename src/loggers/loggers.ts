import morgan from 'morgan'
import { createLogger, format, transports, Logger } from 'winston'
import config from '../config'

// Morgan's built-in names are abbreviated; map our env labels to them.
const morganFormats = {
  development: 'dev',
  production: 'combined'
} as const

const morganFormat = morganFormats[config.logger.morganFormat]

const morganSuccessConfig = morgan(morganFormat, {
  skip: function (_req, res) {
    return res.statusCode < 400
  },
  stream: process.stderr
})

const morganErrorConfig = morgan(morganFormat, {
  skip: function (_req, res) {
    return res.statusCode >= 400
  },
  stream: process.stdout
})

const level = config.logger.level

function formatParams(info: {
  timestamp?: string
  level: string
  message: unknown
  [key: string]: unknown
}): string {
  const { timestamp, level, message, ...args } = info
  const ts = (timestamp ?? '').slice(0, 19).replace('T', ' ')

  return `${ts} ${level}: ${message} ${Object.keys(args).length ? JSON.stringify(args) : ''}`
}

const developmentFormat = format.combine(
  format.colorize(),
  format.timestamp(),
  format.align(),
  format.printf(formatParams)
)

const productionFormat = format.combine(
  format.timestamp(),
  format.align(),
  format.printf(formatParams)
)

let logger: Logger = createLogger({
  level,
  format: developmentFormat,
  transports: [new transports.Console()]
})

if (config.app.env === 'production') {
  logger = createLogger({
    level,
    format: productionFormat,
    transports: [
      new transports.Console(),
      new transports.File({ filename: './logs/error.log', level: 'error' }),
      new transports.File({ filename: './logs/combined.log' })
    ]
  })
}

export { morganSuccessConfig, morganErrorConfig, logger }
