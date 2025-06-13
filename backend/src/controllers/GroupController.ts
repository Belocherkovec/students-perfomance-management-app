import { Get, JsonController } from 'routing-controllers';
import { Service } from 'typedi';

import { GroupService } from '@/services';

@JsonController('/groups')
@Service()
export class GroupController {
  constructor(private groupService: GroupService) {}

  @Get()
  async getAll() {
    return this.groupService.getAllGroups();
  }
}
