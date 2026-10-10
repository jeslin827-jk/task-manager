import Task from '../models/Task.js'
import { validateTaskInput } from '../utils/validateTask.js'

export async function getTasks(_request, response) {
  const tasks = await Task.find().sort({ createdAt: -1 })
  response.json({ data: tasks })
}

export async function createTask(request, response) {
  const { error, values } = validateTaskInput(request.body)
  if (error) {
    response.status(400).json({ message: error })
    return
  }

  const task = await Task.create(values)
  response.status(201).json({ data: task })
}

export async function updateTask(request, response) {
  const { error, values } = validateTaskInput(request.body, { partial: true })
  if (error) {
    response.status(400).json({ message: error })
    return
  }

  const task = await Task.findByIdAndUpdate(request.params.id, values, {
    new: true,
    runValidators: true,
  })
  if (!task) {
    response.status(404).json({ message: 'Task not found.' })
    return
  }

  response.json({ data: task })
}

export async function deleteTask(request, response) {
  const task = await Task.findByIdAndDelete(request.params.id)
  if (!task) {
    response.status(404).json({ message: 'Task not found.' })
    return
  }

  response.status(204).end()
}
