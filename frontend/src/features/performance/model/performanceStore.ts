import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { PerformanceTable, GroupDiscipline, PerformanceColumn } from './types';
import { generateMockPerformanceTables, mockGroupDisciplines, mockStudents } from '../api/mocks';

interface PerformanceState {
  tables: PerformanceTable[];
  groupDisciplines: GroupDiscipline[];
  currentTable: PerformanceTable | null;
  isLoading: boolean;
  error: string | null;

  // Действия
  loadTables: () => void;
  createTable: (groupId: number, disciplineId: number) => void;
  updateTable: (table: PerformanceTable) => void;
  deleteTable: (id: string) => void;
  setCurrentTable: (id: string | null) => void;
  updateCellValue: (rowIndex: number, columnId: string, value: number | null) => void;
  addColumn: (type: 'attendance' | 'simple' | 'complex') => void;
  removeColumn: (columnId: string) => void;
}

export const usePerformanceStore = create<PerformanceState>()(
  immer((set) => ({
    tables: [],
    groupDisciplines: mockGroupDisciplines,
    currentTable: null,
    isLoading: false,
    error: null,

    loadTables: () => {
      set({ isLoading: true });
      try {
        const tables = generateMockPerformanceTables();
        set({ tables, isLoading: false });
      } catch (error) {
        set({ error: 'Ошибка загрузки таблиц', isLoading: false });
      }
    },

    createTable: (groupId, disciplineId) => {
      set(state => {
        state.isLoading = true;
        try {
          const groupDiscipline = state.groupDisciplines.find(
            gd => gd.groupId === groupId && gd.disciplineId === disciplineId
          );

          if (!groupDiscipline) {
            throw new Error('Группа или дисциплина не найдена');
          }

          const newTable: PerformanceTable = {
            id: `table-${Date.now()}`,
            groupId,
            disciplineId,
            creatorId: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            columns: [],
            rows: mockStudents.map(student => ({
              student,
              cells: []
            }))
          };

          state.tables.push(newTable);
          state.currentTable = newTable;
          state.isLoading = false;
        } catch (error) {
          state.error = 'Ошибка создания таблицы';
          state.isLoading = false;
        }
      });
    },

    updateTable: (table) => {
      set(state => {
        const index = state.tables.findIndex(t => t.id === table.id);
        if (index !== -1) {
          state.tables[index] = table;
          state.currentTable = table;
        }
      });
    },

    deleteTable: (id) => {
      set(state => {
        state.tables = state.tables.filter(table => table.id !== id);
        if (state.currentTable?.id === id) {
          state.currentTable = null;
        }
      });
    },

    setCurrentTable: (id) => {
      set(state => {
        if (id === null) {
          state.currentTable = null;
        } else {
          const table = state.tables.find(t => t.id === id);
          if (table) {
            state.currentTable = table;
          }
        }
      });
    },

    updateCellValue: (rowIndex, columnId, value) => {
      set(state => {
        if (state.currentTable) {
          const cellIndex = state.currentTable.rows[rowIndex].cells.findIndex(
            cell => cell.columnId === columnId
          );

          if (cellIndex !== -1) {
            state.currentTable.rows[rowIndex].cells[cellIndex].value = value;
          } else {
            state.currentTable.rows[rowIndex].cells.push({
              columnId,
              value
            });
          }

          // Пересчет среднего балла
          const row = state.currentTable.rows[rowIndex];
          const values = row.cells
            .filter(cell => cell.value !== null)
            .map(cell => {
              const column = state.currentTable?.columns.find(c => c.id === cell.columnId);
              if (column?.type === 'attendance') {
                return cell.value ? 100 : 0;
              }
              return cell.value!;
            });

          if (values.length > 0) {
            row.average = Math.round(values.reduce((sum, val) => sum + val, 0) / values.length);
          } else {
            row.average = undefined;
          }
        }
      });
    },

    addColumn: (type) => {
      set(state => {
        if (state.currentTable) {
          const newColumn: PerformanceColumn = {
            id: `col-${Date.now()}`,
            date: new Date().toISOString(),
            type,
            title: `Новая колонка`
          };

          state.currentTable.columns.push(newColumn);

          // Добавляем пустые ячейки для всех студентов
          state.currentTable.rows.forEach(row => {
            row.cells.push({
              columnId: newColumn.id,
              value: null
            });
          });
        }
      });
    },

    removeColumn: (columnId) => {
      set(state => {
        if (state.currentTable) {
          state.currentTable.columns = state.currentTable.columns.filter(
            col => col.id !== columnId
          );

          state.currentTable.rows.forEach(row => {
            row.cells = row.cells.filter(cell => cell.columnId !== columnId);

            // Пересчет среднего балла
            const values = row.cells
              .filter(cell => cell.value !== null)
              .map(cell => {
                const column = state.currentTable?.columns.find(c => c.id === cell.columnId);
                if (column?.type === 'attendance') {
                  return cell.value ? 100 : 0;
                }
                return cell.value!;
              });

            if (values.length > 0) {
              row.average = Math.round(values.reduce((sum, val) => sum + val, 0) / values.length);
            } else {
              row.average = undefined;
            }
          });
        }
      });
    }
  }))
);