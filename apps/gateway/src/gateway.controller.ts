import { BadRequestException, Body, Controller, Get, Headers, Inject, InternalServerErrorException, Param, Patch, Post } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { CreateChildDto } from 'apps/user/src/dto/createChild.dto';

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
  // ----------Send OTP----------

  @Post('send/otp')
  async sendOtp(@Body('phoneNumber') phoneNumber: string) {
    return this.authClient.send({ cmd: 'send_otp' }, { phoneNumber }).toPromise();
  }
  // ----------Verify OTP----------

  @Post('verify/otp')
  async verifyOtp(@Body() data: { phoneNumber: string; otpCode: string }) {
    return this.authClient.send({ cmd: 'verify_otp' }, data).toPromise();
  }
  // ----------Verify Firebase Token----------

  @Post('firebase/signin')
  async firebaseSignIn(@Headers('Authorization') authorization: string) {
    const token = authorization?.replace('Bearer ', '');
    if (!token) {
      throw new InternalServerErrorException('Token not provided');
    }
    return this.authClient.send({ cmd: 'firebase_signin' }, { idToken: token }).toPromise();
  }
  // =============== User Service ===============

  // ----------*** Child Management ***----------
  // ----------Parent Child Registration----------
  @Post('user/parents/register')
  async createChild(@Body() childData: CreateChildDto) {
    return this.userClient.send({ cmd: 'create_children' }, childData).toPromise();
  }

  // ---------- Additional Child Registration----------
  @Post('user/parents/add/children')
  async addAdditionalChild(
    @Body() body: {
      parentId: string;
      relationshipType: string;
      childData: CreateChildDto;
    }
  ) {
    const { parentId, relationshipType, childData } = body;
    if (!parentId || !relationshipType || !childData?.fullName) {
      throw new BadRequestException('Missing required fields');
    }
    try {
      return await this.userClient
        .send({ cmd: 'add_additional_child' }, { parentId, relationshipType, childData })
        .toPromise();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // ------- Parent Child Update -------
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

}
