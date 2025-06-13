import { Column, DataType, Model, Table } from 'sequelize-typescript';

import { IGroup } from '@/interfaces';

@Table
export class Group extends Model<IGroup> implements IGroup {
  @Column({ type: DataType.STRING, allowNull: false })
  name!: string;
}
