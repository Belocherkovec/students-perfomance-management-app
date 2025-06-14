export interface Discipline {
  id: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateDisciplineData {
  name: string;
}