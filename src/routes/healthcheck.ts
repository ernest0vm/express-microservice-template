import { Router, Request, Response } from 'express'

const router = Router()

router.get('/healthcheck', async (_req: Request, res: Response) => {
  try {
    const uptime = process.uptime()
    const hours = String(Math.floor(uptime / (60 * 60))).padStart(2, '0')
    const minutes = String(Math.floor((uptime % (60 * 60)) / 60)).padStart(2, '0')
    const seconds = String(Math.floor(uptime % 60)).padStart(2, '0')
    const uptimeString = `${hours}:${minutes}:${seconds}`

    const dateNow = new Date()

    const healthcheck = {
      uptime: uptimeString,
      message: 'OK',
      timestamp: dateNow.toLocaleString()
    }

    res.json(healthcheck)
  } catch {
    res.status(500).end()
  }
})

export default router
