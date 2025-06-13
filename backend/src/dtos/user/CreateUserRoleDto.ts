import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateUserRoleDto {
  @IsNumber({}, { message: 'id пользователя должен быть в числовом формате' })
  @IsNotEmpty({ message: 'id пользователя должен быть указан' })
  userId!: number;

  @IsNumber({}, { message: 'id роли должен быть в числовом формате' })
  @IsNotEmpty({ message: 'id роли должен быть указан' })
  roleId!: number;
}
