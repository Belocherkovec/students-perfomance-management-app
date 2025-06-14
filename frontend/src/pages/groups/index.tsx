import React, { useEffect, useCallback } from 'react';
import { Table, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ListPageLayout } from '@/widgets/layout/ListPageLayout';
import { useGroupStore } from '@/features/groups/model/groupStore';
import { type Group } from '@/features/groups/model/types';
import styles from './GroupsPage.module.scss';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

const GroupsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    groups,
    isLoading,
    error,
    loadGroups,
    deleteGroup
  } = useGroupStore();

  // Загрузка данных при монтировании
  useEffect(() => {
    loadGroups();
  }, [loadGroups]);

  const handleAddGroup = useCallback(() => {
    navigate('/groups/new');
  }, [navigate]);

  const handleRefresh = useCallback(() => {
    loadGroups();
  }, [loadGroups]);

  const handleEdit = useCallback((groupId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/groups/${groupId}/edit`);
  }, [navigate]);

  const handleDelete = useCallback(async (groupId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Вы уверены, что хотите удалить группу?')) {
      await deleteGroup(groupId);
    }
  }, [deleteGroup]);

  const handleRowClick = useCallback((group: Group) => {
    navigate(`/groups/${group.id}`);
  }, [navigate]);

  // Рендер даты создания
  const renderCreatedAt = useCallback((createdAt?: Date) => {
    if (!createdAt) return '-';
    return new Date(createdAt).toLocaleDateString();
  }, []);

  // Рендер действий
  const renderActions = useCallback((group: Group) => (
    <div className={styles.actions} onClick={e => e.stopPropagation()}>
      <Button
        type="link"
        icon={<EditOutlined />}
        onClick={(e) => handleEdit(group.id, e)}
      />

      <Button
        type="link"
        danger
        icon={<DeleteOutlined />}
        onClick={(e) => handleDelete(group.id, e)}
      />
    </div>
  ), [handleEdit, handleDelete]);

  return (
    <ListPageLayout
      title="Группы"
      onAdd={handleAddGroup}
      onRefresh={handleRefresh}
    >
      {error ? (
        <div className={styles.error}>
          {error} <Button type="link" onClick={handleRefresh}>Повторить</Button>
        </div>
      ) : (
        <Table
          dataSource={groups}
          loading={isLoading}
          rowKey="id"
          onRow={(group) => ({
            onClick: () => handleRowClick(group)
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

export default GroupsPage;