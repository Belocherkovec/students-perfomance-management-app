import { type FC } from 'react';
import { Button, Form, Input, Spin } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useAuthStore } from '@/features/auth/model/store';
import { showNotification } from '@/entities/notification/notification';
import styles from './LoginForm.module.scss';
import type { AxiosError } from 'axios';

export const LoginForm: FC = () => {
  const [form] = Form.useForm();
  const { login, isLoading } = useAuthStore();

  const handleSubmit = async (values: { login: string; password: string }) => {
    try {
      await login({
        login: values.login,
        password: values.password,
      });

      // Успешное уведомление
      showNotification({
        type: 'success',
        message: 'Успешный вход',
        description: 'Добро пожаловать!',
      });
    } catch (error) {
      console.log(error)
      // Обработка ошибки
      const errorMessage = ((error as AxiosError).response?.data as any)?.message || (error as Error)?.message || 'Неверный логин или пароль';

      showNotification({
        type: 'error',
        message: 'Ошибка авторизации',
        description: errorMessage,
      });
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      className={styles.form}
    >
      <Form.Item
        name="login"
        label="Логин"
        rules={[
          { required: true, message: 'Пожалуйста, введите логин' },
          { min: 3, message: 'Логин должен быть не менее 3 символов' },
          { max: 20, message: 'Логин должен быть не длиннее 20 символов' },
        ]}
      >
        <Input
          prefix={<UserOutlined />}
          placeholder="Логин"
          disabled={isLoading}
        />
      </Form.Item>

      <Form.Item
        name="password"
        label="Пароль"
        rules={[
          { required: true, message: 'Пожалуйста, введите пароль' },
          { min: 4, message: 'Пароль должен быть не менее 4 символов' },
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Пароль"
          disabled={isLoading}
        />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          block
          disabled={isLoading}
          className={styles.submitButton}
        >
          {isLoading ? <Spin size="small" /> : 'Войти'}
        </Button>
      </Form.Item>
    </Form>
  );
};