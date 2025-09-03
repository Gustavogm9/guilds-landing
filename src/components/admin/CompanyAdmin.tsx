import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useCompanyManifesto, useTeamMembers, useJobPositions, useCompanyCulture } from '@/hooks/useCompanyData';
import { Building, Users, Briefcase, Heart, Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import { AvatarUploader } from '@/components/admin/AvatarUploader';

export const CompanyAdmin: React.FC = () => {
  const { manifesto, loading: manifestoLoading, updateManifesto } = useCompanyManifesto();
  const { members, loading: membersLoading, createMember, updateMember, deleteMember } = useTeamMembers();
  const { positions, loading: positionsLoading, createPosition, updatePosition, deletePosition } = useJobPositions();
  const { culture, loading: cultureLoading, updateCulture } = useCompanyCulture();

  const [editingManifesto, setEditingManifesto] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [editingPosition, setEditingPosition] = useState<any>(null);
  const [newMember, setNewMember] = useState<any>({});
  const [newPosition, setNewPosition] = useState<any>({});
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreatingMember, setIsCreatingMember] = useState(false);
  const [isUpdatingMember, setIsUpdatingMember] = useState(false);

  const handleSaveManifesto = async (formData: FormData) => {
    try {
      const updates = {
        manifesto_title: formData.get('manifesto_title') as string,
        manifesto_content: formData.get('manifesto_content') as string,
        history_title: formData.get('history_title') as string,
        history_content: formData.get('history_content') as string,
        dna_title: formData.get('dna_title') as string,
        dna_content: formData.get('dna_content') as string,
      };
      
      await updateManifesto(updates);
      setEditingManifesto(false);
      toast.success('Manifesto atualizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar manifesto');
    }
  };

  const handleCreateMember = async () => {
    if (!newMember.name || !newMember.position) {
      toast.error('Nome e cargo são obrigatórios');
      return;
    }

    setIsCreatingMember(true);
    try {
      await createMember({
        ...newMember,
        expertise: newMember.expertise?.split(',').map((s: string) => s.trim()).filter(Boolean) || [],
        social_links: {},
        display_order: members.length + 1,
        is_active: true
      });
      setNewMember({});
      setIsCreateDialogOpen(false);
      toast.success('Membro da equipe adicionado!');
    } catch (error) {
      toast.error('Erro ao adicionar membro');
    } finally {
      setIsCreatingMember(false);
    }
  };

  const handleEditMember = (member: any) => {
    setEditingMember({
      ...member,
      expertise: member.expertise.join(', ')
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateMember = async () => {
    if (!editingMember.name || !editingMember.position) {
      toast.error('Nome e cargo são obrigatórios');
      return;
    }

    setIsUpdatingMember(true);
    try {
      await updateMember(editingMember.id, {
        ...editingMember,
        expertise: editingMember.expertise?.split(',').map((s: string) => s.trim()).filter(Boolean) || [],
      });
      setEditingMember(null);
      setIsEditDialogOpen(false);
      toast.success('Membro atualizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar membro');
    } finally {
      setIsUpdatingMember(false);
    }
  };

  const handleDeleteMember = async (id: string) => {
    try {
      await deleteMember(id);
      toast.success('Membro removido com sucesso!');
    } catch (error) {
      toast.error('Erro ao remover membro');
    }
  };

  if (manifestoLoading || membersLoading || positionsLoading || cultureLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <Tabs defaultValue="manifesto" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="manifesto" className="flex items-center gap-2">
          <Building className="h-4 w-4" />
          Manifesto
        </TabsTrigger>
        <TabsTrigger value="team" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          Equipe
        </TabsTrigger>
        <TabsTrigger value="careers" className="flex items-center gap-2">
          <Briefcase className="h-4 w-4" />
          Carreiras
        </TabsTrigger>
        <TabsTrigger value="culture" className="flex items-center gap-2">
          <Heart className="h-4 w-4" />
          Cultura
        </TabsTrigger>
      </TabsList>

      <TabsContent value="manifesto" className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Manifesto da Empresa</CardTitle>
                <CardDescription>
                  Gerencie o manifesto, história e DNA da empresa
                </CardDescription>
              </div>
              <Button
                onClick={() => setEditingManifesto(!editingManifesto)}
                variant={editingManifesto ? "secondary" : "outline"}
              >
                {editingManifesto ? (
                  <>
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </>
                ) : (
                  <>
                    <Edit2 className="h-4 w-4 mr-2" />
                    Editar
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {editingManifesto ? (
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleSaveManifesto(formData);
              }} className="space-y-4">
                <div>
                  <Label htmlFor="manifesto_title">Título do Manifesto</Label>
                  <Input
                    id="manifesto_title"
                    name="manifesto_title"
                    defaultValue={manifesto?.manifesto_title}
                  />
                </div>
                <div>
                  <Label htmlFor="manifesto_content">Conteúdo do Manifesto</Label>
                  <Textarea
                    id="manifesto_content"
                    name="manifesto_content"
                    rows={4}
                    defaultValue={manifesto?.manifesto_content}
                  />
                </div>
                <div>
                  <Label htmlFor="history_title">Título da História</Label>
                  <Input
                    id="history_title"
                    name="history_title"
                    defaultValue={manifesto?.history_title}
                  />
                </div>
                <div>
                  <Label htmlFor="history_content">Conteúdo da História</Label>
                  <Textarea
                    id="history_content"
                    name="history_content"
                    rows={4}
                    defaultValue={manifesto?.history_content}
                  />
                </div>
                <div>
                  <Label htmlFor="dna_title">Título do DNA</Label>
                  <Input
                    id="dna_title"
                    name="dna_title"
                    defaultValue={manifesto?.dna_title}
                  />
                </div>
                <div>
                  <Label htmlFor="dna_content">Conteúdo do DNA</Label>
                  <Textarea
                    id="dna_content"
                    name="dna_content"
                    rows={4}
                    defaultValue={manifesto?.dna_content}
                  />
                </div>
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Alterações
                </Button>
              </form>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg">{manifesto?.manifesto_title}</h3>
                  <p className="text-muted-foreground">{manifesto?.manifesto_content}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{manifesto?.history_title}</h3>
                  <p className="text-muted-foreground">{manifesto?.history_content}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{manifesto?.dna_title}</h3>
                  <p className="text-muted-foreground">{manifesto?.dna_content}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="team" className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Membros da Equipe</CardTitle>
                <CardDescription>
                  Gerencie os membros da equipe exibidos na página
                </CardDescription>
              </div>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Membro
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Novo Membro</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nome *</Label>
                      <Input
                        id="name"
                        value={newMember.name || ''}
                        onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                        placeholder="Nome completo do membro"
                      />
                    </div>
                    <div>
                      <Label htmlFor="position">Cargo *</Label>
                      <Input
                        id="position"
                        value={newMember.position || ''}
                        onChange={(e) => setNewMember({...newMember, position: e.target.value})}
                        placeholder="Cargo ou função"
                      />
                    </div>
                    <AvatarUploader
                      currentUrl={newMember.avatar_url}
                      memberName={newMember.name}
                      onUrlChange={(url) => setNewMember({...newMember, avatar_url: url})}
                    />
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={newMember.bio || ''}
                        onChange={(e) => setNewMember({...newMember, bio: e.target.value})}
                        placeholder="Breve descrição sobre o membro"
                      />
                    </div>
                    <div>
                      <Label htmlFor="expertise">Especialidades (separadas por vírgula)</Label>
                      <Input
                        id="expertise"
                        value={newMember.expertise || ''}
                        onChange={(e) => setNewMember({...newMember, expertise: e.target.value})}
                        placeholder="React, Node.js, TypeScript"
                      />
                    </div>
                    
                    {/* Social Links */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <Input
                          id="linkedin"
                          value={newMember.social_links?.linkedin || ''}
                          onChange={(e) => setNewMember({
                            ...newMember, 
                            social_links: {...newMember.social_links, linkedin: e.target.value}
                          })}
                          placeholder="https://linkedin.com/in/usuario"
                        />
                      </div>
                      <div>
                        <Label htmlFor="instagram">Instagram</Label>
                        <Input
                          id="instagram"
                          value={newMember.social_links?.instagram || ''}
                          onChange={(e) => setNewMember({
                            ...newMember, 
                            social_links: {...newMember.social_links, instagram: e.target.value}
                          })}
                          placeholder="https://instagram.com/usuario"
                        />
                      </div>
                      <div>
                        <Label htmlFor="github">GitHub</Label>
                        <Input
                          id="github"
                          value={newMember.social_links?.github || ''}
                          onChange={(e) => setNewMember({
                            ...newMember, 
                            social_links: {...newMember.social_links, github: e.target.value}
                          })}
                          placeholder="https://github.com/usuario"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lattes">Lattes</Label>
                        <Input
                          id="lattes"
                          value={newMember.social_links?.lattes || ''}
                          onChange={(e) => setNewMember({
                            ...newMember, 
                            social_links: {...newMember.social_links, lattes: e.target.value}
                          })}
                          placeholder="http://lattes.cnpq.br/1234567890"
                        />
                      </div>
                    </div>
                    
                    {/* Curriculum Section */}
                    <div className="space-y-4 border-t pt-4">
                      <h4 className="font-semibold">Currículo Completo</h4>
                      <div>
                        <Label htmlFor="curriculum_slug">URL do Currículo (slug)</Label>
                        <Input
                          id="curriculum_slug"
                          value={newMember.curriculum_slug || ''}
                          onChange={(e) => setNewMember({...newMember, curriculum_slug: e.target.value})}
                          placeholder="nome-sobrenome"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          URL será: /team/{newMember.curriculum_slug || 'nome-sobrenome'}/curriculum
                        </p>
                      </div>
                      <div>
                        <Label htmlFor="curriculum_content">Conteúdo do Currículo</Label>
                        <Textarea
                          id="curriculum_content"
                          value={newMember.curriculum_content || ''}
                          onChange={(e) => setNewMember({...newMember, curriculum_content: e.target.value})}
                          placeholder="Experiência profissional, educação, projetos, certificações..."
                          rows={6}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="curriculum_is_public"
                          checked={newMember.curriculum_is_public || false}
                          onChange={(e) => setNewMember({...newMember, curriculum_is_public: e.target.checked})}
                          className="rounded"
                        />
                        <Label htmlFor="curriculum_is_public" className="text-sm">
                          Tornar currículo público
                        </Label>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={handleCreateMember} 
                        disabled={isCreatingMember}
                        className="flex-1"
                      >
                        {isCreatingMember ? 'Adicionando...' : 'Adicionar Membro'}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setNewMember({});
                          setIsCreateDialogOpen(false);
                        }}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {members.map((member) => (
                <div key={member.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <Avatar>
                    <AvatarImage src={member.avatar_url} />
                    <AvatarFallback>
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-semibold">{member.name}</h4>
                    <p className="text-sm text-muted-foreground">{member.position}</p>
                    <div className="flex gap-1 mt-1">
                      {member.expertise.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEditMember(member)}>
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="outline" className="text-destructive">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remover Membro</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja remover {member.name} da equipe?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteMember(member.id)}
                            className="bg-destructive text-destructive-foreground"
                          >
                            Remover
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Edit Member Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Membro</DialogTitle>
            </DialogHeader>
            {editingMember && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">Nome *</Label>
                  <Input
                    id="edit-name"
                    value={editingMember.name || ''}
                    onChange={(e) => setEditingMember({...editingMember, name: e.target.value})}
                    placeholder="Nome completo do membro"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-position">Cargo *</Label>
                  <Input
                    id="edit-position"
                    value={editingMember.position || ''}
                    onChange={(e) => setEditingMember({...editingMember, position: e.target.value})}
                    placeholder="Cargo ou função"
                  />
                </div>
                <AvatarUploader
                  currentUrl={editingMember.avatar_url}
                  memberName={editingMember.name}
                  memberId={editingMember.id}
                  onUrlChange={(url) => setEditingMember({...editingMember, avatar_url: url})}
                />
                <div>
                  <Label htmlFor="edit-bio">Bio</Label>
                  <Textarea
                    id="edit-bio"
                    value={editingMember.bio || ''}
                    onChange={(e) => setEditingMember({...editingMember, bio: e.target.value})}
                    placeholder="Breve descrição sobre o membro"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-expertise">Especialidades (separadas por vírgula)</Label>
                  <Input
                    id="edit-expertise"
                    value={editingMember.expertise || ''}
                    onChange={(e) => setEditingMember({...editingMember, expertise: e.target.value})}
                    placeholder="React, Node.js, TypeScript"
                  />
                </div>
                
                {/* Social Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-linkedin">LinkedIn</Label>
                    <Input
                      id="edit-linkedin"
                      value={editingMember.social_links?.linkedin || ''}
                      onChange={(e) => setEditingMember({
                        ...editingMember, 
                        social_links: {...editingMember.social_links, linkedin: e.target.value}
                      })}
                      placeholder="https://linkedin.com/in/usuario"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-instagram">Instagram</Label>
                    <Input
                      id="edit-instagram"
                      value={editingMember.social_links?.instagram || ''}
                      onChange={(e) => setEditingMember({
                        ...editingMember, 
                        social_links: {...editingMember.social_links, instagram: e.target.value}
                      })}
                      placeholder="https://instagram.com/usuario"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-github">GitHub</Label>
                    <Input
                      id="edit-github"
                      value={editingMember.social_links?.github || ''}
                      onChange={(e) => setEditingMember({
                        ...editingMember, 
                        social_links: {...editingMember.social_links, github: e.target.value}
                      })}
                      placeholder="https://github.com/usuario"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-lattes">Lattes</Label>
                    <Input
                      id="edit-lattes"
                      value={editingMember.social_links?.lattes || ''}
                      onChange={(e) => setEditingMember({
                        ...editingMember, 
                        social_links: {...editingMember.social_links, lattes: e.target.value}
                      })}
                      placeholder="http://lattes.cnpq.br/1234567890"
                    />
                  </div>
                </div>
                
                {/* Curriculum Section */}
                <div className="space-y-4 border-t pt-4">
                  <h4 className="font-semibold">Currículo Completo</h4>
                  <div>
                    <Label htmlFor="edit-curriculum_slug">URL do Currículo (slug)</Label>
                    <Input
                      id="edit-curriculum_slug"
                      value={editingMember.curriculum_slug || ''}
                      onChange={(e) => setEditingMember({...editingMember, curriculum_slug: e.target.value})}
                      placeholder="nome-sobrenome"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      URL será: /team/{editingMember.curriculum_slug || 'nome-sobrenome'}/curriculum
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="edit-curriculum_content">Conteúdo do Currículo</Label>
                    <Textarea
                      id="edit-curriculum_content"
                      value={editingMember.curriculum_content || ''}
                      onChange={(e) => setEditingMember({...editingMember, curriculum_content: e.target.value})}
                      placeholder="Experiência profissional, educação, projetos, certificações..."
                      rows={6}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="edit-curriculum_is_public"
                      checked={editingMember.curriculum_is_public || false}
                      onChange={(e) => setEditingMember({...editingMember, curriculum_is_public: e.target.checked})}
                      className="rounded"
                    />
                    <Label htmlFor="edit-curriculum_is_public" className="text-sm">
                      Tornar currículo público
                    </Label>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleUpdateMember} 
                    disabled={isUpdatingMember}
                    className="flex-1"
                  >
                    {isUpdatingMember ? 'Salvando...' : 'Salvar Alterações'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setEditingMember(null);
                      setIsEditDialogOpen(false);
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </TabsContent>

      <TabsContent value="careers" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Vagas e Carreiras</CardTitle>
            <CardDescription>
              Gerencie as vagas abertas e informações de carreira
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Funcionalidade de vagas em desenvolvimento. Por enquanto, use o email carreiras@guilds.com.br
            </p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="culture" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Cultura da Empresa</CardTitle>
            <CardDescription>
              Gerencie benefícios, cultura e processo seletivo
            </CardDescription>
          </CardHeader>
          <CardContent>
            {culture && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg">Descrição da Cultura</h3>
                  <p className="text-muted-foreground">{culture.culture_description}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Benefícios ({culture.benefits.length})</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    {culture.benefits.map((benefit, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <h4 className="font-medium">{benefit.title}</h4>
                        <p className="text-sm text-muted-foreground">{benefit.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Processo Seletivo ({culture.selection_process.length} etapas)</h3>
                  <div className="space-y-2 mt-2">
                    {culture.selection_process.map((step, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                          {step.step}
                        </div>
                        <div>
                          <h4 className="font-medium">{step.title}</h4>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};