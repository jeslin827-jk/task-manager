import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required.'],
      trim: true,
      maxlength: [120, 'Task titles must be 120 characters or fewer.'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Descriptions must be 500 characters or fewer.'],
      default: '',
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
)

export default mongoose.model('Task', taskSchema)
