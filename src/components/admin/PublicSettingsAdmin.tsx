import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Shield, Eye, EyeOff } from 'lucide-react';

interface PublicSettingsForm {
  company_name: string;
  brand_primary_color: string;
  brand_accent_color: string;
  public_whatsapp_number: string;
  public_support_email: string;
}

export const PublicSettingsAdmin = () => {
  const queryClient = useQueryClient();
  
  // Fetch current public settings
  const { data: publicSettings, isLoading } = useQuery({
    queryKey: ['public-company-settings-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('public_company_settings')
        .select('*')
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const [formData, setFormData] = useState<PublicSettingsForm>({
    company_name: '',
    brand_primary_color: '',
    brand_accent_color: '',
    public_whatsapp_number: '',
    public_support_email: ''
  });

  // Update form when data loads
  useEffect(() => {
    if (publicSettings) {
      setFormData({
        company_name: publicSettings.company_name || '',
        brand_primary_color: publicSettings.brand_primary_color || '',
        brand_accent_color: publicSettings.brand_accent_color || '',
        public_whatsapp_number: publicSettings.public_whatsapp_number || '',
        public_support_email: publicSettings.public_support_email || ''
      });
    }
  }, [publicSettings]);

  // Update public settings mutation
  const updateMutation = useMutation({
    mutationFn: async (settings: Partial<PublicSettingsForm>) => {
      const { data, error } = await supabase
        .from('public_company_settings')
        .update(settings)
        .eq('id', publicSettings?.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['public-company-settings-admin'] });
      queryClient.invalidateQueries({ queryKey: ['public-company-settings'] });
      toast.success('Configurações públicas atualizadas com sucesso');
    },
    onError: (error) => {
      console.error('Error updating public settings:', error);
      toast.error('Erro ao atualizar configurações públicas');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            Configurações Públicas Seguras
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Estas informações são expostas publicamente no site. Configure apenas dados seguros para exposição pública.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company_name" className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-green-600" />
                  Nome da Empresa (Público)
                </Label>
                <Input
                  id="company_name"
                  value={formData.company_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                  placeholder="Nome da empresa"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="public_support_email" className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-green-600" />
                  Email Público
                </Label>
                <Input
                  id="public_support_email"
                  type="email"
                  value={formData.public_support_email}
                  onChange={(e) => setFormData(prev => ({ ...prev, public_support_email: e.target.value }))}
                  placeholder="email@empresa.com"
                />
                <p className="text-xs text-muted-foreground">
                  ⚠️ Este email será visível publicamente no site
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="public_whatsapp_number" className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-green-600" />
                  WhatsApp Público
                </Label>
                <Input
                  id="public_whatsapp_number"
                  value={formData.public_whatsapp_number}
                  onChange={(e) => setFormData(prev => ({ ...prev, public_whatsapp_number: e.target.value }))}
                  placeholder="+55 11 99999-9999"
                />
                <p className="text-xs text-muted-foreground">
                  ⚠️ Este número será visível publicamente no site
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand_primary_color" className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-green-600" />
                  Cor Primária
                </Label>
                <Input
                  id="brand_primary_color"
                  value={formData.brand_primary_color}
                  onChange={(e) => setFormData(prev => ({ ...prev, brand_primary_color: e.target.value }))}
                  placeholder="hsl(240, 85%, 55%)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand_accent_color" className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-green-600" />
                  Cor de Destaque  
                </Label>
                <Input
                  id="brand_accent_color"
                  value={formData.brand_accent_color}
                  onChange={(e) => setFormData(prev => ({ ...prev, brand_accent_color: e.target.value }))}
                  placeholder="hsl(165, 85%, 45%)"
                />
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button 
                type="submit" 
                disabled={updateMutation.isPending}
                className="btn-forge"
              >
                {updateMutation.isPending ? 'Salvando...' : 'Salvar Configurações Públicas'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border-orange-200 bg-orange-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <EyeOff className="h-5 w-5" />
            Informações Privadas Protegidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-orange-700 mb-3">
            As seguintes informações são mantidas privadas e só são acessíveis por usuários autenticados:
          </p>
          <ul className="text-sm text-orange-600 space-y-1">
            <li>• Emails internos e de suporte não-públicos</li>
            <li>• Números de telefone privados</li>
            <li>• Endereços completos da empresa</li>
            <li>• Configurações de tempo de resposta</li>
            <li>• Mensagens automáticas de formulários</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};