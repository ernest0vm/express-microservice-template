import { Request, Response, NextFunction } from 'express'
import prisma from '../lib/prisma'

class ExampleController {
  static async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await prisma.example.findMany({
        orderBy: { id: 'asc' }
      })

      res.status(200).send({
        data
      })
    } catch (err) {
      next(err)
    }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name } = req.body

      const item = await prisma.example.create({
        data: { name }
      })

      res.status(201).send(item)
    } catch (err) {
      next(err)
    }
  }
}

export default ExampleController
