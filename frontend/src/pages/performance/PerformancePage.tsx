import React from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import  PerformancePage  from './index';
import { NewTablePage } from './NewTablePage';
import { PerformanceTable } from '@/features/performance/ui/PerformanceTable';
import { usePerformanceStore } from '@/features/performance/model/performanceStore';
import { useEffect } from 'react';

export const PerformanceRouter: React.FC = () => {
  const { tableId } = useParams<{ tableId: string }>();
  const { setCurrentTable } = usePerformanceStore();

  useEffect(() => {
    if (tableId) {
      setCurrentTable(tableId);
    } else {
      setCurrentTable(null);
    }

    return () => setCurrentTable(null);
  }, [tableId, setCurrentTable]);

  return (
    <Routes>
      <Route path="/" element={<PerformancePage />} />
      <Route path="/new" element={<NewTablePage />} />
      <Route path="/:tableId" element={<PerformanceTable />} />
    </Routes>
  );
};