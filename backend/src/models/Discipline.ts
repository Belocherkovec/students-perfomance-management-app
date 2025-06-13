import { BelongsToMany, Column, DataType, Model, Table } from 'sequelize-typescript';

import { IDiscipline } from '@/interfaces';
import { Group } from '@/models/Group';
import { GroupDisciplines } from '@/models/GroupDisciplines';

@Table({ tableName: 'disciplines' })
export class Discipline extends Model<IDiscipline> implements IDiscipline {
  @Column({ type: DataType.STRING, allowNull: false })
  name!: string;

  @BelongsToMany(() => Group, () => GroupDisciplines)
  groups!: Group[];
}
