import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Form,
  Input,
  Button,
  Select,
  Checkbox,
  Spin,
  Card,
  Row,
  Col
} from 'antd';
import { useUserStore } from '@/features/users/model/userStore';
import type { CreateUserData } from '@/features/users/model/types';
import styles from './UsersFormPage.module.scss';

const { Option } = Select;

interface UserFormPageProps {
  isNew?: boolean;
}

const UserFormPage: React.FC<UserFormPageProps> = ({ isNew = false }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const {
    users,
    groups,
    roles,
    getUserById,
    createUser,
    updateUser,
    loadUsers,
    loadGroups,
    loadRoles
  } = useUserStore();

  // Загрузка данных при монтировании
  useEffect(() => {
    loadGroups();
    loadRoles();
  }, [loadGroups, loadRoles]);

  // Загрузка данных пользователя
  useEffect(() => {
    if (!isNew && id) {
      setLoading(true);
      const userId = parseInt(id, 10);

      // Попробуем найти пользователя в кеше
      const cachedUser = users.find(u => u.id === userId);

      if (cachedUser) {
        form.setFieldsValue({
          ...cachedUser,
          roles: cachedUser.roles || []
        });
        setLoading(false);
      } else {
        // Загрузка с сервера
        getUserById(userId).then(user => {
          form.setFieldsValue({
            ...user,
            roles: user.roles || []
          });
          setLoading(false);
        }).catch(() => {
          setLoading(false);
        });
      }
    }
  }, [id, isNew, users, getUserById, form]);

  const handleSubmit = async (values: CreateUserData) => {
    setLoading(true);

    try {
      if (isNew) {
        await createUser(values);
      } else if (id) {
        await updateUser(parseInt(id, 10), values);
      }

      await loadUsers();
      navigate('/users');
    } catch (error) {
      console.error('Ошибка сохранения:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/users');
  };

  const title = isNew ? 'Новый пользователь' : 'Редактирование пользователя';

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{title}</h2>

      <Card className={styles.card}>
        <Spin spinning={loading}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              is_blocked: false,
              roles: []
            }}
          >
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="surname"
                  label="Фамилия"
                  rules={[{ required: true, message: 'Введите фамилию' }]}
                >
                  <Input placeholder="Иванов" />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name="name"
                  label="Имя"
                  rules={[{ required: true, message: 'Введите имя' }]}
                >
                  <Input placeholder="Иван" />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name="patronymic"
                  label="Отчество"
                >
                  <Input placeholder="Иванович" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="login"
                  label="Логин"
                  rules={[{ required: true, message: 'Введите логин' }]}
                >
                  <Input placeholder="ivanov" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[{ type: 'email', message: 'Некорректный email' }]}
                >
                  <Input placeholder="ivanov@example.com" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="group_id"
                  label="Группа"
                >
                  <Select placeholder="Выберите группу" allowClear>
                    {groups.map(group => (
                      <Option key={group.id} value={group.id}>
                        {group.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="roles"
                  label="Роли"
                >
                  <Select
                    mode="multiple"
                    placeholder="Выберите роли"
                    allowClear
                  >
                    {roles.map(role => (
                      <Option key={role.name} value={role.name}>
                        {role.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="is_blocked"
              valuePropName="checked"
            >
              <Checkbox>Заблокирован</Checkbox>
            </Form.Item>

            <div className={styles.actions}>
              <Button onClick={handleBack}>
                Отмена
              </Button>

              <Button type="primary" htmlType="submit">
                Сохранить
              </Button>
            </div>
          </Form>
        </Spin>
      </Card>
    </div>
  );
};

export default UserFormPage;