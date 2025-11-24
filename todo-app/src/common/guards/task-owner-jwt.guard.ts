import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RequestWithUser } from '../middlewares/user-context-middleware';

@Injectable()
export class TaskOwnerJwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<RequestWithUser>();

    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      throw new ForbiddenException('Missing Authorization header');
    }

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      throw new ForbiddenException('Authorization header is invalid');
    }

    try {
      const userData = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      req.user = {
        id: userData.id,
        role: userData.role,
      };

      return true;
    } catch (err) {
      throw new ForbiddenException('Invalid or expired token');
    }
  }
}
