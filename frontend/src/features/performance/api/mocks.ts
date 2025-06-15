import type { PerformanceTable, GroupDiscipline, PerformanceColumn, PerformanceRow, Student } from '../model/types';

// Мокированные студенты
export const mockStudents: Student[] = [
  { id: 1, name: "Иван", surname: "Иванов", patronymic: "Иванович" },
  { id: 2, name: "Мария", surname: "Петрова", patronymic: "Сергеевна" },
  { id: 3, name: "Алексей", surname: "Сидоров", patronymic: "Петрович" },
];

// Мокированные связи групп и дисциплин
export const mockGroupDisciplines: GroupDiscipline[] = [
  { id: 1, groupId: 1, disciplineId: 1, groupName: "ИСТ-101", disciplineName: "Математика" },
  { id: 2, groupId: 2, disciplineId: 2, groupName: "ПИ-202", disciplineName: "Программирование" },
];

// Генератор моковых таблиц успеваемости
export const generateMockPerformanceTables = (): PerformanceTable[] => {
  return mockGroupDisciplines.map((gd ) => {
    const columns: PerformanceColumn[] = [
      { id: `col-${gd.id}-1`, date: new Date(Date.now() - 86400000 * 3).toISOString(), type: 'attendance' },
      { id: `col-${gd.id}-2`, date: new Date(Date.now() - 86400000 * 2).toISOString(), type: 'simple' },
      { id: `col-${gd.id}-3`, date: new Date(Date.now() - 86400000 * 1).toISOString(), type: 'complex' },
    ];

    const rows: PerformanceRow[] = mockStudents.map(student => ({
      student,
      cells: columns.map(column => ({
        columnId: column.id,
        value: column.type === 'attendance'
          ? Math.round(Math.random())
          : column.type === 'simple'
            ? Math.floor(Math.random() * 4) + 2
            : Math.floor(Math.random() * 101)
      }))
    }));

    // Рассчитываем средний балл
    rows.forEach(row => {
      const values = row.cells
        .filter(cell => cell.value !== null)
        .map(cell => {
          if (columns.find(c => c.id === cell.columnId)?.type === 'attendance') {
            return cell.value ? 100 : 0;
          }
          return cell.value!;
        });

      if (values.length > 0) {
        row.average = Math.round(values.reduce((sum, val) => sum + val, 0) / values.length);
      }
    });

    return {
      id: `table-${gd.id}`,
      groupId: gd.groupId,
      disciplineId: gd.disciplineId,
      creatorId: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      columns,
      rows
    };
  });
};