import React, { useEffect, useCallback } from 'react';
import { Table, Button } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { ListPageLayout } from '@/widgets/layout/ListPageLayout';
import { useDisciplineStore } from '@/features/disciplines/model/disciplineStore';
import { type Discipline } from '@/features/disciplines/model/types';
import styles from './DisciplinesPage.module.scss';

const DisciplinesPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    disciplines,
    isLoading,
    error,
    loadDisciplines,
    deleteDiscipline
  } = useDisciplineStore();

  // Загрузка данных при монтировании
  useEffect(() => {
    loadDisciplines();
  }, [loadDisciplines]);

  const handleAddDiscipline = useCallback(() => {
    navigate('/disciplines/new');
  }, [navigate]);

  const handleRefresh = useCallback(() => {
    loadDisciplines();
  }, [loadDisciplines]);

  const handleEdit = useCallback((disciplineId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/disciplines/${disciplineId}/edit`);
  }, [navigate]);

  const handleDelete = useCallback(async (disciplineId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Вы уверены, что хотите удалить дисциплину?')) {
      await deleteDiscipline(disciplineId);
    }
  }, [deleteDiscipline]);

  const handleRowClick = useCallback((discipline: Discipline) => {
    navigate(`/disciplines/${discipline.id}`);
  }, [navigate]);

  // Рендер даты создания
  const renderCreatedAt = useCallback((createdAt?: Date) => {
    if (!createdAt) return '-';
    return new Date(createdAt).toLocaleDateString();
  }, []);

  // Рендер действий
  const renderActions = useCallback((discipline: Discipline) => (
    <div className={styles.actions} onClick={e => e.stopPropagation()}>
      <Button
        type="link"
        icon={<EditOutlined />}
        onClick={(e) => handleEdit(discipline.id, e)}
      />

      <Button
        type="link"
        danger
        icon={<DeleteOutlined />}
        onClick={(e) => handleDelete(discipline.id, e)}
      />
    </div>
  ), [handleEdit, handleDelete]);

  return (
    <ListPageLayout
      title="Дисциплины"
      onAdd={handleAddDiscipline}
      onRefresh={handleRefresh}
    >
      {error ? (
        <div className={styles.error}>
          {error} <Button type="link" onClick={handleRefresh}>Повторить</Button>
        </div>
      ) : (
        <Table
          dataSource={disciplines}
          loading={isLoading}
          rowKey="id"
          onRow={(discipline) => ({
            onClick: () => handleRowClick(discipline)
          })}
          className={styles.table}
          rowClassName={styles.row}
        >
          <Table.Column title="ID" dataIndex="id" key="id" width={70} />
          <Table.Column title="Название" dataIndex="name" key="name" />
          <Table.Column
            title="Дата создания"
            dataIndex="createdAt"
            key="createdAt"
            render={renderCreatedAt}
          />
          <Table.Column
            title="Действия"
            key="actions"
            width={100}
            render={renderActions}
          />
        </Table>
      )}
    </ListPageLayout>
  );
};

export default DisciplinesPage;