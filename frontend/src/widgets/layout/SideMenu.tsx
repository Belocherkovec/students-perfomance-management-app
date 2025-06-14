import React from 'react';
import { Menu } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  BookOutlined,
  TableOutlined
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './SideMenu.module.scss';

export const SideMenu: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Определяем активный пункт меню по текущему пути
  const activeKey = location.pathname.split('/')[1] || 'users';

  const menuItems = [
    {
      key: 'users',
      icon: <UserOutlined />,
      label: 'Пользователи',
    },
    {
      key: 'groups',
      icon: <TeamOutlined />,
      label: 'Группы',
    },
    {
      key: 'disciplines',
      icon: <BookOutlined />,
      label: 'Дисциплины',
    },
    {
      key: 'grades',
      icon: <TableOutlined />,
      label: 'Таблицы успеваемости',
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(`/${key}`);
  };

  return (
    <div className={styles.sideMenu}>
      <Menu
        mode="inline"
        selectedKeys={[activeKey]}
        items={menuItems}
        onClick={handleMenuClick}
        className={styles.menu}
      />
    </div>
  );
};