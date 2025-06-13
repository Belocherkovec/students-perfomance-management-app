import { Column, DataType, Model, Table } from 'sequelize-typescript';

import { IRole } from '@/interfaces';

@Table
export class Role extends Model<IRole> implements IRole {
  @Column({ type: DataType.STRING, allowNull: false })
  name!: string;
}
