import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.enity';
import { LoggerService } from 'src/shared/logger/logger.service';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(private readonly logger: LoggerService) {}

  onModuleInit() {
    console.log('UsersService initialized');
  }
  private users: User[] = [];

  findAll(): User[] {
    return this.users;
  }

  create(dto: CreateUserDto): User {
    const user: User = {
      userName: dto.userName,
      email: dto.email,
    };
    this.users.push(user);
    this.logger.log('Пользователь создан');
    return user;
  }
}
