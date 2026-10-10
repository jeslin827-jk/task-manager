import mongoose from 'mongoose'

export async function connectToDatabase(uri) {
  if (!uri) {
    throw new Error('MONGODB_URI is required. Copy server/.env.example to server/.env and set it.')
  }

  await mongoose.connect(uri)
  console.log('Connected to MongoDB')
}
