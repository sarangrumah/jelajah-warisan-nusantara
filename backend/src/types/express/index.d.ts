export {};

declare global {
  namespace Express {
    interface Request {
      user?: {
        id?: string | number;
        email?: string;
        role?: string;
        roles?: string[];
        [key: string]: any;
      };
      sessionID?: string;
    }
  }
}