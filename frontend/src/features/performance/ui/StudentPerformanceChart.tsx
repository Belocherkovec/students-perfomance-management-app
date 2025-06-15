import React from 'react';
import { Button, Card } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { usePerformanceStore } from '../model/performanceStore';
import styles from './StudentPerformanceChart.module.scss';

interface StudentPerformanceChartProps {
  studentId: number;
  onClose: () => void;
}

export const StudentPerformanceChart: React.FC<StudentPerformanceChartProps> = ({
                                                                                  studentId,
                                                                                  onClose
                                                                                }) => {
  const { currentTable } = usePerformanceStore();

  const chartData = React.useMemo(() => {
    if (!currentTable) return [];

    const studentRow = currentTable.rows.find(row => row.student.id === studentId);
    if (!studentRow) return [];

    return currentTable.columns.map(column => {
      const cell = studentRow.cells.find(cell => cell.columnId === column.id);
      let value = cell?.value ?? null;

      // Нормализация значений для графика
      if (value !== null) {
        if (column.type === 'attendance') {
          value = value ? 100 : 0;
        } else if (column.type === 'simple') {
          value = (value / 5) * 100;
        }
        // Для complex значение уже в процентах
      }

      return {
        date: new Date(column.date).toLocaleDateString(),
        type: column.type === 'attendance' ? 'Посещение' :
          column.type === 'simple' ? 'Оценка' : 'Работа',
        value: value !== null ? value : 0,
        isPresent: value !== null,
      };
    });
  }, [currentTable, studentId]);

  const student = currentTable?.rows.find(row => row.student.id === studentId)?.student;

  return (
    <Card
      title={`Статистика студента: ${student?.surname} ${student?.name}`}
      extra={<Button onClick={onClose}>Закрыть</Button>}
      className={styles.card}
    >
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[0, 100]} />
          <Tooltip
            formatter={(value) => [`${value}%`, 'Значение']}
            labelFormatter={(label) => `Дата: ${label}`}
          />
          <Legend />
          <Bar
            dataKey="value"
            name="Успеваемость"
            fill="#8884d8"
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};