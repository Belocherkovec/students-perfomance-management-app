import { Column, DataType, Model, Table } from 'sequelize-typescript';

import { IDiscipline } from '@/interfaces';

@Table
export class Discipline extends Model<IDiscipline> implements IDiscipline {
  @Column({ type: DataType.STRING, allowNull: false })
  name!: string;
}
