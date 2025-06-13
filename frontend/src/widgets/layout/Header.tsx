import React from 'react';
import { Layout, Typography, Avatar, Dropdown, type MenuProps } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useAuthStore } from '@/features/auth/model/store';
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.scss';
import { useUserStore } from '@/entities/user/model/store.ts';

const { Header: AntHeader } = Layout;
const { Title } = Typography;

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { accessToken, logout } = useAuthStore();
  const { user } = useUserStore();

  // Только для авторизованных пользователей
  if (!accessToken) return null;

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const items: MenuProps['items'] = [
    {
      key: 'logout',
      label: 'Выйти',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    }
  ];

  return (
    <AntHeader className={styles.header}>
      <div className={styles.logoContainer} onClick={handleLogoClick}>
        <Title level={4} className={styles.logoText}>
          Электронный портал учета посещаемости и успеваемости
        </Title>
      </div>

      <div className={styles.userPanel}>
        <Dropdown menu={{ items }} trigger={['click']}>
          <div className={styles.userInfo}>
            <Avatar
              size="default"
              icon={<UserOutlined />}
              className={styles.avatar}
            />
            <span className={styles.userName}>
              {user?.login ?? 'Пользователь'}
            </span>
          </div>
        </Dropdown>
      </div>
    </AntHeader>
  );
};