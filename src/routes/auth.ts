import { Router } from 'express'
import AuthController from '../controllers/AuthController'
import { validateCredentials } from '../middlewares/validations'

const api = Router()

api.post('/auth/token', [validateCredentials], AuthController.token)

export default api
