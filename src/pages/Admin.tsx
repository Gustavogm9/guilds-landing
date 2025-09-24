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
import { NotificationsAdmin } from '@/components/admin/NotificationsAdmin';
import { SystemPerformanceAdmin } from '@/components/admin/SystemPerformanceAdmin';
import ColorAdmin from '@/components/admin/ColorAdmin';
import Projects from '@/pages/Projects';
import FinancialDashboard from '@/components/admin/FinancialDashboard';
import { PayrollAdmin } from '@/components/admin/PayrollAdmin';
import { FeedbackAdmin } from '@/components/admin/FeedbackAdmin';
import { FeedbackMetrics } from '@/components/admin/FeedbackMetrics';

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
        <Route path="notifications" element={<NotificationsAdmin />} />
        <Route path="performance" element={<SystemPerformanceAdmin />} />
        <Route path="colors" element={<ColorAdmin />} />
        <Route path="projects/*" element={<Projects />} />
        <Route path="crm/*" element={<CRMRoutes />} />
        <Route path="financial" element={<FinancialDashboard />} />
        <Route path="payroll" element={<PayrollAdmin />} />
        <Route path="feedback" element={<FeedbackAdmin />} />
        <Route path="feedback-metrics" element={<FeedbackMetrics />} />
      </Routes>
    </AdminLayout>
  );
}