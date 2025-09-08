import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { LogosAdmin } from '@/components/admin/LogosAdmin';
import { SEOAdmin } from '@/components/seo/SEOAdmin';
import { QualificationAdmin } from '@/components/admin/QualificationAdmin';
import { ContactAdmin } from '@/components/admin/ContactAdmin';
import { CraftAdmin } from '@/components/admin/CraftAdmin';
import CRMRoutes from '@/pages/CRMRoutes';
import { LabAdmin } from '@/components/admin/LabAdmin';
import { CompanyAdmin } from '@/components/admin/CompanyAdmin';
import { NewsletterAdmin } from '@/components/admin/NewsletterAdmin';

export default function Admin() {
  return (
    <AdminLayout>
      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="logos" element={<LogosAdmin />} />
        <Route path="seo" element={<SEOAdmin />} />
        <Route path="forms" element={<QualificationAdmin />} />
        <Route path="newsletter" element={<NewsletterAdmin />} />
        <Route path="contacts" element={<ContactAdmin />} />
        <Route path="team" element={<CompanyAdmin />} />
        <Route path="lab" element={<LabAdmin />} />
        <Route path="craft" element={<CraftAdmin />} />
        <Route path="crm/*" element={<CRMRoutes />} />
      </Routes>
    </AdminLayout>
  );
}