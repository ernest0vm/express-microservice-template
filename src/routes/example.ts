import { Router } from 'express'
import ExampleController from '../controllers/ExampleController'
import { isAuth } from '../middlewares/auth'
import { validateName } from '../middlewares/validations'

const api = Router()

api.get('/examples', ExampleController.list)
api.post('/examples', [isAuth, validateName], ExampleController.create)

export default api
