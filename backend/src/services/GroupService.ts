import { Service } from 'typedi';

import { CreateGroupDto, GroupDto } from '@/dtos/GroupDtos';
import { GroupRepository } from '@/repositories';

@Service()
export class GroupService {
  constructor(private groupRepository: GroupRepository) {}

  async getAllGroups() {
    const groups = await this.groupRepository.getAll();
    return groups.map((group) => new GroupDto(group));
  }

  async createGroup(data: CreateGroupDto) {
    const group = await this.groupRepository.create(data);
    return new GroupDto(group);
  }

  async addDiscipline(groupId: number, disciplineId: number) {
    await this.groupRepository.addDiscipline(groupId, disciplineId);
    return { success: true };
  }
}
