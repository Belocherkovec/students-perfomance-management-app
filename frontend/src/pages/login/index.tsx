import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthLayout } from '@/widgets/layout/AuthLayout';
import { LoginForm } from '@/features/auth/ui/LoginForm';
import { useAuthStore } from '@/features/auth/model/store';
import styles from './LoginPage.module.scss';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { accessToken, isInitialized } = useAuthStore();

  // Редирект на предыдущую страницу после успешной авторизации
  useEffect(() => {
    if (isInitialized && accessToken) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [accessToken, isInitialized, navigate, location.state]);

  return (
    <AuthLayout>
      <div className={styles.loginPage}>
        <div className={styles.header}>
          <h1>Вход в систему</h1>
          <p>Пожалуйста, введите ваши учетные данные</p>
        </div>
        <LoginForm />
      </div>
    </AuthLayout>
  );
};

export default LoginPage;