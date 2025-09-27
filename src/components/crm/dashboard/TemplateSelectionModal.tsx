import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { FileText, Star, Settings } from 'lucide-react';
import { useLegal } from '@/hooks/useLegal';

interface TemplateSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (templateId: string) => void;
  dealTitle?: string;
}

export function TemplateSelectionModal({ 
  isOpen, 
  onClose, 
  onSelectTemplate, 
  dealTitle 
}: TemplateSelectionModalProps) {
  const { templates } = useLegal();
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');

  const contractTypes = [
    { value: 'software', label: 'Desenvolvimento de Software' },
    { value: 'white_label', label: 'White Label' },
    { value: 'maintenance', label: 'Manutenção' },
    { value: 'consulting', label: 'Consultoria' },
    { value: 'saas', label: 'SaaS' },
    { value: 'standard', label: 'Padrão' }
  ];

  const handleConfirm = () => {
    if (selectedTemplateId) {
      onSelectTemplate(selectedTemplateId);
      onClose();
    }
  };

  const handleCancel = () => {
    setSelectedTemplateId('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Selecionar Template de Contrato
          </DialogTitle>
          <DialogDescription>
            {dealTitle ? (
              <>Escolha o template mais adequado para o deal "<strong>{dealTitle}</strong>"</>
            ) : (
              'Escolha o template mais adequado para gerar o contrato'
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <RadioGroup value={selectedTemplateId} onValueChange={setSelectedTemplateId}>
            <div className="grid gap-4 md:grid-cols-2">
              {templates.map((template) => (
                <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={template.id} id={template.id} />
                      <Label htmlFor={template.id} className="flex-1 cursor-pointer">
                        <CardTitle className="flex items-center text-base">
                          <FileText className="mr-2 h-4 w-4" />
                          {template.name}
                          {template.is_default && (
                            <Badge variant="secondary" className="ml-2 text-xs">
                              <Star className="mr-1 h-3 w-3" />
                              Padrão
                            </Badge>
                          )}
                        </CardTitle>
                      </Label>
                    </div>
                    <CardDescription className="ml-6">
                      {template.description || 'Sem descrição disponível'}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-0 space-y-3">
                    <div className="ml-6 space-y-2">
                      <Badge variant="outline" className="text-xs">
                        {contractTypes.find(t => t.value === template.contract_type)?.label || template.contract_type}
                      </Badge>
                      
                      {/* Template Configuration Preview */}
                      {template.default_clauses && template.default_clauses.length > 0 && (
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            <Settings className="mr-1 h-3 w-3" />
                            {template.default_clauses.length} cláusulas pré-configuradas
                          </Badge>
                        </div>
                      )}
                      
                      <div className="text-xs text-muted-foreground">
                        Atualizado em: {new Date(template.updated_at).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </RadioGroup>
          
          {templates.length === 0 && (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Nenhum template encontrado. Configure templates primeiro no sistema jurídico.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={!selectedTemplateId}
          >
            Gerar Contrato
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}