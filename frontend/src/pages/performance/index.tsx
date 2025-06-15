import React, { useEffect } from 'react';
import { Table, Button, Tag } from 'antd';
import { ListPageLayout } from '@/widgets/layout/ListPageLayout';
import { usePerformanceStore } from '@/features/performance/model/performanceStore';
import { useNavigate } from 'react-router-dom';
import styles from './PerformancePage.module.scss';

const PerformancePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    tables,
    groupDisciplines,
    isLoading,
    error,
    loadTables,
    deleteTable,
    setCurrentTable
  } = usePerformanceStore();

  useEffect(() => {
    loadTables();
  }, [loadTables]);

  const handleAddTable = () => {
    navigate('/performance/new');
  };

  const handleRefresh = () => {
    loadTables();
  };

  const handleRowClick = (tableId: string) => {
    setCurrentTable(tableId);
    navigate(`/performance/${tableId}`);
  };

  const handleDelete = (tableId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Вы уверены, что хотите удалить таблицу?')) {
      deleteTable(tableId);
    }
  };

  const getGroupDisciplineName = (groupId: number, disciplineId: number) => {
    const gd = groupDisciplines.find(
      item => item.groupId === groupId && item.disciplineId === disciplineId
    );
    return gd ? `${gd.groupName} - ${gd.disciplineName}` : 'Неизвестно';
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: 'Группа - Дисциплина',
      key: 'groupDiscipline',
      render: (_: any, record: any) => (
        <span>{getGroupDisciplineName(record.groupId, record.disciplineId)}</span>
      ),
    },
    {
      title: 'Дата создания',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Статус',
      key: 'status',
      render: () => <Tag color="blue">Активная</Tag>,
    },
    {
      title: 'Действия',
      key: 'actions',
      width: 120,
      render: (_: any, record: any) => (
        <Button
          danger
          onClick={(e) => handleDelete(record.id, e)}
        >
          Удалить
        </Button>
      ),
    },
  ];

  return (
    <ListPageLayout
      title="Таблицы успеваемости"
      onAdd={handleAddTable}
      onRefresh={handleRefresh}
    >
      {error ? (
        <div className={styles.error}>
          {error} <Button type="link" onClick={handleRefresh}>Повторить</Button>
        </div>
      ) : (
        <Table
          dataSource={tables}
          loading={isLoading}
          rowKey="id"
          onRow={(record) => ({
            onClick: () => handleRowClick(record.id)
          })}
          className={styles.table}
          rowClassName={styles.row}
          columns={columns}
        />
      )}
    </ListPageLayout>
  );
};

export default PerformancePage;