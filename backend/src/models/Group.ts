import { BelongsToMany, Column, DataType, Model, Table } from 'sequelize-typescript';

import { IGroup } from '@/interfaces';
import { Discipline } from '@/models/Discipline';
import { GroupDisciplines } from '@/models/GroupDisciplines';

@Table({ tableName: 'groups' })
export class Group extends Model<IGroup> implements IGroup {
  @Column({ type: DataType.STRING, allowNull: false })
  name!: string;

  @BelongsToMany(() => Discipline, () => GroupDisciplines)
  disciplines!: Discipline[];
}
