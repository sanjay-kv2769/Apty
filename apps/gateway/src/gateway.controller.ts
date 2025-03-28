import { Controller, Get, Inject } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';

@Controller('gateway')
export class GatewayController {

  constructor(
    private readonly gatewayService: GatewayService,
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy
  ) { }


  @Get()
  getHello(): string {
    return this.gatewayService.getHello();
  }

  @Get('test')
  testGateway() {
    return { message: 'Gateway Service is running!' };
  }

  @Get('ping/auth')
  async pingAuth() {
    return this.authClient.send({ cmd: 'auth_ping' }, {});
  }

  @Get('ping/user')
  async pingUser() {
    return this.userClient.send({ cmd: 'user_ping' }, {});
  }

}
