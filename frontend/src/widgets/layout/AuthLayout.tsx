import React, { type ReactNode } from 'react';
import styles from './AuthLayout.module.scss';

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className={styles.authLayout}>
      <div className={styles.container}>{children}</div>
    </div>
  );
};