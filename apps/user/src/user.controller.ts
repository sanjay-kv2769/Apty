import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { CreateChildDto } from './dto/createChild.dto';
import { UpdateChildDto } from './dto/dto/updateChild.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) { }

  // ---------- Test Microservice ----------

  @MessagePattern({ cmd: 'user_ping' })
  handleUserPing() {
    return { message: 'User microservice is online' };
  }

  // ----------Parent Child Registration----------

  @MessagePattern({ cmd: 'create_children' })
  async createChild(@Payload() data: CreateChildDto) {
    const { parentId, relationshipType } = data;

    if (!parentId || !relationshipType) {
      throw new RpcException('Parent ID and Relationship Type are required.');
    }

    return this.userService.createChild(data, parentId, relationshipType);
  }
  // ---------- Additional Child Registration----------

  @MessagePattern({ cmd: 'add_additional_child' })
  async handleAddAdditionalChild(
    @Payload() data: {
      parentId: string;
      relationshipType: string;
      childData: CreateChildDto;
    }
  ) {
    const { parentId, relationshipType, childData } = data;
    return this.userService.addAdditionalChild(childData, parentId, relationshipType);
  }

  // ------- Parent Child Update -------

  @MessagePattern({ cmd: 'update_child_by_parent' })
  updateChildByParent(@Payload() data: { childId: string; parentId: string; updates: UpdateChildDto }) {
    return this.userService.updateChildByParent(data.childId, data.parentId, data.updates);
  }

}
