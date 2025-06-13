import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';

import { GroupDisciplines } from './GroupDisciplines';
import { User } from './User';

import { IPerformance } from '@/interfaces';

@Table({ tableName: 'performance' })
export class Performance extends Model<IPerformance> implements IPerformance {
  @ForeignKey(() => GroupDisciplines)
  @Column({ type: DataType.INTEGER })
  group_discipline_id!: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  creator_id!: number;

  @Column({ type: DataType.JSONB })
  data!: Record<string, any>;
}
