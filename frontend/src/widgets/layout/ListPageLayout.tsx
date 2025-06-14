// widgets/layout/ListPageLayout.tsx
import React, { type ReactNode } from 'react';
import { Dropdown, type MenuProps, Button, Space } from 'antd';
import { MoreOutlined, PlusOutlined } from '@ant-design/icons';
import styles from './ListPageLayout.module.scss';

interface ListPageLayoutProps {
  title: string;
  actions?: MenuProps['items'];
  children: ReactNode;
  onAdd?: () => void;
  onRefresh?: () => void;
}

export const ListPageLayout: React.FC<ListPageLayoutProps> = ({
                                                                title,
                                                                actions,
                                                                children,
                                                                onAdd,
                                                                onRefresh
                                                              }) => {
  const moreActions: MenuProps['items'] = [
    ...(actions || []),
    {
      key: 'refresh',
      label: 'Обновить',
      onClick: onRefresh
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>

        <Space>
          {onAdd && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={onAdd}
            >
              Добавить
            </Button>
          )}

          <Dropdown menu={{ items: moreActions }} trigger={['click']}>
            <Button icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      </div>

      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};