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
import { MultiProductReports } from '@/components/admin/reports/MultiProductReports';
import { MultiProductAutomation } from '@/components/admin/automation/MultiProductAutomation';
import { MultiProductCRM } from '@/components/admin/crm/MultiProductCRM';
import { LegalAdmin } from '@/components/admin/LegalAdmin';
import { ContractsAdmin } from '@/components/admin/ContractsAdmin';
import { NurturingSequenceAdmin } from '@/components/admin/NurturingSequenceAdmin';
import { ProposalAdmin } from '@/components/admin/ProposalAdmin';
import { ProposalTemplateEditor } from '@/components/admin/ProposalTemplateEditor';
import { ProposalPricingCatalog } from '@/components/admin/ProposalPricingCatalog';
import { ProposalForm } from '@/components/admin/ProposalForm';
import { ProposalVersionEditor } from '@/components/admin/ProposalVersionEditor';
import { ProposalDiffViewer } from '@/components/admin/ProposalDiffViewer';

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
        <Route path="reports" element={<MultiProductReports />} />
        <Route path="automation" element={<MultiProductAutomation />} />
        <Route path="crm-multiproduct" element={<MultiProductCRM />} />
        <Route path="campaigns" element={<CampaignAdmin />} />
        <Route path="feedback" element={<FeedbackAdmin />} />
        <Route path="feedback-metrics" element={<FeedbackMetrics />} />
        <Route path="feedback-live" element={<FeedbackLiveMetrics />} />
        <Route path="feedback-notifications" element={<FeedbackNotifications />} />
        <Route path="feedback-export" element={<FeedbackExport />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="roles" element={<RoleHierarchy />} />
        <Route path="audit" element={<AuditLog />} />
        <Route path="legal" element={<LegalAdmin />} />
        <Route path="contracts" element={<ContractsAdmin />} />
        <Route path="nurturing" element={<NurturingSequenceAdmin />} />
              <Route path="propostas" element={<ProposalAdmin />} />
              <Route path="propostas/nova" element={<ProposalForm />} />
              <Route path="propostas/:id" element={<ProposalForm />} />
              <Route path="propostas/:id/versoes/:versionNumber" element={<ProposalVersionEditor />} />
              <Route path="propostas/:id/diff" element={<ProposalDiffViewer />} />
              <Route path="propostas/templates" element={<ProposalTemplateEditor />} />
              <Route path="propostas/catalogo" element={<ProposalPricingCatalog />} />
      </Routes>
    </AdminLayout>
  );
}