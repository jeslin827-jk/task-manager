import { Router } from 'express'
import { createTask, deleteTask, getTasks, updateTask } from '../controllers/taskController.js'

const router = Router()

router.route('/').get(getTasks).post(createTask)
router.route('/:id').patch(updateTask).delete(deleteTask)

export default router
