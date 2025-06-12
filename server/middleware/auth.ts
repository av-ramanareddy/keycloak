import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    preferred_username: string;
  };
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    // In production, you would verify with Keycloak's public key
    // For development, we'll decode without verification
    const decoded = jwt.decode(token) as any;
    
    if (!decoded) {
      return res.status(403).json({ error: 'Invalid token' });
    }

    req.user = {
      id: decoded.sub,
      email: decoded.email,
      name: decoded.name || decoded.preferred_username,
      preferred_username: decoded.preferred_username
    };

    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(403).json({ error: 'Invalid token' });
  }
};

export const optionalAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      const decoded = jwt.decode(token) as any;
      if (decoded) {
        req.user = {
          id: decoded.sub,
          email: decoded.email,
          name: decoded.name || decoded.preferred_username,
          preferred_username: decoded.preferred_username
        };
      }
    } catch (error) {
      console.error('Optional auth error:', error);
    }
  }

  next();
};