import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthenticationService } from './authentication.service';

@Controller()
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) { }

  @Get()
  getHello(): string {
    return this.authService.getHello();
  }

  @Get('test')
  testAuth() {
    return { message: 'Authentication Service is running!' };
  }

  @MessagePattern({ cmd: 'auth_ping' })
  handleAuthPing() {
    return { message: 'Auth microservice is online' };
  }

}
