import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useContactInfo, ContactInfoItem } from '@/hooks/useContactInfo';
import { Plus, Edit2, Trash2, Mail, Phone, MapPin, Share2, Clock, Star } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ContactFormData {
  type: 'email' | 'phone' | 'address' | 'social' | 'other';
  label: string;
  value: string;
  is_primary: boolean;
  is_public: boolean;
  display_order: number;
  metadata?: any;
}

const ContactForm = ({ 
  contact, 
  onSave, 
  onCancel 
}: { 
  contact?: ContactInfoItem; 
  onSave: (data: ContactFormData) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState<ContactFormData>({
    type: contact?.type || 'email',
    label: contact?.label || '',
    value: contact?.value || '',
    is_primary: contact?.is_primary || false,
    is_public: contact?.is_public || false,
    display_order: contact?.display_order || 0,
    metadata: contact?.metadata || {}
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Tipo</Label>
          <Select value={formData.type} onValueChange={(value: ContactFormData['type']) => setFormData(prev => ({ ...prev, type: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="phone">Telefone</SelectItem>
              <SelectItem value="address">Endereço</SelectItem>
              <SelectItem value="social">Rede Social</SelectItem>
              <SelectItem value="other">Outro</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="label">Rótulo</Label>
          <Input
            id="label"
            value={formData.label}
            onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
            placeholder="Ex: Principal, Comercial, LinkedIn"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="value">Valor</Label>
        <Textarea
          id="value"
          value={formData.value}
          onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
          placeholder="Digite o valor do contato..."
          rows={3}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="is_primary"
            checked={formData.is_primary}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_primary: checked }))}
          />
          <Label htmlFor="is_primary">Contato principal</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="is_public"
            checked={formData.is_public}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_public: checked }))}
          />
          <Label htmlFor="is_public">Público</Label>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="order">Ordem de exibição</Label>
        <Input
          id="order"
          type="number"
          value={formData.display_order}
          onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
          min="0"
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          Salvar
        </Button>
      </div>
    </form>
  );
};

export const ContactAdmin = () => {
  const {
    companySettings,
    contactItems,
    isLoading,
    updateSettings,
    addContact,
    updateContact,
    deleteContact,
    isAddingContact: addingInProgress,
    isUpdatingContact: updatingInProgress,
    isDeletingContact: deletingInProgress,
    isUpdatingSettings: updatingSettingsInProgress,
  } = useContactInfo();

  const [editingContact, setEditingContact] = useState<ContactInfoItem | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [settingsForm, setSettingsForm] = useState({
    company_name: '',
    response_time_hours: 2,
    auto_response_message: ''
  });

  // Update form when settings load
  useEffect(() => {
    if (companySettings) {
      setSettingsForm({
        company_name: companySettings.company_name || '',
        response_time_hours: companySettings.response_time_hours || 2,
        auto_response_message: companySettings.auto_response_message || ''
      });
    }
  }, [companySettings]);

  const handleSaveContact = useCallback((data: ContactFormData) => {
    if (editingContact) {
      updateContact({ ...editingContact, ...data });
      setEditingContact(null);
      setIsEditDialogOpen(false);
    } else {
      addContact({
        ...data,
        is_active: true
      });
      setIsAddDialogOpen(false);
    }
  }, [editingContact, updateContact, addContact]);

  const handleCancelContact = useCallback(() => {
    setEditingContact(null);
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
  }, []);

  const handleEditContact = useCallback((contact: ContactInfoItem) => {
    setEditingContact(contact);
    setIsEditDialogOpen(true);
  }, []);

  const handleUpdateSettings = useCallback(() => {
    updateSettings(settingsForm);
  }, [settingsForm, updateSettings]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'phone': return <Phone className="h-4 w-4" />;
      case 'address': return <MapPin className="h-4 w-4" />;
      case 'social': return <Share2 className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Carregando...</div>;
  }

  const groupedContacts = contactItems.reduce((acc, item) => {
    if (!acc[item.type]) acc[item.type] = [];
    acc[item.type].push(item);
    return acc;
  }, {} as Record<string, ContactInfoItem[]>);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="contacts" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="contacts">Contatos</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
          <TabsTrigger value="hours">Horários</TabsTrigger>
        </TabsList>

        <TabsContent value="contacts" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Informações de Contato</h3>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button disabled={addingInProgress}>
                  <Plus className="h-4 w-4 mr-2" />
                  {addingInProgress ? 'Adicionando...' : 'Adicionar Contato'}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Novo Contato</DialogTitle>
                </DialogHeader>
                <ContactForm
                  onSave={handleSaveContact}
                  onCancel={handleCancelContact}
                />
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {Object.entries(groupedContacts).map(([type, contacts]) => (
              <Card key={type}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 capitalize">
                    {getTypeIcon(type)}
                    {type === 'email' ? 'Emails' :
                     type === 'phone' ? 'Telefones' :
                     type === 'address' ? 'Endereços' :
                     type === 'social' ? 'Redes Sociais' : 'Outros'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {contacts.map((contact) => (
                      <div key={contact.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium">{contact.label}</span>
                            {contact.is_primary && (
                              <Badge variant="secondary" className="text-xs">
                                <Star className="h-3 w-3 mr-1" />
                                Principal
                              </Badge>
                            )}
                            {contact.is_public ? (
                              <Badge variant="outline" className="text-xs text-green-600 border-green-200">
                                Público
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs text-orange-600 border-orange-200">
                                Privado
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{contact.value}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Dialog open={isEditDialogOpen && editingContact?.id === contact.id} onOpenChange={(open) => {
                            if (!open) {
                              setIsEditDialogOpen(false);
                              setEditingContact(null);
                            }
                          }}>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditContact(contact)}
                                disabled={updatingInProgress}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Editar Contato</DialogTitle>
                              </DialogHeader>
                              <ContactForm
                                contact={editingContact || undefined}
                                onSave={handleSaveContact}
                                onCancel={handleCancelContact}
                              />
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => contact.id && deleteContact(contact.id)}
                            disabled={deletingInProgress}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company_name">Nome da Empresa</Label>
                <Input
                  id="company_name"
                  value={settingsForm.company_name}
                  onChange={(e) => setSettingsForm(prev => ({ ...prev, company_name: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="response_time">Tempo de Resposta (horas)</Label>
                <Input
                  id="response_time"
                  type="number"
                  value={settingsForm.response_time_hours}
                  onChange={(e) => setSettingsForm(prev => ({ ...prev, response_time_hours: parseInt(e.target.value) }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="auto_message">Mensagem Automática</Label>
                <Textarea
                  id="auto_message"
                  value={settingsForm.auto_response_message}
                  onChange={(e) => setSettingsForm(prev => ({ ...prev, auto_response_message: e.target.value }))}
                  rows={3}
                />
              </div>

              <Button onClick={handleUpdateSettings} disabled={updatingSettingsInProgress}>
                {updatingSettingsInProgress ? 'Salvando...' : 'Salvar Configurações'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hours" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Horários de Funcionamento</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Funcionalidade de horários em desenvolvimento. Por enquanto, os horários são configurados via JSON nas configurações.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};