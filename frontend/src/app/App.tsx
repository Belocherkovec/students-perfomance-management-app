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
import UserFormPage from '@/pages/users/UsersFormPage.tsx';
import GroupFormPage from '@/pages/groups/GroupFormPage.tsx';
import DisciplineFormPage from '@/pages/disciplines/DisciplineFormPage.tsx';
import { PerformanceRouter } from '@/pages/performance/PerformancePage.tsx';

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
            <Route path="/groups/new" element={<GroupFormPage />} />
            <Route path="/groups/:id" element={<GroupFormPage />} />
            <Route path="/groups/:id/edit" element={<GroupFormPage />} />

            <Route path="/disciplines" element={<DisciplinesPage />} />
            <Route path="/disciplines/new" element={<DisciplineFormPage />} />
            <Route path="/disciplines/:id" element={<DisciplineFormPage />} />
            <Route path="/disciplines/:id/edit" element={<DisciplineFormPage />} />

            <Route path="/performance/*" element={<PerformanceRouter />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;