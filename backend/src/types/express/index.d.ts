import { User } from '../../controllers/activityLogController';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id?: number;
        role?: string;
        [key: string]: any;
      };
      sessionID?: string;
    }
  }
}