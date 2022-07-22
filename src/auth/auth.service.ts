import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  createToken(id: string) {
    try {
      const secret = process.env.SECRET;
      return jwt.sign({ id }, secret, { expiresIn: '100h' });
    } catch (ex) {
      throw new UnauthorizedException('Not authorized');
    }
  }

  validateToken(token: string) {
    try {
      const secret = process.env.SECRET;
      return jwt.verify(token, secret);
    } catch (ex) {
      throw new UnauthorizedException('Not authorized');
    }
  }
}
