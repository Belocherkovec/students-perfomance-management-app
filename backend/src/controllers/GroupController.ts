import { Body, Get, JsonController, Post } from 'routing-controllers';
import { Service } from 'typedi';

import { CreateGroupDto } from '@/dtos/GroupDtos';
import { GroupService } from '@/services';

@JsonController('/groups')
@Service()
export class GroupController {
  constructor(private groupService: GroupService) {}

  @Get()
  async getAll() {
    return this.groupService.getAllGroups();
  }

  @Post()
  async create(@Body() data: CreateGroupDto) {
    return this.groupService.createGroup(data);
  }

  @Post('/discipline')
  async addDiscipline(@Body() data: { groupId: number; disciplineId: number }) {
    return this.groupService.addDiscipline(data.groupId, data.disciplineId);
  }
}
