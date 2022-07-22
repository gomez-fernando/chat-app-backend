import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { Request, Response } from 'express';


@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly auth: AuthService) {}
  use(req: Request, res: Response, next: () => void) {
    const token = req.get('Authorization').substring(7);
    const tokenData = this.auth.validateToken(token);
    if (typeof tokenData === 'string')
      throw new UnauthorizedException('Session expired');
    next();
  }
}



