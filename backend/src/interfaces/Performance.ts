export interface IPerformance {
  id?: string;
  group_discipline_id: number;
  creator_id: number;
  data: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}
