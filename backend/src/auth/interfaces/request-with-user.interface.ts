import { Request as ExpressRequest } from 'express';

export interface UserPayload {
  id: number;
  username: string;
}

export interface RequestWithUser extends ExpressRequest {
  user: UserPayload;
}
