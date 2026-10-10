import express from 'express'
import cors from 'cors'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'
import taskRoutes from './routes/taskRoutes.js'

const app = express()

app.use(cors({
  origin: 'https://taskflow-sx8j.onrender.com',
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}))
app.use(express.json({ limit: '10kb' }))
app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' })
})
app.use('/api/tasks', taskRoutes)
app.use(notFoundHandler)
app.use(errorHandler)

export default app
