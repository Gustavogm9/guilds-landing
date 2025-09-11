import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { SEOHead } from '@/components/seo/SEOHead';
import { ClientPortalLayout } from '@/components/client/ClientPortalLayout';
import { ClientLogin } from '@/components/client/ClientLogin';
import { ClientDashboard } from '@/components/client/ClientDashboard';
import { useClientAuth } from '@/hooks/useClientAuth';

export default function ClientPortal() {
  const { projectId } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const { clientAccess, isAuthenticated, isLoading, error } = useClientAuth(token || undefined);

  return (
    <>
      <SEOHead
        title="Portal do Cliente"
        description="Acompanhe o progresso do seu projeto em tempo real"
        noIndex={true}
      />
      
      <ClientPortalLayout>
        {isLoading && (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground">Validando acesso...</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center space-y-4 max-w-md">
              <h1 className="text-2xl font-bold text-destructive">Acesso Negado</h1>
              <p className="text-muted-foreground">{error.message}</p>
              <ClientLogin />
            </div>
          </div>
        )}
        
        {!isAuthenticated && !isLoading && !error && (
          <div className="min-h-screen flex items-center justify-center">
            <ClientLogin />
          </div>
        )}
        
        {isAuthenticated && clientAccess && (
          <ClientDashboard clientAccess={clientAccess} />
        )}
      </ClientPortalLayout>
    </>
  );
}