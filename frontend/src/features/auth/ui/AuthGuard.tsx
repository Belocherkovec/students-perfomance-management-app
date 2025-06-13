import { type FC } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Spin, Layout } from 'antd';
import { useAuthStore } from '@/features/auth/model/store';
import { Header } from '@/widgets/layout/Header';

const { Content } = Layout;

export const AuthGuard: FC = () => {
  const location = useLocation();
  const { accessToken, isInitialized } = useAuthStore();

  if (!isInitialized) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header />
      <Layout>
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};