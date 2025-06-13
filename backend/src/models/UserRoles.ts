import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';

import { IUserRoles } from '@/interfaces';
import { Role } from '@/models/Role';
import { User } from '@/models/User';

@Table
export class UserRoles extends Model<IUserRoles> {
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  user_id!: number;

  @ForeignKey(() => Role)
  @Column({ type: DataType.INTEGER })
  role_id!: number;
}
