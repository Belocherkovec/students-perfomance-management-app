import { Service } from 'typedi';

import { CreateRoleDto, RoleDto } from '@/dtos';
import { DisciplineDto } from '@/dtos/DisciplineDtos';
import { DisciplineRepository } from '@/repositories/DisciplineRepository';

@Service()
export class DisciplineService {
  constructor(private repository: DisciplineRepository) {}

  async getAllDisciplines(): Promise<RoleDto[]> {
    const disciplines = await this.repository.getDisciplines();
    return disciplines.map((discipline) => new DisciplineDto(discipline));
  }

  async createDiscipline(data: CreateRoleDto): Promise<RoleDto> {
    const discipline = await this.repository.addDiscipline(data);
    return new DisciplineDto(discipline);
  }
}
