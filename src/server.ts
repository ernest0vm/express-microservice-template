import app from './app'
import config from './config'
import prisma from './lib/prisma'
import { logger } from './loggers/loggers'

async function shutdown(): Promise<void> {
  await prisma.$disconnect()
}

if (require.main === module) {
  const server = app.listen(config.app.port, () => {
    logger.info('=======================================================')
    logger.info('')
    logger.info('   SERVICE LISTENING ON PORT: ' + config.app.port)
    logger.info('   WITH CONTEXT: ' + config.app.context)
    logger.info('')
    logger.info('=======================================================')
  })

  const onShutdown = (): void => {
    server.close(() => {
      shutdown()
        .then(() => process.exit(0))
        .catch(() => process.exit(1))
    })
  }

  process.on('SIGINT', onShutdown)
  process.on('SIGTERM', onShutdown)
}

export default app
