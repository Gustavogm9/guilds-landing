import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Mail, 
  FileText, 
  TrendingUp, 
  Globe, 
  Briefcase,
  Calendar,
  Activity,
  ArrowUpRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const mockStats = [
  {
    title: "Total de Contatos",
    value: "1,234",
    change: "+12%",
    changeType: "positive" as const,
    icon: Users,
    href: "/admin/contacts"
  },
  {
    title: "Newsletter Inscritos",
    value: "856",
    change: "+8%",
    changeType: "positive" as const,
    icon: Mail,
    href: "/admin/newsletter"
  },
  {
    title: "Formulários Enviados",
    value: "342", 
    change: "+23%",
    changeType: "positive" as const,
    icon: FileText,
    href: "/admin/forms"
  },
  {
    title: "Páginas Visitadas",
    value: "12.5K",
    change: "+4%",
    changeType: "positive" as const,
    icon: TrendingUp,
    href: "/admin/seo"
  }
];

const recentActivities = [
  {
    type: "contact",
    title: "Nova qualificação recebida",
    description: "João Silva enviou formulário de contato",
    time: "2 min atrás",
    icon: Users
  },
  {
    type: "newsletter",
    title: "Nova inscrição newsletter",
    description: "maria@exemplo.com se inscreveu",
    time: "15 min atrás", 
    icon: Mail
  },
  {
    type: "team",
    title: "Perfil da equipe atualizado",
    description: "Pedro Santos atualizou seu currículo",
    time: "1 hora atrás",
    icon: Briefcase
  },
  {
    type: "seo",
    title: "Meta descrição otimizada",
    description: "Página de serviços foi atualizada",
    time: "2 horas atrás",
    icon: Globe
  }
];

const quickActions = [
  {
    title: "Gerenciar Equipe",
    description: "Adicionar ou editar membros",
    icon: Users,
    href: "/admin/team",
    color: "bg-blue-500"
  },
  {
    title: "Configurar SEO",
    description: "Otimizar meta tags",
    icon: Globe,
    href: "/admin/seo", 
    color: "bg-green-500"
  },
  {
    title: "Ver Contatos",
    description: "Gerenciar leads",
    icon: FileText,
    href: "/admin/contacts",
    color: "bg-purple-500"
  },
  {
    title: "Logos & Brand",
    description: "Atualizar assets visuais",
    icon: Briefcase,
    href: "/admin/logos",
    color: "bg-orange-500"
  }
];

export function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-sora font-bold text-foreground">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Visão geral do sistema administrativo da Guilds
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {mockStats.map((stat) => (
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
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <Badge 
                  variant={stat.changeType === 'positive' ? 'default' : 'destructive'}
                  className="text-xs mr-1"
                >
                  {stat.change}
                </Badge>
                <span>em relação ao mês anterior</span>
              </div>
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
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <activity.icon className="h-4 w-4 text-muted-foreground" />
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
            ))}
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