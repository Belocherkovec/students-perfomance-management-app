import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Button, Spin, Card } from 'antd';
import { useGroupStore } from '@/features/groups/model/groupStore';
import { type CreateGroupData } from '@/features/groups/model/types';
import styles from './GroupFormPage.module.scss';

const GroupFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const {
    getGroupById,
    createGroup,
    updateGroup,
    loadGroups
  } = useGroupStore();

  // Загрузка данных группы
  useEffect(() => {
    if (id) {
      setLoading(true);
      const groupId = parseInt(id, 10);

      getGroupById(groupId)
        .then(group => {
          form.setFieldsValue(group);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [id, form, getGroupById]);

  const handleSubmit = async (values: CreateGroupData) => {
    setLoading(true);

    try {
      if (id) {
        await updateGroup(parseInt(id, 10), values);
      } else {
        await createGroup(values);
      }

      await loadGroups();
      navigate('/groups');
    } catch (error) {
      console.error('Ошибка сохранения:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/groups');
  };

  const title = id ? 'Редактирование группы' : 'Новая группа';

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{title}</h2>

      <Card className={styles.card}>
        <Spin spinning={loading}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Form.Item
              name="name"
              label="Название группы"
              rules={[{ required: true, message: 'Введите название группы' }]}
            >
              <Input placeholder="Например, ИСТ-101" />
            </Form.Item>

            <div className={styles.actions}>
              <Button onClick={handleBack}>
                Отмена
              </Button>

              <Button type="primary" htmlType="submit" loading={loading}>
                Сохранить
              </Button>
            </div>
          </Form>
        </Spin>
      </Card>
    </div>
  );
};

export default GroupFormPage;