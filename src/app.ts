import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import handleError from './middlewares/handleError'
import config from './config'
import authRoutes from './routes/auth'
import exampleRoutes from './routes/example'
import healthCheck from './routes/healthcheck'
import { morganErrorConfig, morganSuccessConfig } from './loggers/loggers'

const app = express()
const context = config.app.context

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(morganErrorConfig)
app.use(morganSuccessConfig)

app.use(context, authRoutes)
app.use(context, exampleRoutes)
app.use(healthCheck)

app.use(handleError)

export default app
