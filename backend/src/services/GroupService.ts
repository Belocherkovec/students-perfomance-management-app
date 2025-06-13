import { Service } from 'typedi';

import { GroupRepository } from '@/repositories';

@Service()
export class GroupService {
  constructor(private groupRepository: GroupRepository) {}

  async getAllGroups() {
    const groups = await this.groupRepository.getAll();
    return groups;
  }
}
