import { Body, Get, JsonController, Post } from 'routing-controllers';
import { Service } from 'typedi';

import { CreateDisciplineDto, DisciplineDto } from '@/dtos/DisciplineDtos';
import { DisciplineService } from '@/services/DisciplineService';

@JsonController('/disciplines')
@Service()
export class DisciplineController {
  constructor(private service: DisciplineService) {}

  @Get()
  async getAll(): Promise<DisciplineDto[]> {
    return this.service.getAllDisciplines();
  }

  @Post()
  async createDiscipline(@Body() data: CreateDisciplineDto) {
    return this.service.createDiscipline(data);
  }
}
