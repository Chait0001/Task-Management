import { Router } from 'express';
import { TaskController } from '../controllers/TaskController';

const router = Router();
const taskController = new TaskController();

router.post('/tasks', taskController.createTask);
router.get('/tasks', taskController.fetchAllTasks);
router.patch('/tasks/:id/complete', taskController.completeTaskById);
router.delete('/tasks/:id', taskController.removeTask);

export default router;