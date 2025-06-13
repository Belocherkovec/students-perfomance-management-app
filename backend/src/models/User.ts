import {
  BelongsToMany,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

import { Group } from './Group';
import { Role } from './Role';
import { UserRole } from './UserRole';

import { IUser } from '@/interfaces';

@Table({ tableName: 'users' })
export class User extends Model<IUser> implements IUser {
  @Column({ type: DataType.STRING, allowNull: false })
  name!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  surname!: string;

  @Column({ type: DataType.STRING })
  patronymic?: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  login!: string;

  @Column({ type: DataType.STRING })
  email?: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password!: string;

  @ForeignKey(() => Group)
  @Column({ type: DataType.INTEGER })
  group_id!: number;

  @Default(false)
  @Column({ type: DataType.BOOLEAN, allowNull: false })
  is_blocked!: boolean;

  @BelongsToMany(() => Role, () => UserRole)
  roles!: Role[];

  @Column({
    type: DataType.VIRTUAL,
    get(this: User) {
      return this.roles?.map((role) => role.name) || [];
    },
    set() {
      throw new Error('Do not try to set the `roleNames` value!');
    },
  })
  rolesList!: string[];
}
