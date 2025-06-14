import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/lib/locale/ru_RU';
import { AuthGuard } from '@/features/auth/ui/AuthGuard';
import LoginPage from '@/pages/login';
import HomePage  from '@/pages/home';
import UsersPage from '@/pages/users';
import GroupsPage from '@/pages/groups';
import DisciplinesPage from '@/pages/disciplines';
import GradesPage from '@/pages/grades';
import UserFormPage from '@/pages/users/UsersFormPage.tsx';

const App: React.FC = () => {
  return (
    <ConfigProvider locale={ruRU}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<AuthGuard />}>
            <Route path="/" element={<HomePage />} />

            <Route path="/users" element={<UsersPage />} />
            <Route path="/users/new" element={<UserFormPage isNew />} />
            <Route path="/users/:id" element={<UserFormPage />} />
            <Route path="/users/:id/edit" element={<UserFormPage />} />

            <Route path="/groups" element={<GroupsPage />} />
            <Route path="/disciplines" element={<DisciplinesPage />} />
            <Route path="/grades" element={<GradesPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;