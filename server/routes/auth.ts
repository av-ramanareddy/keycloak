import express from 'express';
import { AuthenticatedRequest, authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get current user info
router.get('/user', authenticateToken, (req: AuthenticatedRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  res.json({
    id: req.user.id,
    email: req.user.email,
    name: req.user.name,
    username: req.user.preferred_username
  });
});

// Logout endpoint
router.post('/logout', (req, res) => {
  // In a real implementation, you might want to invalidate the token
  // For now, we'll just return success as the client will handle token removal
  res.json({ message: 'Logged out successfully' });
});

export { router as authRouter };