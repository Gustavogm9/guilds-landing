import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { 
  LayoutDashboard, 
  Image, 
  Palette, 
  Search, 
  FileText, 
  Mail, 
  Users, 
  Phone, 
  Building2,
  Briefcase,
  Heart,
  Activity,
  Lightbulb,
  DollarSign,
  Calculator,
  Shield,
  Database,
  Zap,
  Globe,
  GraduationCap
} from 'lucide-react';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { AdminHeader } from '@/components/auth/AdminHeader';

interface MenuItem {
  title: string;
  icon: React.ElementType;
  url?: string;
  color?: string;
  items?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    title: "Dashboard Principal",
    icon: LayoutDashboard,
    url: "/admin",
  },
  {
    title: "Multi-Produto",
    icon: Shield,
    items: [
      { title: "Dashboard Geral", icon: LayoutDashboard, url: "/admin?multiproduct=true" },
      { title: "CRM Multi-Produto", icon: Users, url: "/admin/crm-multiproduct" },
      { title: "Relatórios", icon: FileText, url: "/admin/reports" },
      { title: "Automações", icon: Zap, url: "/admin/automation" }
    ]
  },
  {
    title: "Usuários & Roles",
    icon: Shield,
    items: [
      { title: "Usuários", icon: Users, url: "/admin/users" },
      { title: "Roles", icon: Shield, url: "/admin/roles" },
      { title: "Auditoria", icon: Activity, url: "/admin/audit" }
    ]
  },
  {
    title: "Site Management",
    icon: Globe,
    items: [
      { title: "Logos", icon: Image, url: "/admin/logos" },
      { title: "Cores", icon: Palette, url: "/admin/colors" },
      { title: "SEO", icon: Search, url: "/admin/seo" },
      { title: "Newsletter", icon: Mail, url: "/admin/newsletter" },
      { title: "Contatos", icon: Phone, url: "/admin/contacts" }
    ]
  },
  {
    title: "Empresa",
    icon: Building2,
    items: [
      { title: "Equipe", icon: Users, url: "/admin/team" },
      { title: "Carreiras", icon: Briefcase, url: "/admin/careers" },
      { title: "Cultura", icon: Heart, url: "/admin/culture" }
    ]
  },
  {
    title: "Lab & Craft",
    icon: GraduationCap,
    items: [
      { title: "Lab", icon: GraduationCap, url: "/admin/lab" },
      { title: "Craft", icon: Lightbulb, url: "/admin/craft" }
    ]
  },
  {
    title: "CRM & Vendas",
    icon: Users,
    items: [
      { title: "Dashboard", icon: Database, url: "/admin/crm" },
      { title: "Formulários", icon: FileText, url: "/admin/forms" }
    ]
  },
  {
    title: "Projetos",
    icon: Briefcase,
    items: [
      { title: "Projetos", icon: Briefcase, url: "/admin/projects" }
    ]
  },
  {
    title: "Financeiro",
    icon: DollarSign,
    items: [
      { title: "Dashboard", icon: Calculator, url: "/admin/financial" },
      { title: "Folha de Pagamento", icon: DollarSign, url: "/admin/payroll" }
    ]
  },
  {
    title: "Feedback",
    icon: Activity,
    items: [
      { title: "Admin", icon: Activity, url: "/admin/feedback" },
      { title: "Métricas", icon: Activity, url: "/admin/feedback-metrics" },
      { title: "Live Metrics", icon: Activity, url: "/admin/feedback-live" },
      { title: "Notificações", icon: Activity, url: "/admin/feedback-notifications" },
      { title: "Exportar", icon: Activity, url: "/admin/feedback-export" }
    ]
  },
  {
    title: "Campanhas",
    icon: Mail,
    items: [
      { title: "Campanhas", icon: Mail, url: "/admin/campaigns" }
    ]
  },
  {
    title: "Sistema",
    icon: Activity,
    items: [
      { title: "Performance", icon: Activity, url: "/admin/performance" },
      { title: "Notificações", icon: Activity, url: "/admin/notifications" }
    ]
  }
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();

  const isActiveUrl = (url?: string) => {
    if (!url) return false;
    if (url === "/admin") {
      return location.pathname === "/admin" && !location.search.includes('multiproduct=true');
    }
    if (url.includes('multiproduct=true')) {
      return location.search.includes('multiproduct=true');
    }
    return location.pathname.startsWith(url);
  };

  const hasActiveChild = (items?: MenuItem[]) => {
    if (!items) return false;
    return items.some(item => isActiveUrl(item.url));
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar className="border-r">
          <SidebarContent>
            <div className="p-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                  <Shield className="w-4 h-4 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="font-semibold text-lg">Admin</h2>
                  <p className="text-xs text-muted-foreground">Painel de controle</p>
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1">
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {menuItems.map((item, index) => (
                      <SidebarMenuItem key={index}>
                        {item.items ? (
                          <Collapsible 
                            defaultOpen={hasActiveChild(item.items)} 
                            className="group/collapsible"
                          >
                            <CollapsibleTrigger asChild>
                              <SidebarMenuButton className="w-full justify-between">
                                <div className="flex items-center gap-2">
                                  <item.icon className="w-4 h-4" />
                                  <span>{item.title}</span>
                                </div>
                                {hasActiveChild(item.items) && (
                                  <Badge variant="secondary" className="ml-auto text-xs">
                                    ●
                                  </Badge>
                                )}
                              </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <div className="ml-4 border-l pl-4 mt-2 space-y-1">
                                {item.items.map((subItem, subIndex) => (
                                  <SidebarMenuButton
                                    key={subIndex}
                                    asChild
                                    isActive={isActiveUrl(subItem.url)}
                                  >
                                    <Link to={subItem.url || '#'} className="flex items-center gap-2">
                                      <subItem.icon className="w-3 h-3" />
                                      <span className="text-sm">{subItem.title}</span>
                                    </Link>
                                  </SidebarMenuButton>
                                ))}
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        ) : (
                          <SidebarMenuButton asChild isActive={isActiveUrl(item.url)}>
                            <Link to={item.url || '#'} className="flex items-center gap-2">
                              <item.icon className="w-4 h-4" />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        )}
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </ScrollArea>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-y-auto">
            <div className="container mx-auto p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}