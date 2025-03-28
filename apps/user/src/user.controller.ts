import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getHello(): string {
    return this.userService.getHello();
  }

  @Get('test')
  testUser() {
    return { message: 'User Service is running!' };
  }

  @MessagePattern({ cmd: 'user_ping' })
  handleUserPing() {
    return { message: 'User microservice is online' };
  }

}
