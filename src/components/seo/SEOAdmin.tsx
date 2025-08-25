import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSEO, type SEOSettings, type PageSEO, type CustomTag } from '@/hooks/useSEO';
import { useToast } from '@/hooks/use-toast';
import { Globe, Settings, Tag, Code, Trash2, Edit, Plus, Eye, ExternalLink } from 'lucide-react';

export function SEOAdmin() {
  const { 
    seoSettings, 
    pageSEO, 
    customTags, 
    loading, 
    updateSEOSettings, 
    upsertPageSEO, 
    createCustomTag, 
    updateCustomTag, 
    deleteCustomTag 
  } = useSEO();
  
  const { toast } = useToast();
  
  const [editingPage, setEditingPage] = useState<PageSEO | null>(null);
  const [editingTag, setEditingTag] = useState<CustomTag | null>(null);
  const [isPageDialogOpen, setIsPageDialogOpen] = useState(false);
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [newPageData, setNewPageData] = useState<Partial<PageSEO>>({
    page_path: '',
    title: '',
    meta_description: '',
    no_index: false,
    no_follow: false
  });
  const [newTagData, setNewTagData] = useState<Partial<CustomTag>>({
    name: '',
    tag_type: 'head',
    content: '',
    position: 'head',
    is_active: true
  });

  if (loading) {
    return <div className="flex items-center justify-center p-8">Carregando configurações de SEO...</div>;
  }

  const handleGlobalSettingsUpdate = async (field: keyof SEOSettings, value: string) => {
    try {
      await updateSEOSettings({ [field]: value });
      toast({ title: "Configurações atualizadas com sucesso!" });
    } catch (error) {
      toast({ 
        title: "Erro ao atualizar configurações",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive"
      });
    }
  };

  const handlePageSave = async () => {
    if (!newPageData.page_path || !newPageData.title || !newPageData.meta_description) {
      toast({ title: "Preencha todos os campos obrigatórios", variant: "destructive" });
      return;
    }

    try {
      await upsertPageSEO({
        page_path: newPageData.page_path,
        title: newPageData.title,
        meta_description: newPageData.meta_description,
        og_title: newPageData.og_title,
        og_description: newPageData.og_description,
        og_image: newPageData.og_image,
        twitter_title: newPageData.twitter_title,
        twitter_description: newPageData.twitter_description,
        twitter_image: newPageData.twitter_image,
        keywords: newPageData.keywords || [],
        schema_org_data: newPageData.schema_org_data,
        canonical_url: newPageData.canonical_url,
        no_index: newPageData.no_index || false,
        no_follow: newPageData.no_follow || false
      });
      
      toast({ title: "Página SEO salva com sucesso!" });
      setIsPageDialogOpen(false);
      setNewPageData({
        page_path: '',
        title: '',
        meta_description: '',
        no_index: false,
        no_follow: false
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar página SEO",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive"
      });
    }
  };

  const handleTagSave = async () => {
    if (!newTagData.name || !newTagData.content) {
      toast({ title: "Preencha todos os campos obrigatórios", variant: "destructive" });
      return;
    }

    try {
      if (editingTag) {
        await updateCustomTag(editingTag.id, newTagData as Partial<CustomTag>);
        toast({ title: "Tag atualizada com sucesso!" });
      } else {
        await createCustomTag(newTagData as Omit<CustomTag, 'id'>);
        toast({ title: "Tag criada com sucesso!" });
      }
      
      setIsTagDialogOpen(false);
      setEditingTag(null);
      setNewTagData({
        name: '',
        tag_type: 'head',
        content: '',
        position: 'head',
        is_active: true
      });
    } catch (error) {
      toast({
        title: editingTag ? "Erro ao atualizar tag" : "Erro ao criar tag",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive"
      });
    }
  };

  const handleTagDelete = async (id: string) => {
    try {
      await deleteCustomTag(id);
      toast({ title: "Tag excluída com sucesso!" });
    } catch (error) {
      toast({
        title: "Erro ao excluir tag",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive"
      });
    }
  };

  const openEditPageDialog = (page: PageSEO) => {
    setEditingPage(page);
    setNewPageData(page);
    setIsPageDialogOpen(true);
  };

  const openEditTagDialog = (tag: CustomTag) => {
    setEditingTag(tag);
    setNewTagData(tag);
    setIsTagDialogOpen(true);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Configurações de SEO</h1>
        <p className="text-muted-foreground">
          Gerencie todas as configurações de SEO do site, meta tags, Schema.org e ferramentas de análise.
        </p>
      </div>

      <Tabs defaultValue="global" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="global" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Global
          </TabsTrigger>
          <TabsTrigger value="pages" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Páginas
          </TabsTrigger>
          <TabsTrigger value="tags" className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Tags Customizadas
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Global Settings */}
        <TabsContent value="global" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Globais</CardTitle>
              <CardDescription>
                Configurações que se aplicam a todo o site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="site_name">Nome do Site</Label>
                  <Input
                    id="site_name"
                    value={seoSettings?.site_name || ''}
                    onChange={(e) => handleGlobalSettingsUpdate('site_name', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="canonical_base_url">URL Base Canônica</Label>
                  <Input
                    id="canonical_base_url"
                    value={seoSettings?.canonical_base_url || ''}
                    onChange={(e) => handleGlobalSettingsUpdate('canonical_base_url', e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="title_template">Template do Título (use &#123;title&#125; como placeholder)</Label>
                <Input
                  id="title_template"
                  value={seoSettings?.title_template || ''}
                  onChange={(e) => handleGlobalSettingsUpdate('title_template', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="meta_description">Meta Descrição Padrão</Label>
                <Textarea
                  id="meta_description"
                  value={seoSettings?.meta_description || ''}
                  onChange={(e) => handleGlobalSettingsUpdate('meta_description', e.target.value)}
                  maxLength={160}
                />
                <p className="text-sm text-muted-foreground">
                  {(seoSettings?.meta_description || '').length}/160 caracteres
                </p>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="og_image">Imagem Open Graph Padrão (URL)</Label>
                  <Input
                    id="og_image"
                    value={seoSettings?.og_image || ''}
                    onChange={(e) => handleGlobalSettingsUpdate('og_image', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="twitter_handle">Handle do Twitter</Label>
                  <Input
                    id="twitter_handle"
                    value={seoSettings?.twitter_handle || ''}
                    onChange={(e) => handleGlobalSettingsUpdate('twitter_handle', e.target.value)}
                    placeholder="@guilds"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="robots_txt">Conteúdo do Robots.txt</Label>
                <Textarea
                  id="robots_txt"
                  value={seoSettings?.robots_txt_content || ''}
                  onChange={(e) => handleGlobalSettingsUpdate('robots_txt_content', e.target.value)}
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pages SEO */}
        <TabsContent value="pages" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">SEO por Página</h2>
              <p className="text-muted-foreground">Configure meta tags específicas para cada página</p>
            </div>
            <Dialog open={isPageDialogOpen} onOpenChange={setIsPageDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  setEditingPage(null);
                  setNewPageData({
                    page_path: '',
                    title: '',
                    meta_description: '',
                    no_index: false,
                    no_follow: false
                  });
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Página
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingPage ? 'Editar' : 'Nova'} Página SEO</DialogTitle>
                  <DialogDescription>
                    Configure as meta tags e dados estruturados para esta página
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="page_path">Caminho da Página</Label>
                    <Input
                      id="page_path"
                      value={newPageData.page_path || ''}
                      onChange={(e) => setNewPageData({...newPageData, page_path: e.target.value})}
                      placeholder="/sobre-nos"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="page_title">Título</Label>
                    <Input
                      id="page_title"
                      value={newPageData.title || ''}
                      onChange={(e) => setNewPageData({...newPageData, title: e.target.value})}
                      maxLength={60}
                    />
                    <p className="text-sm text-muted-foreground">
                      {(newPageData.title || '').length}/60 caracteres
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="page_meta_description">Meta Descrição</Label>
                    <Textarea
                      id="page_meta_description"
                      value={newPageData.meta_description || ''}
                      onChange={(e) => setNewPageData({...newPageData, meta_description: e.target.value})}
                      maxLength={160}
                    />
                    <p className="text-sm text-muted-foreground">
                      {(newPageData.meta_description || '').length}/160 caracteres
                    </p>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="no_index"
                        checked={newPageData.no_index || false}
                        onCheckedChange={(checked) => setNewPageData({...newPageData, no_index: checked})}
                      />
                      <Label htmlFor="no_index">No Index</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="no_follow"
                        checked={newPageData.no_follow || false}
                        onCheckedChange={(checked) => setNewPageData({...newPageData, no_follow: checked})}
                      />
                      <Label htmlFor="no_follow">No Follow</Label>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label htmlFor="og_title">Título Open Graph (opcional)</Label>
                    <Input
                      id="og_title"
                      value={newPageData.og_title || ''}
                      onChange={(e) => setNewPageData({...newPageData, og_title: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="og_description">Descrição Open Graph (opcional)</Label>
                    <Textarea
                      id="og_description"
                      value={newPageData.og_description || ''}
                      onChange={(e) => setNewPageData({...newPageData, og_description: e.target.value})}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsPageDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handlePageSave}>
                    {editingPage ? 'Atualizar' : 'Criar'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {pageSEO.map((page) => (
              <Card key={page.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{page.page_path}</h3>
                        {page.no_index && <Badge variant="secondary">No Index</Badge>}
                        {page.no_follow && <Badge variant="secondary">No Follow</Badge>}
                      </div>
                      <p className="font-medium text-sm mb-1">{page.title}</p>
                      <p className="text-sm text-muted-foreground">{page.meta_description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(page.page_path, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditPageDialog(page)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Custom Tags */}
        <TabsContent value="tags" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Tags Customizadas</h2>
              <p className="text-muted-foreground">Adicione scripts e tags personalizadas</p>
            </div>
            <Dialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  setEditingTag(null);
                  setNewTagData({
                    name: '',
                    tag_type: 'head',
                    content: '',
                    position: 'head',
                    is_active: true
                  });
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Tag
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingTag ? 'Editar' : 'Nova'} Tag Customizada</DialogTitle>
                  <DialogDescription>
                    Adicione scripts personalizados como Google Tag Manager, Facebook Pixel, etc.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="tag_name">Nome da Tag</Label>
                    <Input
                      id="tag_name"
                      value={newTagData.name || ''}
                      onChange={(e) => setNewTagData({...newTagData, name: e.target.value})}
                      placeholder="Google Tag Manager"
                    />
                  </div>

                  <div>
                    <Label htmlFor="tag_type">Tipo de Tag</Label>
                    <Select 
                      value={newTagData.tag_type} 
                      onValueChange={(value) => setNewTagData({...newTagData, tag_type: value as any})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="head">Head</SelectItem>
                        <SelectItem value="body_start">Body Start</SelectItem>
                        <SelectItem value="body_end">Body End</SelectItem>
                        <SelectItem value="script">Script</SelectItem>
                        <SelectItem value="meta">Meta Tag</SelectItem>
                        <SelectItem value="link">Link Tag</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="tag_content">Conteúdo HTML</Label>
                    <Textarea
                      id="tag_content"
                      value={newTagData.content || ''}
                      onChange={(e) => setNewTagData({...newTagData, content: e.target.value})}
                      rows={8}
                      placeholder="<script>...</script>"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="tag_active"
                      checked={newTagData.is_active || false}
                      onCheckedChange={(checked) => setNewTagData({...newTagData, is_active: checked})}
                    />
                    <Label htmlFor="tag_active">Tag Ativa</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsTagDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleTagSave}>
                    {editingTag ? 'Atualizar' : 'Criar'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {customTags.map((tag) => (
              <Card key={tag.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{tag.name}</h3>
                        <Badge variant="outline">{tag.tag_type}</Badge>
                        {tag.is_active ? (
                          <Badge variant="default">Ativo</Badge>
                        ) : (
                          <Badge variant="secondary">Inativo</Badge>
                        )}
                      </div>
                      <pre className="text-sm text-muted-foreground bg-muted p-2 rounded text-wrap overflow-hidden">
                        {tag.content.substring(0, 100)}...
                      </pre>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditTagDialog(tag)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir Tag</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir a tag "{tag.name}"? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleTagDelete(tag.id)}>
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ferramentas de Analytics</CardTitle>
              <CardDescription>
                Configure Google Analytics, Tag Manager e outras ferramentas de análise
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="google_analytics_id">Google Analytics 4 ID</Label>
                  <Input
                    id="google_analytics_id"
                    value={seoSettings?.google_analytics_id || ''}
                    onChange={(e) => handleGlobalSettingsUpdate('google_analytics_id', e.target.value)}
                    placeholder="G-XXXXXXXXXX"
                  />
                </div>
                <div>
                  <Label htmlFor="google_tag_manager_id">Google Tag Manager ID</Label>
                  <Input
                    id="google_tag_manager_id"
                    value={seoSettings?.google_tag_manager_id || ''}
                    onChange={(e) => handleGlobalSettingsUpdate('google_tag_manager_id', e.target.value)}
                    placeholder="GTM-XXXXXXX"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="facebook_pixel_id">Facebook Pixel ID</Label>
                  <Input
                    id="facebook_pixel_id"
                    value={seoSettings?.facebook_pixel_id || ''}
                    onChange={(e) => handleGlobalSettingsUpdate('facebook_pixel_id', e.target.value)}
                    placeholder="123456789"
                  />
                </div>
                <div>
                  <Label htmlFor="hotjar_id">Hotjar Site ID</Label>
                  <Input
                    id="hotjar_id"
                    value={seoSettings?.hotjar_id || ''}
                    onChange={(e) => handleGlobalSettingsUpdate('hotjar_id', e.target.value)}
                    placeholder="12345"
                  />
                </div>
              </div>

              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Status das Ferramentas</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span>Google Analytics:</span>
                    <Badge variant={seoSettings?.google_analytics_id ? "default" : "secondary"}>
                      {seoSettings?.google_analytics_id ? "Configurado" : "Não configurado"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Tag Manager:</span>
                    <Badge variant={seoSettings?.google_tag_manager_id ? "default" : "secondary"}>
                      {seoSettings?.google_tag_manager_id ? "Configurado" : "Não configurado"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Facebook Pixel:</span>
                    <Badge variant={seoSettings?.facebook_pixel_id ? "default" : "secondary"}>
                      {seoSettings?.facebook_pixel_id ? "Configurado" : "Não configurado"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Hotjar:</span>
                    <Badge variant={seoSettings?.hotjar_id ? "default" : "secondary"}>
                      {seoSettings?.hotjar_id ? "Configurado" : "Não configurado"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}