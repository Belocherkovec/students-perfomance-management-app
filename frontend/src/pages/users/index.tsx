import React, { useEffect, useCallback } from 'react';
import { Table, Button, Tag, Tooltip } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  LockOutlined,
  UnlockOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { ListPageLayout } from '@/widgets/layout/ListPageLayout';
import { useUserStore } from '@/features/users/model/userStore';
import type { User } from '@/features/users/model/types';
import styles from './UsersPage.module.scss';

const UsersPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    users,
    isLoading,
    error,
    loadUsers,
    loadGroups,
    loadRoles,
    deleteUser
  } = useUserStore();

  // Загрузка данных при монтировании
  useEffect(() => {
    loadUsers();
    loadGroups();
    loadRoles();
  }, [loadUsers, loadGroups, loadRoles]);

  const handleAddUser = useCallback(() => {
    navigate('/users/new');
  }, [navigate]);

  const handleRefresh = useCallback(() => {
    loadUsers();
  }, [loadUsers]);

  const handleEdit = useCallback((userId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/users/${userId}/edit`);
  }, [navigate]);

  const handleDelete = useCallback(async (userId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Вы уверены, что хотите удалить пользователя?')) {
      await deleteUser(userId);
    }
  }, [deleteUser]);

  const handleRowClick = useCallback((user: User) => {
    navigate(`/users/${user.id}`);
  }, [navigate]);

  // Действия для выпадающего меню
  const actions = [
    {
      key: 'export',
      label: 'Экспорт в Excel'
    },
    {
      key: 'import',
      label: 'Импорт из Excel'
    }
  ];

  // Рендер блокировки
  const renderBlocked = useCallback((isBlocked: boolean) => (
    <Tag color={isBlocked ? 'red' : 'green'} icon={isBlocked ? <LockOutlined /> : <UnlockOutlined />}>
      {isBlocked ? 'Заблокирован' : 'Активен'}
    </Tag>
  ), []);

  // Рендер ролей
  const renderRoles = useCallback((roles: string[]) => (
    <div className={styles.rolesContainer}>
      {roles.map(role => (
        <Tag key={role} color="blue">{role}</Tag>
      ))}
    </div>
  ), []);

  // Рендер действий
  const renderActions = useCallback((user: User) => (
    <div className={styles.actions} onClick={e => e.stopPropagation()}>
      <Tooltip title="Редактировать">
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={(e) => handleEdit(user.id, e)}
        />
      </Tooltip>

      <Tooltip title="Удалить">
        <Button
          type="link"
          danger
          icon={<DeleteOutlined />}
          onClick={(e) => handleDelete(user.id, e)}
        />
      </Tooltip>
    </div>
  ), [handleEdit, handleDelete]);

  return (
    <ListPageLayout
      title="Пользователи"
      actions={actions}
      onAdd={handleAddUser}
      onRefresh={handleRefresh}
    >
      {error ? (
        <div className={styles.error}>
          {error} <Button type="link" onClick={handleRefresh}>Повторить</Button>
        </div>
      ) : (
        <Table
          dataSource={users}
          loading={isLoading}
          rowKey="id"
          onRow={(user) => ({
            onClick: () => handleRowClick(user)
          })}
          className={styles.table}
          rowClassName={styles.row}
        >
          <Table.Column title="ID" dataIndex="id" key="id" width={70} />
          <Table.Column
            title="ФИО"
            key="fullName"
            render={(_, user: User) => (
              <span>{user.surname} {user.name} {user.patronymic || ''}</span>
            )}
          />
          <Table.Column title="Логин" dataIndex="login" key="login" />
          <Table.Column title="Email" dataIndex="email" key="email" />
          <Table.Column
            title="Статус"
            dataIndex="is_blocked"
            key="is_blocked"
            render={renderBlocked}
          />
          <Table.Column
            title="Роли"
            dataIndex="roles"
            key="roles"
            render={renderRoles}
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

export default UsersPage;