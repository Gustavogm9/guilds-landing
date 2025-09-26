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
import { FeedbackLiveMetrics } from '@/components/admin/FeedbackLiveMetrics';
import { FeedbackNotifications } from '@/components/admin/FeedbackNotifications';
import { FeedbackExport } from '@/components/admin/FeedbackExport';
import { UserManagement } from '@/components/admin/UserManagement';
import { RoleHierarchy } from '@/components/admin/RoleHierarchy';
import { AuditLog } from '@/components/admin/AuditLog';
import { CampaignAdmin } from '@/components/admin/CampaignAdmin';
import { CampaignAutomation } from '@/components/admin/CampaignAutomation';

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
        <Route path="campaigns" element={<CampaignAdmin />} />
        <Route path="campaign-automation" element={<CampaignAutomation />} />
          <Route path="feedback-live" element={<FeedbackLiveMetrics />} />
          <Route path="feedback-notifications" element={<FeedbackNotifications />} />
          <Route path="feedback-export" element={<FeedbackExport />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="roles" element={<RoleHierarchy />} />
          <Route path="audit" element={<AuditLog />} />
      </Routes>
    </AdminLayout>
  );
}