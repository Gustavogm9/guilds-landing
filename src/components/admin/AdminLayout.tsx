import React from 'react';
import { Outlet, useLocation, NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Globe, 
  Building2, 
  GraduationCap, 
  FileText, 
  Settings,
  Users,
  Briefcase,
  Heart,
  Image,
  Search,
  Mail,
  Phone,
  FlaskConical,
  Palette,
  ChevronRight,
  Database,
  Kanban,
  FolderKanban
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AdminTopHeader } from './AdminTopHeader';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    url: "/admin",
    exact: true
  },
  {
    title: "Site Management",
    icon: Globe,
    items: [
      { title: "Logos", icon: Image, url: "/admin/logos" },
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
      { title: "Lab", icon: FlaskConical, url: "/admin/lab" },
      { title: "Craft", icon: Palette, url: "/admin/craft" }
    ]
  },
  {
    title: "Formulários",
    icon: FileText,
    items: [
      { title: "Qualificação", icon: FileText, url: "/admin/forms" }
    ]
  },
  {
    title: "CRM",
    icon: Database,
    items: [
      { title: "Admin", icon: Settings, url: "/admin/crm" },
      { title: "Projetos", icon: FolderKanban, url: "/admin/projects" },
      { title: "Kanban", icon: Kanban, url: "/admin/crm/kanban" }
    ]
  }
];

function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const collapsed = state === 'collapsed';
  
  const isActive = (url: string, exact = false) => {
    if (exact) {
      return location.pathname === url;
    }
    return location.pathname.startsWith(url);
  };

  const hasActiveChild = (items: any[]) => {
    return items.some(item => isActive(item.url));
  };

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarHeader className="border-b border-border p-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-gradient-to-br from-brand-primary to-brand-accent rounded-lg flex items-center justify-center">
              <Settings className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="font-sora font-semibold text-sm">Admin Panel</h2>
              <p className="text-xs text-muted-foreground">Guilds Management</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center">
            <div className="h-8 w-8 bg-gradient-to-br from-brand-primary to-brand-accent rounded-lg flex items-center justify-center">
              <Settings className="h-4 w-4 text-white" />
            </div>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <ScrollArea className="flex-1">
          <SidebarGroup>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.items ? (
                    <Collapsible
                      defaultOpen={hasActiveChild(item.items)}
                      className="group/collapsible"
                    >
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton 
                          className={`w-full justify-between ${hasActiveChild(item.items) ? 'bg-accent text-accent-foreground' : ''}`}
                        >
                          <div className="flex items-center gap-2">
                            <item.icon className="h-4 w-4" />
                            {!collapsed && <span>{item.title}</span>}
                          </div>
                          {!collapsed && (
                            <ChevronRight className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                          )}
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      {!collapsed && (
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton 
                                  asChild
                                  className={isActive(subItem.url) ? 'bg-primary text-primary-foreground' : ''}
                                >
                                  <NavLink to={subItem.url} className="flex items-center gap-2">
                                    <subItem.icon className="h-3 w-3" />
                                    <span>{subItem.title}</span>
                                  </NavLink>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      )}
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton 
                      asChild
                      className={isActive(item.url, item.exact) ? 'bg-primary text-primary-foreground' : ''}
                    >
                      <NavLink to={item.url} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </ScrollArea>
      </SidebarContent>
    </Sidebar>
  );
}

interface AdminLayoutProps {
  children?: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <AdminTopHeader />
          <main className="flex-1 p-6 overflow-auto">
            {children || <Outlet />}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}