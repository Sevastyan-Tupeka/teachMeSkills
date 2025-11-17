import { Inject, Injectable } from '@nestjs/common';
import { AUTH_OPTIONS, type AuthModuleOptions } from './auth.module';

@Injectable()
export class AuthService {
  constructor(@Inject(AUTH_OPTIONS) private readonly opts: AuthModuleOptions) {}

  issueToken(userId: string): string {
    const prefix = this.opts.tokenPrefix ?? 'Bearer';
    const payload = Buffer.from(`${userId}:${this.opts.secret}`).toString(
      'base64',
    );

    return `${prefix} ${payload}`;
  }

  verifyToken(token: string): string {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_prefix, encoded] = token.split(' ');
    const decoded = Buffer.from(encoded, 'base64').toString('utf8');
    //userId: secret
    const [userId, secret] = decoded.split(':');

    if (secret !== this.opts.secret) {
      throw new Error('invalid token');
    }
    return userId;
  }
}
