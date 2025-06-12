import { Request, Response, NextFunction } from 'express';

export const validateTask = (req: Request, res: Response, next: NextFunction) => {
  const { title, priority } = req.body;
  
  if (req.method === 'POST' && (!title || typeof title !== 'string' || title.trim().length === 0)) {
    return res.status(400).json({ error: 'Title is required and must be a non-empty string' });
  }
  
  if (req.method === 'PUT' && title && (typeof title !== 'string' || title.trim().length === 0)) {
    return res.status(400).json({ error: 'Title must be a non-empty string' });
  }
  
  if (priority && !['low', 'medium', 'high'].includes(priority)) {
    return res.status(400).json({ error: 'Priority must be one of: low, medium, high' });
  }
  
  next();
};