import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { CreateChildDto } from './dto/createChild.dto';
import { UpdateChildDto } from './dto/dto/updateChild.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) { }

  @MessagePattern({ cmd: 'user_ping' })
  handleUserPing() {
    return { message: 'User microservice is online' };
  }

  // ----------Parent-Add Child----------
  @MessagePattern({ cmd: 'create_child' })
  async createChild(@Payload() data: CreateChildDto) {
    // Extract parentId and relationshipType from the request payload
    const { parentId, relationshipType } = data;

    if (!parentId || !relationshipType) {
      throw new RpcException('Parent ID and Relationship Type are required.');
    }
    
    return this.userService.createChild(data, parentId, relationshipType);
  }

  @MessagePattern({ cmd: 'update_child_by_parent' })
  updateChildByParent(@Payload() data: { childId: string; parentId: string; updates: UpdateChildDto }) {
    return this.userService.updateChildByParent(data.childId, data.parentId, data.updates);
  }

  @MessagePattern({ cmd: 'update_child_by_self' })
  updateChildBySelf(@Payload() data: { childId: string; updates: UpdateChildDto }) {
    return this.userService.updateChildBySelf(data.childId, data.updates);
  }

}
