import React, { useState } from 'react';
import { Card, Select, Button, Form } from 'antd';
import { usePerformanceStore } from '@/features/performance/model/performanceStore';
import { useNavigate } from 'react-router-dom';
import styles from './NewTablePage.module.scss';

const { Option } = Select;

export const NewTablePage: React.FC = () => {
  const navigate = useNavigate();
  const { groupDisciplines, createTable } = usePerformanceStore();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: { groupDisciplineId: string }) => {
    setLoading(true);
    try {
      const [groupId, disciplineId] = values.groupDisciplineId.split('-').map(Number);
      createTable(groupId, disciplineId);
      navigate('/performance');
    } catch (error) {
      console.error('Ошибка создания таблицы:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/performance');
  };

  return (
    <div className={styles.container}>
      <Card title="Создать новую таблицу успеваемости" className={styles.card}>
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="groupDisciplineId"
            label="Группа и дисциплина"
            rules={[{ required: true, message: 'Выберите группу и дисциплину' }]}
          >
            <Select placeholder="Выберите группу и дисциплину">
              {groupDisciplines.map(gd => (
                <Option
                  key={`${gd.groupId}-${gd.disciplineId}`}
                  value={`${gd.groupId}-${gd.disciplineId}`}
                >
                  {gd.groupName} - {gd.disciplineName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <div className={styles.actions}>
            <Button onClick={handleBack}>
              Отмена
            </Button>

            <Button type="primary" htmlType="submit" loading={loading}>
              Создать
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};