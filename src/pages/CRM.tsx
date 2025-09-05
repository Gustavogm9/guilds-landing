import React from 'react';
import { SEOHead } from '@/components/seo/SEOHead';
import { CRMBoard } from '@/components/crm/board/CRMBoard';

export default function CRM() {
  return (
    <>
      <SEOHead
        title="CRM - Sistema de Gestão de Relacionamento"
        description="Gerencie seus leads, oportunidades e relacionamentos com clientes usando nosso sistema CRM completo com interface Kanban."
        keywords={['crm', 'gestão', 'relacionamento', 'leads', 'vendas', 'kanban']}
      />
      
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <CRMBoard />
        </div>
      </div>
    </>
  );
}