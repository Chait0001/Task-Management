import { Router } from 'express';
import { TaskController } from '../controllers/TaskController';
import { FocusController } from '../controllers/FocusController';
import { DependencyController } from '../controllers/DependencyController';
import { ProjectModel } from '../models/Project';
import { TagModel } from '../models/Tag';

const router = Router();
const taskController = new TaskController();
const focusController = new FocusController();
const dependencyController = new DependencyController();

// Task Routes
router.post('/tasks', taskController.createTask);
router.get('/tasks', taskController.fetchAllTasks);
router.patch('/tasks/:id/complete', taskController.completeTaskById);
router.put('/tasks/:id', taskController.updateTask);
router.patch('/tasks/:id/status', taskController.updateTaskStatus);
router.delete('/tasks/:id', taskController.removeTask);

// Stats Route
router.get('/stats', taskController.getStats);

// Focus Routes
router.post('/focus/start', focusController.startSession);
router.patch('/focus/:id/complete', focusController.completeSession);
router.patch('/focus/:id/abandon', focusController.abandonSession);
router.get('/focus/productivity', focusController.getProductivityScore);
router.get('/focus/task/:taskId/pomodoros', focusController.getTaskPomodoros);

// Dependency Routes
router.post('/tasks/:id/dependencies', dependencyController.addDependency);
router.delete('/tasks/:id/dependencies', dependencyController.removeDependency);
router.get('/tasks/:id/dependencies/check', dependencyController.checkCycle);

// Project Routes
router.get('/projects', async (_req, res) => {
    const projects = await ProjectModel.find();
    res.json(projects);
});

// Tag Routes
router.get('/tags', async (_req, res) => {
    const tags = await TagModel.find();
    res.json(tags);
});
router.post('/tags', async (req, res) => {
    const tag = new TagModel(req.body);
    await tag.save();
    res.json(tag);
});

// Auth Routes (Fake/Placeholder)
// TODO: Replace with real JWT auth
router.post('/auth/login', (_req, res) => res.json({ message: 'Auth coming soon', token: 'fake-token' }));
router.post('/auth/register', (_req, res) => res.json({ message: 'Auth coming soon' }));

export default router;