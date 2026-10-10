import express from 'express'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'
import taskRoutes from './routes/taskRoutes.js'

const app = express()

app.use(express.json({ limit: '10kb' }))
app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' })
})
app.use('/api/tasks', taskRoutes)
app.use(notFoundHandler)
app.use(errorHandler)

export default app
