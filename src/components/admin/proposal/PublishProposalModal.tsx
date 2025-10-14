import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Loader2, Copy, CheckCircle } from 'lucide-react';

interface PublishProposalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  proposalId: string;
  versionNumber: number;
  onPublished?: (url: string) => void;
}

export const PublishProposalModal = ({
  open,
  onOpenChange,
  proposalId,
  versionNumber,
  onPublished,
}: PublishProposalModalProps) => {
  const [expiresInDays, setExpiresInDays] = useState(30);
  const [generatePdf, setGeneratePdf] = useState(true);
  const [sendEmail, setSendEmail] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      // Se deve gerar PDF primeiro
      if (generatePdf) {
        const { error: pdfError } = await supabase.functions.invoke('proposal-generator', {
          body: { proposalId, versionNumber },
        });
        if (pdfError) throw pdfError;
      }

      // Publicar proposta
      const { data, error } = await supabase.functions.invoke('proposal-publisher', {
        body: { proposalId, versionNumber, expiresInDays },
      });

      if (error) throw error;

      setPublishedUrl(data.publicUrl);
      toast({
        title: 'Proposta publicada com sucesso!',
        description: 'Link público gerado.',
      });

      onPublished?.(data.publicUrl);
    } catch (error: any) {
      toast({
        title: 'Erro ao publicar proposta',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const copyToClipboard = () => {
    if (publishedUrl) {
      navigator.clipboard.writeText(publishedUrl);
      toast({ title: 'Link copiado!', description: 'URL copiada para área de transferência.' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Publicar Proposta</DialogTitle>
          <DialogDescription>
            Configure as opções de publicação da proposta.
          </DialogDescription>
        </DialogHeader>

        {publishedUrl ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-success">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Proposta publicada com sucesso!</span>
            </div>
            <div className="flex items-center gap-2">
              <Input value={publishedUrl} readOnly className="flex-1" />
              <Button size="icon" variant="outline" onClick={copyToClipboard}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="expires-days">Válido por (dias)</Label>
              <Input
                id="expires-days"
                type="number"
                min={1}
                max={365}
                value={expiresInDays}
                onChange={(e) => setExpiresInDays(Number(e.target.value))}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="generate-pdf"
                checked={generatePdf}
                onCheckedChange={(checked) => setGeneratePdf(checked as boolean)}
              />
              <Label htmlFor="generate-pdf" className="text-sm font-normal">
                Gerar PDF antes de publicar
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="send-email"
                checked={sendEmail}
                onCheckedChange={(checked) => setSendEmail(checked as boolean)}
              />
              <Label htmlFor="send-email" className="text-sm font-normal">
                Enviar e-mail para cliente
              </Label>
            </div>
          </div>
        )}

        <DialogFooter>
          {publishedUrl ? (
            <Button onClick={() => onOpenChange(false)}>Fechar</Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPublishing}>
                Cancelar
              </Button>
              <Button onClick={handlePublish} disabled={isPublishing}>
                {isPublishing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Publicar
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
