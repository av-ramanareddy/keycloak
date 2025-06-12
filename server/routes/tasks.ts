import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '../types/task.js';
import { validateTask } from '../middleware/validation.js';
import { AuthenticatedRequest, authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// In-memory storage (replace with database in production)
let tasks: Task[] = [
  {
    id: uuidv4(),
    title: 'Welcome to TaskFlow',
    description: 'This is your first task. Click to mark it as complete!',
    completed: false,
    priority: 'medium',
    userId: 'demo-user',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    title: 'Explore the Features',
    description: 'Try creating, editing, and organizing your tasks',
    completed: false,
    priority: 'high',
    userId: 'demo-user',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Apply authentication to all task routes
router.use(authenticateToken);

// GET /api/tasks - Get all tasks for the authenticated user
router.get('/', (req: AuthenticatedRequest, res) => {
  const { completed, priority } = req.query;
  const userId = req.user?.id;
  
  if (!userId) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  let filteredTasks = tasks.filter(task => task.userId === userId);
  
  if (completed !== undefined) {
    const isCompleted = completed === 'true';
    filteredTasks = filteredTasks.filter(task => task.completed === isCompleted);
  }
  
  if (priority && typeof priority === 'string') {
    filteredTasks = filteredTasks.filter(task => task.priority === priority);
  }
  
  // Sort by creation date (newest first)
  filteredTasks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  
  res.json(filteredTasks);
});

// GET /api/tasks/:id - Get a specific task
router.get('/:id', (req: AuthenticatedRequest, res) => {
  const userId = req.user?.id;
  const task = tasks.find(t => t.id === req.params.id && t.userId === userId);
  
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  res.json(task);
});

// POST /api/tasks - Create a new task
router.post('/', validateTask, (req: AuthenticatedRequest, res) => {
  const { title, description, priority = 'medium' }: CreateTaskRequest = req.body;
  const userId = req.user?.id;
  
  if (!userId) {
    return res.status(401).json({ error: 'User not authenticated' });
  }
  
  const newTask: Task = {
    id: uuidv4(),
    title: title.trim(),
    description: description?.trim(),
    completed: false,
    priority,
    userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  tasks.push(newTask);
  
  res.status(201).json(newTask);
});

// PUT /api/tasks/:id - Update a task
router.put('/:id', validateTask, (req: AuthenticatedRequest, res) => {
  const userId = req.user?.id;
  const taskIndex = tasks.findIndex(t => t.id === req.params.id && t.userId === userId);
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  const { title, description, completed, priority }: UpdateTaskRequest = req.body;
  const existingTask = tasks[taskIndex];
  
  const updatedTask: Task = {
    ...existingTask,
    title: title?.trim() ?? existingTask.title,
    description: description?.trim() ?? existingTask.description,
    completed: completed ?? existingTask.completed,
    priority: priority ?? existingTask.priority,
    updatedAt: new Date(),
  };
  
  tasks[taskIndex] = updatedTask;
  
  res.json(updatedTask);
});

// PATCH /api/tasks/:id/toggle - Toggle task completion
router.patch('/:id/toggle', (req: AuthenticatedRequest, res) => {
  const userId = req.user?.id;
  const taskIndex = tasks.findIndex(t => t.id === req.params.id && t.userId === userId);
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  tasks[taskIndex] = {
    ...tasks[taskIndex],
    completed: !tasks[taskIndex].completed,
    updatedAt: new Date(),
  };
  
  res.json(tasks[taskIndex]);
});

// DELETE /api/tasks/:id - Delete a task
router.delete('/:id', (req: AuthenticatedRequest, res) => {
  const userId = req.user?.id;
  const taskIndex = tasks.findIndex(t => t.id === req.params.id && t.userId === userId);
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  const deletedTask = tasks[taskIndex];
  tasks.splice(taskIndex, 1);
  
  res.json({ message: 'Task deleted successfully', task: deletedTask });
});

// DELETE /api/tasks - Delete all completed tasks for the user
router.delete('/', (req: AuthenticatedRequest, res) => {
  const userId = req.user?.id;
  const userTasks = tasks.filter(task => task.userId === userId);
  const completedTasks = userTasks.filter(task => task.completed);
  
  tasks = tasks.filter(task => task.userId !== userId || !task.completed);
  
  res.json({ 
    message: `${completedTasks.length} completed tasks deleted`,
    deletedCount: completedTasks.length 
  });
});

export { router as taskRouter };