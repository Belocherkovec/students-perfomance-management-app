import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';

import { Discipline } from './Discipline';
import { Group } from './Group';

import { IGroupDisciplines } from '@/interfaces';

@Table
export class GroupDisciplines extends Model<IGroupDisciplines> {
  @ForeignKey(() => Group)
  @Column({ type: DataType.INTEGER })
  group_id!: number;

  @ForeignKey(() => Discipline)
  @Column({ type: DataType.INTEGER })
  discipline_id!: number;
}
