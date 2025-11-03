import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.enity';

@Injectable()
export class UsersService implements OnModuleInit {
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
    return user;
  }
}
