import { type FC } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Spin, Layout } from 'antd';
import { useAuthStore } from '@/features/auth/model/store';
import { Header } from '@/widgets/layout/Header';
import { SideMenu } from '@/widgets/layout/SideMenu';
import styles from './AuthGuard.module.scss';

const { Content } = Layout;

export const AuthGuard: FC = () => {
  const location = useLocation();
  const { accessToken, isInitialized } = useAuthStore();

  // Показываем загрузку, пока состояние не инициализировано
  if (!isInitialized) {
    return (
      <div className={styles.loaderContainer}>
        <Spin size="large" />
      </div>
    );
  }

  // Если пользователь не авторизован - редирект на страницу входа
  if (!accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Основной layout для авторизованных пользователей
  return (
    <Layout className={styles.layout}>
      <Header />
      <Layout className={styles.contentLayout}>
        <SideMenu />
        <Content className={styles.content}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};