import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

import { Discipline } from '@/models';

export class CreateDisciplineDto {
  @IsString({ message: 'Название дисциплины должно быть строкой' })
  @IsNotEmpty({ message: 'Название дисциплины обязательно' })
  @MaxLength(50, { message: 'Название дисциплины не должно превышать 50 символов' })
  name!: string;
}

export class DisciplineDto {
  id: number;
  name: string;

  constructor(discipline: Discipline) {
    this.id = discipline.id;
    this.name = discipline.name;
  }
}
