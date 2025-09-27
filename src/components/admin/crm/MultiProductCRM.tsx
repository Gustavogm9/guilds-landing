import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Building, 
  Phone, 
  Mail, 
  Tag, 
  Calendar,
  MapPin,
  ExternalLink,
  Edit,
  MessageSquare,
  TrendingUp,
  Filter
} from 'lucide-react';
import { useMultiProduct } from '@/contexts/MultiProductContext';
import { useCRM, CRMContact, CRMDeal } from '@/hooks/useCRM';
import { ProductFilter } from '@/components/admin/filters/ProductFilter';

interface EnhancedContact extends CRMContact {
  product: 'guilds' | 'doavya';
  dealCount: number;
  totalValue: number;
  lastActivity: string;
  activityType: string;
  priority: 'high' | 'medium' | 'low';
}

export function MultiProductCRM() {
  const { activeProduct, products } = useMultiProduct();
  const { contacts, contactsLoading } = useCRM();
  const [filteredContacts, setFilteredContacts] = useState<EnhancedContact[]>([]);
  const [selectedContact, setSelectedContact] = useState<EnhancedContact | null>(null);

  useEffect(() => {
    if (contacts) {
      // Enhance contacts with product classification and additional data
      const enhanced: EnhancedContact[] = contacts.map(contact => {
        // Determine product based on source or tags
        const product = (contact as any).source === 'doavya' || 
                       contact.tags?.includes('doavya') ? 'doavya' : 'guilds';
        
        return {
          ...contact,
          product,
          dealCount: Math.floor(Math.random() * 5) + 1, // Mock data
          totalValue: Math.floor(Math.random() * 100000) + 10000, // Mock data
          lastActivity: `${Math.floor(Math.random() * 30) + 1} dias atrás`,
          activityType: ['email', 'call', 'whatsapp', 'meeting'][Math.floor(Math.random() * 4)],
          priority: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as 'high' | 'medium' | 'low'
        };
      });

      // Filter by active product
      const filtered = activeProduct === 'all' 
        ? enhanced 
        : enhanced.filter(contact => contact.product === activeProduct);

      setFilteredContacts(filtered);
    }
  }, [contacts, activeProduct]);

  const getProductColor = (product: string) => {
    const productConfig = products.find(p => p.slug === product);
    return productConfig?.color || 'hsl(var(--primary))';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'email': return Mail;
      case 'call': return Phone;
      case 'whatsapp': return MessageSquare;
      case 'meeting': return Calendar;
      default: return Users;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Statistics by product
  const guildContacts = filteredContacts.filter(c => c.product === 'guilds');
  const doavyaContacts = filteredContacts.filter(c => c.product === 'doavya');

  const stats = {
    total: filteredContacts.length,
    guilds: guildContacts.length,
    doavya: doavyaContacts.length,
    highPriority: filteredContacts.filter(c => c.priority === 'high').length,
    totalValue: filteredContacts.reduce((sum, c) => sum + c.totalValue, 0)
  };

  if (contactsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">CRM Multi-Produto</h2>
            <p className="text-muted-foreground">Carregando dados...</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">CRM Multi-Produto</h2>
          <p className="text-muted-foreground">
            Gestão unificada de contatos e oportunidades por linha de produto
          </p>
        </div>
        <Button className="gap-2">
          <Users className="w-4 h-4" />
          Novo Contato
        </Button>
      </div>

      {/* Filters */}
      <ProductFilter compact />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Contatos
              </CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {stats.total}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: getProductColor('guilds') }}
                />
                <span className="text-xs text-muted-foreground">{stats.guilds}</span>
              </div>
              <div className="flex items-center gap-1">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: getProductColor('doavya') }}
                />
                <span className="text-xs text-muted-foreground">{stats.doavya}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Alta Prioridade
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-red-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {stats.highPriority}
            </div>
            <Badge variant="destructive" className="text-xs mt-1">
              Requer atenção
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Valor Total
              </CardTitle>
              <Building className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(stats.totalValue)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Em oportunidades ativas
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Ticket Médio
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(stats.total > 0 ? stats.totalValue / stats.total : 0)}
            </div>
            <Badge variant="secondary" className="text-xs mt-1">
              Por contato
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="contacts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="contacts">Contatos</TabsTrigger>
          <TabsTrigger value="segments">Segmentação</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="contacts" className="space-y-4">
          <div className="grid gap-4">
            {filteredContacts.map(contact => {
              const ActivityIcon = getActivityIcon(contact.activityType);
              return (
                <Card 
                  key={contact.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedContact(contact)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div 
                          className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                          style={{ backgroundColor: getProductColor(contact.product) }}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-lg">{contact.name}</CardTitle>
                            <Badge variant={getPriorityColor(contact.priority)} className="text-xs">
                              {contact.priority}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            {contact.company && (
                              <div className="flex items-center gap-1">
                                <Building className="w-3 h-3" />
                                {contact.company}
                              </div>
                            )}
                            {contact.email && (
                              <div className="flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {contact.email}
                              </div>
                            )}
                            {contact.phone && (
                              <div className="flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {contact.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-lg font-bold text-primary">{contact.dealCount}</p>
                          <p className="text-xs text-muted-foreground">Negócios</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-green-600">
                            {formatCurrency(contact.totalValue)}
                          </p>
                          <p className="text-xs text-muted-foreground">Valor Total</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <ActivityIcon className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Última atividade</p>
                            <p className="text-xs text-muted-foreground">{contact.lastActivity}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {contact.tags?.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="segments" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {products.map(product => {
              const productContacts = filteredContacts.filter(c => c.product === product.slug);
              const productValue = productContacts.reduce((sum, c) => sum + c.totalValue, 0);
              const highPriorityCount = productContacts.filter(c => c.priority === 'high').length;
              
              return (
                <Card key={product.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: product.color }}
                      />
                      {product.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <p className="text-2xl font-bold" style={{ color: product.color }}>
                          {productContacts.length}
                        </p>
                        <p className="text-sm text-muted-foreground">Contatos</p>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <p className="text-lg font-bold" style={{ color: product.color }}>
                          {formatCurrency(productValue)}
                        </p>
                        <p className="text-sm text-muted-foreground">Valor</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Alta prioridade</span>
                        <Badge variant="destructive">{highPriorityCount}</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Ticket médio</span>
                        <span className="font-medium">
                          {formatCurrency(productContacts.length > 0 ? productValue / productContacts.length : 0)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Principais fontes:</h4>
                      <div className="flex flex-wrap gap-1">
                        {product.leadSources.map(source => (
                          <Badge key={source} variant="outline" className="text-xs">
                            {source}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Distribuição por Produto</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {products.map(product => {
                    const productCount = filteredContacts.filter(c => c.product === product.slug).length;
                    const percentage = stats.total > 0 ? (productCount / stats.total) * 100 : 0;
                    
                    return (
                      <div key={product.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: product.color }}
                          />
                          <span className="text-sm">{product.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{productCount}</span>
                          <Badge variant="outline">
                            {percentage.toFixed(1)}%
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Distribuição por Prioridade</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['high', 'medium', 'low'].map(priority => {
                    const count = filteredContacts.filter(c => c.priority === priority).length;
                    const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
                    
                    return (
                      <div key={priority} className="flex items-center justify-between">
                        <span className="text-sm capitalize">{priority}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{count}</span>
                          <Badge variant={getPriorityColor(priority)}>
                            {percentage.toFixed(1)}%
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Ações Recomendadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>{stats.highPriority} contatos precisam de atenção</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Revisar segmentação por produto</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Oportunidade de cross-sell</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}