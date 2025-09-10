import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Kanban, 
  List, 
  BarChart3, 
  FileText,
  Plus,
  Settings
} from 'lucide-react';
import { SEOHead } from '@/components/seo/SEOHead';
import { ProjectsDashboard } from '@/components/projects/ProjectsDashboard';
import { ProjectKanban } from '@/components/projects/ProjectKanban';
import { ProjectsList } from '@/components/projects/ProjectsList';

export default function Projects() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <>
      <SEOHead
        title="Gestão de Projetos"
        description="Sistema completo de gestão de projetos com dashboards, kanban, sprints e portal do cliente."
      />
      
      <div className="min-h-screen bg-background">
        <div className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight">Gestão de Projetos</h1>
                <p className="text-muted-foreground">
                  Gerencie todos os seus projetos em um só lugar
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Projeto
                </Button>
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-5 w-full max-w-2xl">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="kanban" className="flex items-center gap-2">
                <Kanban className="h-4 w-4" />
                <span className="hidden sm:inline">Kanban</span>
              </TabsTrigger>
              <TabsTrigger value="list" className="flex items-center gap-2">
                <List className="h-4 w-4" />
                <span className="hidden sm:inline">Lista</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Relatórios</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
              <ProjectsDashboard />
            </TabsContent>

            <TabsContent value="kanban" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Kanban className="h-5 w-5" />
                    Kanban dos Projetos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ProjectKanban />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="list" className="space-y-6">
              <ProjectsList />
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Analytics e Métricas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-muted-foreground">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">Analytics em Desenvolvimento</p>
                    <p>Esta seção incluirá métricas detalhadas de performance dos projetos</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Configuração de Relatórios
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">Sistema de Relatórios em Desenvolvimento</p>
                    <p>Aqui você poderá configurar relatórios automáticos para clientes</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}