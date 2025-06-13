import React from 'react';
import { Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useAuthStore } from '@/features/auth/model/store';

export const LogoutButton: React.FC = () => {
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    // Можно добавить дополнительную логику очистки
  };

  return (
    <Button
      type="primary"
      danger
      icon={<LogoutOutlined />}
      onClick={handleLogout}
    >
      Выйти
    </Button>
  );
};