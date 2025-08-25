import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { LogoService } from '@/lib/logoService';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Logo {
  id: string;
  name: string;
  type: 'symbol' | 'full' | 'text';
  variant: 'light' | 'dark' | 'color' | 'transparent';
  file_path: string;
  public_url: string;
  width?: number;
  height?: number;
  usage_context?: string;
  is_active: boolean;
}

interface EditLogoDialogProps {
  logo: Logo | null;
  open: boolean;
  onClose: () => void;
  onSave: () => void;
}

const USAGE_CONTEXTS = [
  'Headers e navegação',
  'Ícones e favicons', 
  'Business cards',
  'Documentos oficiais',
  'Apresentações',
  'Website e landing pages',
  'Redes sociais',
  'Materiais de marketing',
  'Produtos físicos',
  'Assinatura de email'
];

export function EditLogoDialog({ logo, open, onClose, onSave }: EditLogoDialogProps) {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: logo?.name || '',
    type: logo?.type || 'full',
    variant: logo?.variant || 'color',
    width: logo?.width?.toString() || '',
    height: logo?.height?.toString() || '',
    selectedContexts: logo?.usage_context?.split(', ') || []
  });

  React.useEffect(() => {
    if (logo) {
      setFormData({
        name: logo.name,
        type: logo.type,
        variant: logo.variant,
        width: logo.width?.toString() || '',
        height: logo.height?.toString() || '',
        selectedContexts: logo.usage_context?.split(', ') || []
      });
    }
  }, [logo]);

  const handleContextChange = (context: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      selectedContexts: checked 
        ? [...prev.selectedContexts, context]
        : prev.selectedContexts.filter(c => c !== context)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!logo) return;

    setSaving(true);
    try {
      await LogoService.updateLogo(logo.id, {
        name: formData.name,
        type: formData.type,
        variant: formData.variant,
        width: formData.width ? parseInt(formData.width) : undefined,
        height: formData.height ? parseInt(formData.height) : undefined,
        usage_context: formData.selectedContexts.join(', ')
      });

      toast.success('Logo updated successfully!');
      onSave();
      onClose();
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update logo');
    } finally {
      setSaving(false);
    }
  };

  if (!logo) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Logo</DialogTitle>
          <DialogDescription>
            Update logo information and usage contexts
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="edit-name">Logo Name</Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Type</Label>
              <Select value={formData.type} onValueChange={(value: any) => 
                setFormData(prev => ({ ...prev, type: value }))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="symbol">Symbol</SelectItem>
                  <SelectItem value="full">Full Logo</SelectItem>
                  <SelectItem value="text">Text Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Variant</Label>
              <Select value={formData.variant} onValueChange={(value: any) => 
                setFormData(prev => ({ ...prev, variant: value }))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="color">Color</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="transparent">Transparent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-width">Width (px)</Label>
              <Input
                id="edit-width"
                type="number"
                value={formData.width}
                onChange={(e) => setFormData(prev => ({ ...prev, width: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="edit-height">Height (px)</Label>
              <Input
                id="edit-height"
                type="number"
                value={formData.height}
                onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label className="text-base font-medium">Usage Contexts</Label>
            <p className="text-sm text-muted-foreground mb-3">
              Select where this logo can be used
            </p>
            <div className="grid grid-cols-2 gap-3">
              {USAGE_CONTEXTS.map((context) => (
                <div key={context} className="flex items-center space-x-2">
                  <Checkbox
                    id={context}
                    checked={formData.selectedContexts.includes(context)}
                    onCheckedChange={(checked) => handleContextChange(context, !!checked)}
                  />
                  <Label 
                    htmlFor={context}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {context}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}