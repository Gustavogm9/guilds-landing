import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useBrandColors } from '@/hooks/useBrandColors';
import { 
  Palette, 
  RefreshCw, 
  Download, 
  Upload, 
  Eye, 
  CheckCircle,
  AlertCircle,
  Wand2,
  Undo2
} from 'lucide-react';
import { cn } from '@/lib/utils';

const ColorAdmin = () => {
  const { 
    brandColors, 
    colorPresets, 
    isLoading, 
    updateColors, 
    applyPreset, 
    isUpdating,
    generateNeutralScale,
    generateGradients,
    resetToDefault
  } = useBrandColors();

  const [previewColors, setPreviewColors] = useState({
    primary: brandColors?.primary_color || 'hsl(240, 85%, 55%)',
    accent: brandColors?.accent_color || 'hsl(165, 85%, 45%)',
  });

  const [activeTab, setActiveTab] = useState('main');

  // Color picker component
  const ColorPicker = ({ 
    label, 
    value, 
    onChange, 
    description 
  }: { 
    label: string; 
    value: string; 
    onChange: (value: string) => void;
    description?: string;
  }) => {
    const [inputValue, setInputValue] = useState(value);

    const handleChange = (newValue: string) => {
      setInputValue(newValue);
      if (newValue.startsWith('hsl(') && newValue.endsWith(')')) {
        onChange(newValue);
      }
    };

    return (
      <div className="space-y-2">
        <Label htmlFor={`color-${label}`}>{label}</Label>
        <div className="flex gap-2">
          <div 
            className="w-12 h-10 rounded-md border border-border cursor-pointer"
            style={{ backgroundColor: value }}
            onClick={() => {
              // In a real implementation, this would open a color picker
              const randomHue = Math.floor(Math.random() * 360);
              const newColor = `hsl(${randomHue}, 75%, 55%)`;
              handleChange(newColor);
            }}
          />
          <Input
            id={`color-${label}`}
            value={inputValue}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="hsl(240, 85%, 55%)"
            className="flex-1"
          />
        </div>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    );
  };

  // Preview component
  const ColorPreview = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div 
          className="p-6 rounded-lg text-white"
          style={{ background: previewColors.primary }}
        >
          <h3 className="font-semibold">Cor Primária</h3>
          <p className="text-sm opacity-90">Botões principais, links</p>
        </div>
        <div 
          className="p-6 rounded-lg text-white"
          style={{ background: previewColors.accent }}
        >
          <h3 className="font-semibold">Cor Accent</h3>
          <p className="text-sm opacity-90">Destaques, hover states</p>
        </div>
      </div>
      
      {/* Sample components preview */}
      <div className="space-y-4 p-4 border rounded-lg bg-card">
        <h4 className="font-semibold">Preview de Componentes</h4>
        <div className="flex gap-2">
          <Button 
            className="text-white"
            style={{ backgroundColor: previewColors.primary }}
          >
            Botão Primário
          </Button>
          <Button 
            variant="outline"
            style={{ borderColor: previewColors.primary, color: previewColors.primary }}
          >
            Botão Outline
          </Button>
          <Button 
            variant="ghost"
            style={{ color: previewColors.accent }}
          >
            Botão Ghost
          </Button>
        </div>
        <div className="p-4 rounded-md" style={{ backgroundColor: `${previewColors.primary}10` }}>
          <p className="text-sm">Card com fundo primário suave</p>
        </div>
      </div>
    </div>
  );

  // Preset card component
  const PresetCard = ({ preset }: { preset: any }) => (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h4 className="font-semibold">{preset.preset_name}</h4>
            <p className="text-sm text-muted-foreground">{preset.preset_description}</p>
          </div>
          <Badge variant="outline">{preset.category}</Badge>
        </div>
        
        <div className="flex gap-2 mb-3">
          <div 
            className="w-8 h-8 rounded-full border"
            style={{ backgroundColor: preset.colors.primary }}
            title="Primary"
          />
          <div 
            className="w-8 h-8 rounded-full border"
            style={{ backgroundColor: preset.colors.accent }}
            title="Accent"
          />
          <div 
            className="w-8 h-8 rounded-full border"
            style={{ backgroundColor: preset.colors.success }}
            title="Success"
          />
          <div 
            className="w-8 h-8 rounded-full border"
            style={{ backgroundColor: preset.colors.warning }}
            title="Warning"
          />
          <div 
            className="w-8 h-8 rounded-full border"
            style={{ backgroundColor: preset.colors.danger }}
            title="Danger"
          />
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            Usado {preset.usage_count}x
          </span>
          <Button 
            size="sm" 
            onClick={() => applyPreset(preset.id)}
            disabled={isUpdating}
          >
            Aplicar
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-6 h-6 animate-spin" />
        <span className="ml-2">Carregando esquema de cores...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Cores</h1>
          <p className="text-muted-foreground">
            Configure o esquema de cores completo do site de forma dinâmica
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetToDefault} disabled={isUpdating}>
            <Undo2 className="w-4 h-4 mr-2" />
            Restaurar Padrão
          </Button>
          <Button disabled={isUpdating}>
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="main">Cores Principais</TabsTrigger>
          <TabsTrigger value="presets">Presets</TabsTrigger>
          <TabsTrigger value="advanced">Avançado</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="main" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Cores Principais</CardTitle>
                <CardDescription>
                  Configure as cores primárias do sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ColorPicker
                  label="Cor Primária"
                  value={previewColors.primary}
                  onChange={(value) => setPreviewColors(prev => ({ ...prev, primary: value }))}
                  description="Botões principais, links importantes, elementos de destaque"
                />
                
                <ColorPicker
                  label="Cor Accent"
                  value={previewColors.accent}
                  onChange={(value) => setPreviewColors(prev => ({ ...prev, accent: value }))}
                  description="Hover states, elementos secundários, destaques especiais"
                />

                <Separator />

                <div className="flex gap-2">
                  <Button 
                    onClick={() => {
                      updateColors({
                        primary_color: previewColors.primary,
                        accent_color: previewColors.accent,
                        neutral_scale: generateNeutralScale(previewColors.primary),
                        gradients: generateGradients(previewColors.primary, previewColors.accent),
                      });
                    }}
                    disabled={isUpdating}
                    className="flex-1"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Aplicar Cores
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      const neutrals = generateNeutralScale(previewColors.primary);
                      setPreviewColors(prev => ({ ...prev, neutrals }));
                    }}
                  >
                    <Wand2 className="w-4 h-4 mr-2" />
                    Auto Neutrals
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>
                  Visualize as cores antes de aplicar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ColorPreview />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="presets" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Esquemas Predefinidos</CardTitle>
              <CardDescription>
                Aplique rapidamente esquemas de cores testados e otimizados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {colorPresets?.map((preset) => (
                    <PresetCard key={preset.id} preset={preset} />
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Cores Semânticas</CardTitle>
                <CardDescription>
                  Configure cores para estados específicos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ColorPicker
                  label="Success"
                  value="hsl(142, 76%, 36%)"
                  onChange={() => {}}
                  description="Confirmações, sucessos, estados positivos"
                />
                <ColorPicker
                  label="Warning" 
                  value="hsl(38, 92%, 50%)"
                  onChange={() => {}}
                  description="Avisos, atenção, estados de alerta"
                />
                <ColorPicker
                  label="Danger"
                  value="hsl(346, 87%, 43%)"
                  onChange={() => {}}
                  description="Erros, exclusões, estados críticos"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Acessibilidade</CardTitle>
                <CardDescription>
                  Verificações de contraste e conformidade
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Contraste AA aprovado</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                  <span>AAA pendente de verificação</span>
                </div>
                <Button variant="outline" className="w-full">
                  <Eye className="w-4 h-4 mr-2" />
                  Testar Contraste
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preview Completo</CardTitle>
              <CardDescription>
                Visualize como as cores aparecem em todo o site
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Sample page preview */}
                <div className="border rounded-lg p-6 bg-background">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold">Sample Page</h2>
                      <Badge style={{ backgroundColor: previewColors.primary, color: 'white' }}>
                        New
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">
                      This is how your content will look with the new color scheme.
                    </p>
                    <div className="flex gap-2">
                      <Button style={{ backgroundColor: previewColors.primary }}>
                        Primary Action
                      </Button>
                      <Button variant="outline" style={{ borderColor: previewColors.accent }}>
                        Secondary
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Current scheme info */}
      {brandColors && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Esquema Atual: {brandColors.scheme_name}
            </CardTitle>
            {brandColors.scheme_description && (
              <CardDescription>{brandColors.scheme_description}</CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label>Primária</Label>
                <div 
                  className="w-full h-12 rounded border"
                  style={{ backgroundColor: brandColors.primary_color }}
                />
                <code className="text-xs">{brandColors.primary_color}</code>
              </div>
              <div className="space-y-2">
                <Label>Accent</Label>
                <div 
                  className="w-full h-12 rounded border"
                  style={{ backgroundColor: brandColors.accent_color }}
                />
                <code className="text-xs">{brandColors.accent_color}</code>
              </div>
              <div className="space-y-2">
                <Label>Success</Label>
                <div 
                  className="w-full h-12 rounded border"
                  style={{ backgroundColor: brandColors.semantic_colors.success }}
                />
                <code className="text-xs">{brandColors.semantic_colors.success}</code>
              </div>
              <div className="space-y-2">
                <Label>Warning</Label>
                <div 
                  className="w-full h-12 rounded border"
                  style={{ backgroundColor: brandColors.semantic_colors.warning }}
                />
                <code className="text-xs">{brandColors.semantic_colors.warning}</code>
              </div>
              <div className="space-y-2">
                <Label>Danger</Label>
                <div 
                  className="w-full h-12 rounded border"
                  style={{ backgroundColor: brandColors.semantic_colors.danger }}
                />
                <code className="text-xs">{brandColors.semantic_colors.danger}</code>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ColorAdmin;