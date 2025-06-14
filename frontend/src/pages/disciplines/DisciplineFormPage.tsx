import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Button, Spin, Card } from 'antd';
import { useDisciplineStore } from '@/features/disciplines/model/disciplineStore';
import { type CreateDisciplineData } from '@/features/disciplines/model/types';
import styles from './DisciplineFormPage.module.scss';

const DisciplineFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const {
    getDisciplineById,
    createDiscipline,
    updateDiscipline,
    loadDisciplines
  } = useDisciplineStore();

  // Загрузка данных дисциплины
  useEffect(() => {
    if (id) {
      setLoading(true);
      const disciplineId = parseInt(id, 10);

      getDisciplineById(disciplineId)
        .then(discipline => {
          form.setFieldsValue(discipline);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [id, form, getDisciplineById]);

  const handleSubmit = async (values: CreateDisciplineData) => {
    setLoading(true);

    try {
      if (id) {
        await updateDiscipline(parseInt(id, 10), values);
      } else {
        await createDiscipline(values);
      }

      await loadDisciplines();
      navigate('/disciplines');
    } catch (error) {
      console.error('Ошибка сохранения:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/disciplines');
  };

  const title = id ? 'Редактирование дисциплины' : 'Новая дисциплина';

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
              label="Название дисциплины"
              rules={[{ required: true, message: 'Введите название дисциплины' }]}
            >
              <Input placeholder="Например, Математика" />
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

export default DisciplineFormPage;