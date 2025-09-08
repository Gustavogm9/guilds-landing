import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CRMBoard } from '@/components/crm/board/CRMBoard';
import CRMAdmin from '@/components/admin/CRMAdmin';

export default function CRMRoutes() {
  return (
    <Routes>
      <Route index element={<CRMAdmin />} />
      <Route path="board" element={<CRMBoard />} />
      <Route path="kanban" element={<CRMBoard />} />
    </Routes>
  );
}