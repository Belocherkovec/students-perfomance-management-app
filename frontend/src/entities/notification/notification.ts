// entities/notification/notification.ts
import { notification } from 'antd';
import type { ArgsProps } from 'antd/es/notification/interface';

export const showNotification = (config: ArgsProps) => {
  notification.open(config);
};