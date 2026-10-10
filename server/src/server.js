import 'dotenv/config'
import app from './app.js'
import { connectToDatabase } from './config/database.js'

const port = Number(process.env.PORT) || 5000

try {
  await connectToDatabase(process.env.MONGODB_URI)
  app.listen(port, () => {
    console.log(`Task Manager API listening on port ${port}`)
  })
} catch (error) {
  console.error(`Could not start the API: ${error.message}`)
  process.exitCode = 1
}
