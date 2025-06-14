import { Service } from 'typedi';

import { GroupDto } from '@/dtos/GroupDtos';
import { GroupRepository } from '@/repositories';

@Service()
export class GroupService {
  constructor(private groupRepository: GroupRepository) {}

  async getAllGroups() {
    const groups = await this.groupRepository.getAll();
    return groups.map((group) => new GroupDto(group));
  }
}
