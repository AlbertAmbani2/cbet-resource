import { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
  trainerId?: string;
}

export function requireTrainerAuth(req: Request, res: Response, next: NextFunction): void {
  const trainerId = req.headers['x-trainer-id'] as string | undefined;

  if (!trainerId || typeof trainerId !== 'string' || trainerId.trim().length === 0) {
    res.status(401).json({ error: 'Unauthorized: x-trainer-id header is required' });
    return;
  }

  (req as AuthRequest).trainerId = trainerId;
  next();
}

export function requireTrainerOwnership(req: Request, res: Response, next: NextFunction): void {
  const authTrainerId = (req as AuthRequest).trainerId;
  const targetTrainerId = req.params.id;

  if (!authTrainerId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  if (authTrainerId !== targetTrainerId) {
    res.status(403).json({ error: 'Forbidden: trainer may only modify their own profile' });
    return;
  }

  next();
}
