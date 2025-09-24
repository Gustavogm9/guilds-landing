import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { useFeedback } from '@/hooks/useFeedback';
import { MessageSquare, Bug, Lightbulb, HelpCircle, Star, Upload, X } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface FeedbackWidgetProps {
  projectKey: string;
  moduleKey?: string;
  contactId?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: 'gestor' | 'usuario_final' | 'parceiro';
  };
  featureFlags?: {
    srs?: boolean;
    nps?: boolean;
    attachments?: boolean;
    ideas?: boolean;
    questions?: boolean;
  };
  theme?: 'light' | 'dark' | 'auto';
  locale?: string;
  className?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'inline';
}

type FeedbackMode = 'bug' | 'ideia' | 'duvida' | 'srs' | 'nps' | 'csat';

export const FeedbackWidget: React.FC<FeedbackWidgetProps> = ({
  projectKey,
  moduleKey,
  contactId,
  user,
  featureFlags = { srs: true, nps: true, attachments: true, ideas: true, questions: true },
  theme = 'auto',
  locale = 'pt-BR',
  className = '',
  position = 'bottom-right'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<FeedbackMode>('bug');
  const [verbatim, setVerbatim] = useState('');
  const [severity, setSeverity] = useState<'blocker' | 'high' | 'medium' | 'low' | 'idea'>('medium');
  const [score, setScore] = useState<number[]>([7]);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [context, setContext] = useState<Record<string, any>>({});

  const { submitFeedback, isSubmitting } = useFeedback();

  // Capture context when widget opens
  useEffect(() => {
    if (isOpen) {
      const captureContext = () => {
        const newContext = {
          url: window.location.href,
          path: window.location.pathname,
          timestamp: new Date().toISOString(),
          browser: navigator.userAgent,
          locale: navigator.language,
          screen: {
            width: window.screen.width,
            height: window.screen.height
          },
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight
          },
          referrer: document.referrer,
          moduleKey
        };
        setContext(newContext);
      };

      captureContext();
    }
  }, [isOpen, moduleKey]);

  const getModeConfig = (mode: FeedbackMode) => {
    const configs = {
        bug: {
          title: 'Reportar Bug',
          description: 'Encontrou um problema? Conte-nos sobre ele.',
          icon: Bug,
          color: 'destructive',
          requiresSeverity: true,
          requiresScore: false,
          scoreLabel: ''
        },
        ideia: {
          title: 'Sugerir Ideia',
          description: 'Tem uma ideia para melhorar? Compartilhe conosco!',
          icon: Lightbulb,
          color: 'default',
          requiresSeverity: false,
          requiresScore: false,
          scoreLabel: ''
        },
        duvida: {
          title: 'Fazer Pergunta',
          description: 'Precisa de ajuda? Estamos aqui para esclarecer.',
          icon: HelpCircle,
          color: 'secondary',
          requiresSeverity: false,
          requiresScore: false,
          scoreLabel: ''
        },
      srs: {
        title: 'Sprint Review',
        description: 'Como foi sua experiência com as funcionalidades apresentadas?',
        icon: MessageSquare,
        color: 'default',
        requiresSeverity: false,
        requiresScore: true,
        scoreLabel: 'Utilidade (0-10)'
      },
      nps: {
        title: 'Recomendação',
        description: 'O quanto você recomendaria nosso produto?',
        icon: Star,
        color: 'default',
        requiresSeverity: false,
        requiresScore: true,
        scoreLabel: 'Probabilidade de Recomendação (0-10)'
      },
      csat: {
        title: 'Satisfação',
        description: 'Como avalia sua satisfação com o atendimento?',
        icon: Star,
        color: 'default',
        requiresSeverity: false,
        requiresScore: true,
        scoreLabel: 'Satisfação (1-5)'
      }
    };

    return configs[mode];
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      const maxSize = 10 * 1024 * 1024; // 10MB
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'];
      
      if (file.size > maxSize) {
        toast({
          title: "Arquivo muito grande",
          description: `${file.name} excede o limite de 10MB`,
          variant: "destructive"
        });
        return false;
      }
      
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Tipo de arquivo não suportado",
          description: `${file.name} não é um tipo de arquivo válido`,
          variant: "destructive"
        });
        return false;
      }
      
      return true;
    });

    setAttachments(prev => [...prev, ...validFiles].slice(0, 5)); // Max 5 files
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!verbatim.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, descreva seu feedback",
        variant: "destructive"
      });
      return;
    }

    const config = getModeConfig(mode);
    
    try {
      // Upload attachments first (simplified - in real implementation would use Supabase Storage)
      const attachmentUrls: string[] = [];
      
      const feedbackData = {
        project_key: projectKey,
        module_key: moduleKey,
        contact_id: contactId,
        persona: user?.role || 'usuario_final',
        channel: 'inapp' as const,
        type: mode,
        score: config.requiresScore ? score[0] : undefined,
        severity: config.requiresSeverity ? severity : 'medium',
        verbatim: verbatim.trim(),
        context: {
          ...context,
          user_provided: {
            name: user?.name,
            email: user?.email
          }
        },
        attachments: attachmentUrls
      };

      await submitFeedback.mutateAsync(feedbackData);
      
      // Reset form
      setVerbatim('');
      setSeverity('medium');
      setScore([7]);
      setAttachments([]);
      setIsOpen(false);
      
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    }
  };

  const renderModeSelector = () => {
    const availableModes: FeedbackMode[] = [];
    
    if (featureFlags.ideas) availableModes.push('bug', 'ideia');
    if (featureFlags.questions) availableModes.push('duvida');
    if (featureFlags.srs) availableModes.push('srs');
    if (featureFlags.nps) availableModes.push('nps', 'csat');

    return (
      <div className="grid grid-cols-2 gap-2 mb-4">
        {availableModes.map((modeOption) => {
          const config = getModeConfig(modeOption);
          const Icon = config.icon;
          
          return (
            <Button
              key={modeOption}
              variant={mode === modeOption ? "default" : "outline"}
              size="sm"
              onClick={() => setMode(modeOption)}
              className="flex items-center gap-2 h-auto p-3"
            >
              <Icon className="h-4 w-4" />
              <span className="text-xs">{config.title}</span>
            </Button>
          );
        })}
      </div>
    );
  };

  const renderScoreInput = () => {
    const config = getModeConfig(mode);
    if (!config.requiresScore) return null;

    const maxScore = mode === 'csat' ? 5 : 10;
    const minScore = mode === 'csat' ? 1 : 0;

    return (
      <div className="space-y-3">
        <Label className="text-sm font-medium">{config.scoreLabel}</Label>
        <div className="px-2">
          <Slider
            value={score}
            onValueChange={setScore}
            max={maxScore}
            min={minScore}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{minScore}</span>
            <span className="font-medium text-base">{score[0]}</span>
            <span>{maxScore}</span>
          </div>
        </div>
      </div>
    );
  };

  const renderSeveritySelector = () => {
    const config = getModeConfig(mode);
    if (!config.requiresSeverity) return null;

    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium">Gravidade</Label>
        <Select value={severity} onValueChange={(value: any) => setSeverity(value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="blocker">🚨 Bloqueante</SelectItem>
            <SelectItem value="high">🔴 Alta</SelectItem>
            <SelectItem value="medium">🟡 Média</SelectItem>
            <SelectItem value="low">🟢 Baixa</SelectItem>
            <SelectItem value="idea">💡 Sugestão</SelectItem>
          </SelectContent>
        </Select>
      </div>
    );
  };

  const config = getModeConfig(mode);
  const Icon = config.icon;

  const positionClasses = {
    'bottom-right': 'fixed bottom-6 right-6 z-50',
    'bottom-left': 'fixed bottom-6 left-6 z-50',
    'top-right': 'fixed top-6 right-6 z-50',
    'top-left': 'fixed top-6 left-6 z-50',
    'inline': ''
  };

  if (position === 'inline') {
    return (
      <Card className={`w-full max-w-md ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon className="h-5 w-5" />
            {config.title}
          </CardTitle>
          <CardDescription>{config.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {renderModeSelector()}
          {renderScoreInput()}
          {renderSeveritySelector()}
          
          <div className="space-y-2">
            <Label className="text-sm font-medium">Sua mensagem *</Label>
            <Textarea
              value={verbatim}
              onChange={(e) => setVerbatim(e.target.value)}
              placeholder="Descreva detalhadamente..."
              className="min-h-[100px]"
            />
          </div>

          {featureFlags.attachments && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Anexos (opcional)</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  multiple
                  accept="image/*,.pdf,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('file-upload')?.click()}
                  disabled={attachments.length >= 5}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Anexar arquivo
                </Button>
                <span className="text-xs text-muted-foreground">
                  {attachments.length}/5 arquivos
                </span>
              </div>
              
              {attachments.length > 0 && (
                <div className="space-y-1">
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="text-sm truncate flex-1">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAttachment(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || !verbatim.trim()}
            className="w-full"
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Feedback'}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className={positionClasses[position]}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            className="rounded-full w-12 h-12 shadow-lg hover:shadow-xl transition-shadow"
            size="default"
          >
            <MessageSquare className="h-5 w-5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Icon className="h-5 w-5" />
              {config.title}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {renderModeSelector()}
            {renderScoreInput()}
            {renderSeveritySelector()}
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Sua mensagem *</Label>
              <Textarea
                value={verbatim}
                onChange={(e) => setVerbatim(e.target.value)}
                placeholder="Descreva detalhadamente..."
                className="min-h-[100px]"
              />
            </div>

            {featureFlags.attachments && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Anexos (opcional)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    multiple
                    accept="image/*,.pdf,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload-dialog"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('file-upload-dialog')?.click()}
                    disabled={attachments.length >= 5}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Anexar
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    {attachments.length}/5
                  </span>
                </div>
                
                {attachments.length > 0 && (
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded text-sm">
                        <span className="truncate flex-1">{file.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAttachment(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting || !verbatim.trim()}
              className="w-full"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Feedback'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};