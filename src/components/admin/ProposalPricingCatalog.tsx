import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useProposals } from '@/hooks/useProposals';
import { Plus, DollarSign } from 'lucide-react';

const categoryLabels = {
  maintenance: 'Manutenção',
  partnership: 'Parceria',
  whitelabel: 'Whitelabel',
};

export const ProposalPricingCatalog = () => {
  const { pricingCatalog, pricingLoading } = useProposals();

  const groupedByCategory = pricingCatalog?.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof pricingCatalog>);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Catálogo de Preços</h2>
          <p className="text-muted-foreground">Gerencie planos e valores padrão</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Item
        </Button>
      </div>

      {pricingLoading ? (
        <div className="text-center py-8">Carregando catálogo...</div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {Object.entries(groupedByCategory || {}).map(([category, items]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle>{categoryLabels[category as keyof typeof categoryLabels]}</CardTitle>
                <CardDescription>{items?.length || 0} plano(s)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {items?.map((item) => (
                  <div key={item.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <div className="flex items-center gap-1 mt-1">
                          <DollarSign className="h-4 w-4 text-primary" />
                          <span className="text-lg font-bold text-primary">
                            {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: item.currency,
                            }).format(item.value)}
                          </span>
                          {category === 'maintenance' && (
                            <span className="text-xs text-muted-foreground">/mês</span>
                          )}
                        </div>
                      </div>
                      {item.is_active ? (
                        <Badge variant="secondary">Ativo</Badge>
                      ) : (
                        <Badge variant="outline">Inativo</Badge>
                      )}
                    </div>
                    {item.benefits && item.benefits.length > 0 && (
                      <ul className="space-y-1">
                        {item.benefits.map((benefit, idx) => (
                          <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                            <span className="text-primary mt-0.5">✓</span>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
