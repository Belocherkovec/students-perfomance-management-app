import React, { useMemo } from 'react';
import { Table, Button, Tag, Tooltip } from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import {
  usePerformanceStore,
} from '@/features/performance/model/performanceStore';
import { StudentPerformanceChart } from './StudentPerformanceChart';
import styles from './PerformanceTable.module.scss';
import type { PerformanceCell, PerformanceRow } from '@/features/performance/model/types.ts';

interface CellEditorProps {
  value: number | null;
  type: 'attendance' | 'simple' | 'complex';
  onChange: (value: number | null) => void;
}

const CellEditor: React.FC<CellEditorProps> = ({ value, type, onChange }) => {
  if (type === 'attendance') {
    return (
      <div className={styles.attendanceCell}>
        <Button
          type={value === 1 ? 'primary' : 'default'}
          onClick={() => onChange(value === 1 ? 0 : 1)}
        >
          {value === 1 ? 'Присутствовал' : 'Отсутствовал'}
        </Button>
      </div>
    );
  }

  if (type === 'simple') {
    return (
      <div className={styles.simpleCell}>
        {[2, 3, 4, 5].map(grade => (
          <Button
            key={grade}
            type={value === grade ? 'primary' : 'default'}
            onClick={() => onChange(grade)}
          >
            {grade}
          </Button>
        ))}
        <Button danger onClick={() => onChange(null)}>
          Сбросить
        </Button>
      </div>
    );
  }

  if (type === 'complex') {
    return (
      <div className={styles.complexCell}>
        <input
          type="range"
          min="0"
          max="100"
          value={value === null ? 0 : value}
          onChange={(e) => onChange(parseInt(e.target.value))}
        />
        <span>{value === null ? '0' : value}%</span>
        <Button danger onClick={() => onChange(null)}>
          Сбросить
        </Button>
      </div>
    );
  }

  return null;
};

export const PerformanceTable: React.FC = () => {
  const {
    currentTable,
    updateCellValue,
    addColumn,
    removeColumn,
    setCurrentTable
  } = usePerformanceStore();

  const [selectedStudent, setSelectedStudent] = React.useState<number | null>(null);

  const columns = useMemo(() => {
    if (!currentTable) return [];

    const studentColumns = [
      {
        title: 'Студент',
        dataIndex: 'student',
        key: 'student',
        fixed: 'left' as const,
        width: 200,
        render: (student: PerformanceRow['student']) => (
          <div className={styles.studentCell}>
            {student.surname} {student.name} {student.patronymic || ''}
            <Tooltip title="Показать статистику">
              <Button
                type="link"
                icon={<BarChartOutlined />}
                onClick={() => setSelectedStudent(student.id)}
              />
            </Tooltip>
          </div>
        ),
      }
    ];

    const dataColumns = currentTable.columns.map(column => ({
      title: (
        <div className={styles.columnHeader}>
          <div>{new Date(column.date).toLocaleDateString()}</div>
          <div>
            <Tag color={
              column.type === 'attendance' ? 'blue' :
                column.type === 'simple' ? 'green' : 'purple'
            }>
              {column.type === 'attendance' ? 'Посещение' :
                column.type === 'simple' ? 'Оценка' : 'Работа'}
            </Tag>
          </div>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => removeColumn(column.id)}
          />
        </div>
      ),
      key: column.id,
      dataIndex: 'cells',
      width: 200,
      render: (cells: PerformanceCell[], _: PerformanceRow, rowIndex: number) => {
        const cell = cells.find(c => c.columnId === column.id);
        return (
          <CellEditor
            value={cell?.value ?? null}
            type={column.type}
            onChange={(value) => updateCellValue(rowIndex, column.id, value)}
          />
        );
      },
    }));

    const averageColumn = {
      title: 'Средний балл',
      key: 'average',
      fixed: 'right' as const,
      width: 120,
      render: (_: any, record: PerformanceRow) => (
        <div className={styles.averageCell}>
          {record.average !== undefined ? (
            <Tag color={
              record.average >= 85 ? 'green' :
                record.average >= 60 ? 'orange' : 'red'
            }>
              {record.average}%
            </Tag>
          ) : (
            <Tag>Нет данных</Tag>
          )}
        </div>
      ),
    };

    return [...studentColumns, ...dataColumns, averageColumn];
  }, [currentTable, updateCellValue, removeColumn]);

  if (!currentTable) {
    return <div>Таблица не выбрана</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Таблица успеваемости</h2>
        <div className={styles.actions}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => addColumn('simple')}
          >
            Добавить колонку
          </Button>

          <Button
            onClick={() => setCurrentTable(null)}
          >
            Назад к списку
          </Button>
        </div>
      </div>

      <Table
        dataSource={currentTable.rows}
        columns={columns}
        rowKey={(record) => record.student.id.toString()}
        scroll={{ x: 'max-content' }}
        pagination={false}
        className={styles.table}
      />

      {selectedStudent && (
        <div className={styles.chartModal}>
          <div className={styles.chartContainer}>
            <StudentPerformanceChart
              studentId={selectedStudent}
              onClose={() => setSelectedStudent(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};