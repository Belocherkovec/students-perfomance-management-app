import type { Group } from '@/models';

export class GroupDto {
  id: number;
  name: string;
  createdAt: Date;

  constructor(group: Group) {
    this.id = group.id;
    this.name = group.name;
    this.createdAt = group.createdAt;
  }
}
