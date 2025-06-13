import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateRoleDto {
  @IsString({ message: 'Название роли должно быть строкой' })
  @IsNotEmpty({ message: 'Название роли обязательно' })
  @MaxLength(50, { message: 'Название роли не должно превышать 50 символов' })
  name!: string;
}
