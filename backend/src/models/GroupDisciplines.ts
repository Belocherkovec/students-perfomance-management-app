import { Column, DataType, ForeignKey, Model, Table, Unique } from 'sequelize-typescript';

import { Discipline } from './Discipline';
import { Group } from './Group';

import { IGroupDisciplines } from '@/interfaces';

@Table({
  tableName: 'group_disciplines',
  indexes: [
    {
      name: 'group_disciplines_unique',
      unique: true,
      fields: ['group_id', 'discipline_id'],
    },
  ],
})
export class GroupDisciplines extends Model<IGroupDisciplines> {
  @Unique('group_disciplines_unique')
  @ForeignKey(() => Group)
  @Column({ type: DataType.INTEGER })
  group_id!: number;

  @Unique('group_disciplines_unique')
  @ForeignKey(() => Discipline)
  @Column({ type: DataType.INTEGER })
  discipline_id!: number;
}
