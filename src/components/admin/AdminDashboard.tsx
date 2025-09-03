import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Users, 
  Mail, 
  FileText, 
  Lightbulb, 
  Globe, 
  Briefcase,
  Calendar,
  Activity,
  ArrowUpRight,
  RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDashboardStats } from '@/hooks/useDashboardStats';

const quickActions = [
  {
    title: "Gerenciar Equipe",
    description: "Adicionar ou editar membros",
    icon: Users,
    href: "/admin/team",
    color: "bg-primary"
  },
  {
    title: "Configurar SEO",
    description: "Otimizar meta tags",
    icon: Globe,
    href: "/admin/seo", 
    color: "bg-accent"
  },
  {
    title: "Ver Contatos",
    description: "Gerenciar leads",
    icon: FileText,
    href: "/admin/contacts",
    color: "bg-secondary"
  },
  {
    title: "Logos & Brand",
    description: "Atualizar assets visuais",
    icon: Briefcase,
    href: "/admin/logos",
    color: "bg-primary/80"
  }
];

export function AdminDashboard() {
  const navigate = useNavigate();
  const { stats, recentActivities, isLoading, error, refetch } = useDashboardStats();

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const getChangeType = (change: number): "default" | "destructive" => {
    return change >= 0 ? "default" : "destructive";
  };

  const formatChange = (change: number) => {
    const sign = change >= 0 ? "+" : "";
    return `${sign}${change}%`;
  };

  const dashboardStats = [
    {
      title: "Total de Contatos",
      value: formatNumber(stats.totalContacts),
      change: formatChange(stats.contactsChange),
      changeType: getChangeType(stats.contactsChange),
      icon: Users,
      href: "/admin/contacts"
    },
    {
      title: "Newsletter Inscritos",
      value: formatNumber(stats.newsletterSubscribers),
      change: formatChange(stats.newsletterChange),
      changeType: getChangeType(stats.newsletterChange),
      icon: Mail,
      href: "/admin/newsletter"
    },
    {
      title: "Formulários (Mês)",
      value: formatNumber(stats.formSubmissions),
      change: formatChange(stats.formsChange),
      changeType: getChangeType(stats.formsChange),
      icon: FileText,
      href: "/admin/forms"
    },
    {
      title: "Team Members",
      value: formatNumber(stats.teamMembers),
      change: formatChange(stats.teamChange),
      changeType: getChangeType(stats.teamChange),
      icon: Briefcase,
      href: "/admin/team"
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'contact': return Users;
      case 'newsletter': return Mail;
      case 'team': return Briefcase;
      case 'craft': return Lightbulb;
      default: return Activity;
    }
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            Visão geral do sistema administrativo da Guilds
          </p>
          <Button 
            onClick={refetch} 
            variant="outline" 
            size="sm"
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Tentar Novamente
          </Button>
        </div>
        <Card className="border-destructive/50">
          <CardContent className="pt-6">
            <p className="text-destructive text-center">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Visão geral do sistema administrativo da Guilds
        </p>
        <Button 
          onClick={refetch} 
          variant="outline" 
          size="sm"
          disabled={isLoading}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat) => (
          <Card 
            key={stat.title}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate(stat.href)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Badge 
                      variant={stat.changeType}
                      className="text-xs mr-1"
                    >
                      {stat.change}
                    </Badge>
                    <span>em relação ao mês anterior</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Atividade Recente
            </CardTitle>
            <CardDescription>
              Últimas ações no sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              ))
            ) : recentActivities.length > 0 ? (
              recentActivities.map((activity) => {
                const ActivityIcon = getActivityIcon(activity.type);
                return (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      <ActivityIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {activity.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {activity.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-4">
                <Activity className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Nenhuma atividade recente
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Ações Rápidas
            </CardTitle>
            <CardDescription>
              Acesso direto às funcionalidades principais
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start h-auto p-3"
                onClick={() => navigate(action.href)}
              >
                <div className={`w-8 h-8 rounded-lg ${action.color} flex items-center justify-center mr-3 flex-shrink-0`}>
                  <action.icon className="h-4 w-4 text-white" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-medium text-sm">{action.title}</p>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Future Sections Placeholder */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-dashed border-2 border-muted-foreground/20">
          <CardHeader>
            <CardTitle className="text-muted-foreground">CRM</CardTitle>
            <CardDescription>Em breve</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Sistema de gestão de relacionamento com clientes
            </p>
          </CardContent>
        </Card>

        <Card className="border-dashed border-2 border-muted-foreground/20">
          <CardHeader>
            <CardTitle className="text-muted-foreground">Painel Cliente</CardTitle>
            <CardDescription>Em breve</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Portal para acompanhamento de projetos
            </p>
          </CardContent>
        </Card>

        <Card className="border-dashed border-2 border-muted-foreground/20">
          <CardHeader>
            <CardTitle className="text-muted-foreground">Propostas</CardTitle>
            <CardDescription>Em breve</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Construtor automático de propostas
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}