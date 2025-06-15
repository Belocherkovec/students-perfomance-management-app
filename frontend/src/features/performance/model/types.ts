export interface Student {
  id: number;
  name: string;
  surname: string;
  patronymic: string | null;
}

export interface PerformanceColumn {
  id: string;
  date: string; // ISO дата
  type: 'attendance' | 'simple' | 'complex';
  title?: string;
}

export interface PerformanceCell {
  columnId: string;
  value: number | null;
}

export interface PerformanceRow {
  student: Student;
  cells: PerformanceCell[];
  average?: number;
}

export interface PerformanceTable {
  id: string;
  groupId: number;
  disciplineId: number;
  creatorId: number;
  createdAt: string;
  updatedAt: string;
  columns: PerformanceColumn[];
  rows: PerformanceRow[];
}

export interface GroupDiscipline {
  id: number;
  groupId: number;
  disciplineId: number;
  groupName: string;
  disciplineName: string;
}