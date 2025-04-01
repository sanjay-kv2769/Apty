import { BadRequestException, Body, Controller, Get, Inject, InternalServerErrorException, Param, Patch, Post } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';

@Controller('gateway')
export class GatewayController {

  constructor(
    private readonly gatewayService: GatewayService,
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy
  ) { }

  // =============== Authentication Service ===============
  @Get('ping/auth')
  async pingAuth() {
    return this.authClient.send({ cmd: 'auth_ping' }, {});
  }

  @Post('send-otp')
  async sendOtp(@Body('phoneNumber') phoneNumber: string) {
    return this.authClient.send({ cmd: 'send_otp' }, { phoneNumber }).toPromise();
  }

  @Post('verify-otp')
  async verifyOtp(@Body() data: { phoneNumber: string; otpCode: string }) {
    return this.authClient.send({ cmd: 'verify_otp' }, data).toPromise();
  }

  @Post('firebase/signin')
  async firebaseSignIn(@Body('idToken') idToken: string) {
    return this.authClient.send({ cmd: 'firebase_signin' }, { idToken }).toPromise();
  }

  // =============== User Service ===============

  // ----------*** Child Management ***----------
  @Post('children')
  async createChild(@Body() childData: any) {
    return this.userClient.send({ cmd: 'create_child' }, childData).toPromise();
  }
  // ------- Parent-based Child Update -------
  @Patch('parents/:parentId/children/:childId')
  async updateChildByParent(
    @Param('parentId') parentId: string,
    @Param('childId') childId: string,
    @Body() updates: any
  ) {
    try {
      return await this.userClient
        .send({ cmd: 'update_child_by_parent' }, { parentId, childId, updates })
        .toPromise();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Patch('children/:childId')
  async updateChildBySelf(
    @Param('childId') childId: string,
    @Body() updates: any
  ) {
    try {
      return await this.userClient
        .send({ cmd: 'update_child_by_self' }, { childId, updates })
        .toPromise();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }


}
