import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

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

export class CreateGroupDto {
  @IsString({ message: 'Название группы должно быть строкой' })
  @IsNotEmpty({ message: 'Название группы обязательно' })
  @MaxLength(50, { message: 'Название группы не должно превышать 50 символов' })
  name!: string;
}
