import { Column, DataType, ForeignKey, Model, Table, Unique } from 'sequelize-typescript';

import { Role } from './Role';
import { User } from './User';

import { IUserRole } from '@/interfaces';

@Table({
  tableName: 'user_roles',
  indexes: [
    {
      name: 'user_role_unique',
      unique: true,
      fields: ['user_id', 'role_id'],
    },
  ],
})
export class UserRole extends Model<IUserRole> {
  @Unique('user_role_unique')
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  user_id!: number;

  @Unique('user_role_unique')
  @ForeignKey(() => Role)
  @Column({ type: DataType.INTEGER })
  role_id!: number;
}
