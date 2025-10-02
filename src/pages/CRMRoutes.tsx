import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CRMBoard } from '@/components/crm/board/CRMBoard';
import CRMAdmin from '@/components/admin/CRMAdmin';
import { LeadScoringDashboard } from '@/components/crm/lead-scoring/LeadScoringDashboard';
import { Agenda } from '@/pages/Agenda';

export default function CRMRoutes() {
  return (
    <Routes>
      <Route index element={<CRMAdmin />} />
      <Route path="board" element={<CRMBoard />} />
      <Route path="kanban" element={<CRMBoard />} />
      <Route path="scoring" element={<LeadScoringDashboard />} />
      <Route path="agenda" element={<Agenda />} />
    </Routes>
  );
}