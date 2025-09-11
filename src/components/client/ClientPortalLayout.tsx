import React from 'react';
import { DynamicLogo } from '@/components/ui/DynamicLogo';

interface ClientPortalLayoutProps {
  children: React.ReactNode;
}

export const ClientPortalLayout = ({ children }: ClientPortalLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <DynamicLogo className="h-8" />
            <div className="text-sm text-muted-foreground">
              Portal do Cliente
            </div>
          </div>
        </div>
      </header>
      
      <main className="relative">
        {children}
      </main>
    </div>
  );
};