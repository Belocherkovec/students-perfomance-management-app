import { BelongsToMany, Column, DataType, Model, Table } from 'sequelize-typescript';

import { User } from './User';
import { UserRole } from './UserRole';

import { IRole } from '@/interfaces';

@Table({ tableName: 'roles' })
export class Role extends Model<IRole> implements IRole {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      len: [2, 50],
    },
  })
  name!: string;

  @BelongsToMany(() => User, () => UserRole)
  users!: User[];
}
