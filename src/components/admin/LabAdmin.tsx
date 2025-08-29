import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { Plus, Edit2, Trash2, Users, BookOpen, Award, Clock, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { Workshop, WorkshopCategory, WorkshopInstructor } from '@/hooks/useWorkshops';

interface WorkshopFormData {
  title: string;
  slug: string;
  description: string;
  short_description: string;
  duration_hours: number;
  difficulty_level: string;
  target_audience: string[];
  prerequisites: string[];
  learning_objectives: string[];
  practical_project: string;
  certificate_included: boolean;
  modalities: string[];
  price_type: string;
  price_amount: number | null;
  is_featured: boolean;
  category_id: string;
  meta_description: string;
  keywords: string[];
}

interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
  icon_name: string;
  color: string;
  display_order: number;
}

interface InstructorFormData {
  name: string;
  slug: string;
  bio: string;
  specialties: string[];
  linkedin_url: string;
  github_url: string;
  portfolio_url: string;
  years_experience: number;
}

export function LabAdmin() {
  const queryClient = useQueryClient();
  const [activeDialog, setActiveDialog] = useState<'workshop' | 'category' | 'instructor' | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Fetch data
  const { data: workshops = [], isLoading: workshopsLoading } = useQuery({
    queryKey: ['admin-workshops'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workshops')
        .select(`
          *,
          category:workshop_categories(id, name, slug, icon_name, color)
        `)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as any[];
    }
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workshop_categories')
        .select('*')
        .order('display_order');
      if (error) throw error;
      return data as WorkshopCategory[];
    }
  });

  const { data: instructors = [], isLoading: instructorsLoading } = useQuery({
    queryKey: ['admin-instructors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workshop_instructors')
        .select('*')
        .order('name');
      if (error) throw error;
      return data as WorkshopInstructor[];
    }
  });

  // Mutations
  const createWorkshop = useMutation({
    mutationFn: async (data: WorkshopFormData) => {
      const { error } = await supabase.from('workshops').insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-workshops'] });
      toast.success('Workshop criado com sucesso!');
      setActiveDialog(null);
    },
    onError: () => toast.error('Erro ao criar workshop')
  });

  const updateWorkshop = useMutation({
    mutationFn: async (data: { id: string; updates: Partial<WorkshopFormData> }) => {
      const { error } = await supabase
        .from('workshops')
        .update(data.updates)
        .eq('id', data.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-workshops'] });
      toast.success('Workshop atualizado com sucesso!');
      setActiveDialog(null);
      setEditingItem(null);
    },
    onError: () => toast.error('Erro ao atualizar workshop')
  });

  const deleteWorkshop = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('workshops').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-workshops'] });
      toast.success('Workshop excluído com sucesso!');
    },
    onError: () => toast.error('Erro ao excluir workshop')
  });

  const createCategory = useMutation({
    mutationFn: async (data: CategoryFormData) => {
      const { error } = await supabase.from('workshop_categories').insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast.success('Categoria criada com sucesso!');
      setActiveDialog(null);
    },
    onError: () => toast.error('Erro ao criar categoria')
  });

  const updateCategory = useMutation({
    mutationFn: async (data: { id: string; updates: Partial<CategoryFormData> }) => {
      const { error } = await supabase
        .from('workshop_categories')
        .update(data.updates)
        .eq('id', data.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast.success('Categoria atualizada com sucesso!');
      setActiveDialog(null);
      setEditingItem(null);
    },
    onError: () => toast.error('Erro ao atualizar categoria')
  });

  const deleteCategory = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('workshop_categories').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast.success('Categoria excluída com sucesso!');
    },
    onError: () => toast.error('Erro ao excluir categoria')
  });

  const createInstructor = useMutation({
    mutationFn: async (data: InstructorFormData) => {
      const { error } = await supabase.from('workshop_instructors').insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-instructors'] });
      toast.success('Instrutor criado com sucesso!');
      setActiveDialog(null);
    },
    onError: () => toast.error('Erro ao criar instrutor')
  });

  const updateInstructor = useMutation({
    mutationFn: async (data: { id: string; updates: Partial<InstructorFormData> }) => {
      const { error } = await supabase
        .from('workshop_instructors')
        .update(data.updates)
        .eq('id', data.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-instructors'] });
      toast.success('Instrutor atualizado com sucesso!');
      setActiveDialog(null);
      setEditingItem(null);
    },
    onError: () => toast.error('Erro ao atualizar instrutor')
  });

  const deleteInstructor = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('workshop_instructors').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-instructors'] });
      toast.success('Instrutor excluído com sucesso!');
    },
    onError: () => toast.error('Erro ao excluir instrutor')
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Guilds Lab</h2>
          <p className="text-muted-foreground">
            Gerencie workshops, categorias e instrutores
          </p>
        </div>
      </div>

      <Tabs defaultValue="workshops" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="workshops" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Workshops
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Categorias
          </TabsTrigger>
          <TabsTrigger value="instructors" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Instrutores
          </TabsTrigger>
        </TabsList>

        <TabsContent value="workshops" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Workshops</h3>
            <Dialog open={activeDialog === 'workshop'} onOpenChange={(open) => setActiveDialog(open ? 'workshop' : null)}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingItem(null)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Workshop
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingItem ? 'Editar Workshop' : 'Novo Workshop'}
                  </DialogTitle>
                  <DialogDescription>
                    Preencha as informações do workshop
                  </DialogDescription>
                </DialogHeader>
                <WorkshopForm 
                  workshop={editingItem}
                  categories={categories}
                  onSubmit={(data) => {
                    if (editingItem) {
                      updateWorkshop.mutate({ id: editingItem.id, updates: data });
                    } else {
                      createWorkshop.mutate(data);
                    }
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {workshopsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary" />
              </div>
            ) : (
              workshops.map((workshop) => (
                <Card key={workshop.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold">{workshop.title}</h4>
                          {workshop.is_featured && (
                            <Badge variant="secondary">Destaque</Badge>
                          )}
                          <Badge 
                            variant="outline"
                            style={{ 
                              backgroundColor: workshop.category?.color + '20',
                              borderColor: workshop.category?.color,
                              color: workshop.category?.color
                            }}
                          >
                            {workshop.category?.name}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {workshop.short_description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {workshop.duration_hours}h
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            {workshop.price_type === 'custom' ? 'Sob consulta' : 
                             workshop.price_amount ? `R$ ${workshop.price_amount}` : 'Gratuito'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingItem(workshop);
                            setActiveDialog('workshop');
                          }}
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir Workshop</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir "{workshop.title}"? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteWorkshop.mutate(workshop.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Categorias</h3>
            <Dialog open={activeDialog === 'category'} onOpenChange={(open) => setActiveDialog(open ? 'category' : null)}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingItem(null)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Categoria
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingItem ? 'Editar Categoria' : 'Nova Categoria'}
                  </DialogTitle>
                </DialogHeader>
                <CategoryForm 
                  category={editingItem}
                  onSubmit={(data) => {
                    if (editingItem) {
                      updateCategory.mutate({ id: editingItem.id, updates: data });
                    } else {
                      createCategory.mutate(data);
                    }
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {categoriesLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary" />
              </div>
            ) : (
              categories.map((category) => (
                <Card key={category.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <div>
                          <h4 className="font-medium">{category.name}</h4>
                          <p className="text-sm text-muted-foreground">{category.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingItem(category);
                            setActiveDialog('category');
                          }}
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir Categoria</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir "{category.name}"? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteCategory.mutate(category.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="instructors" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Instrutores</h3>
            <Dialog open={activeDialog === 'instructor'} onOpenChange={(open) => setActiveDialog(open ? 'instructor' : null)}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingItem(null)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Instrutor
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingItem ? 'Editar Instrutor' : 'Novo Instrutor'}
                  </DialogTitle>
                </DialogHeader>
                <InstructorForm 
                  instructor={editingItem}
                  onSubmit={(data) => {
                    if (editingItem) {
                      updateInstructor.mutate({ id: editingItem.id, updates: data });
                    } else {
                      createInstructor.mutate(data);
                    }
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {instructorsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary" />
              </div>
            ) : (
              instructors.map((instructor) => (
                <Card key={instructor.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{instructor.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {instructor.years_experience} anos de experiência
                        </p>
                        {instructor.specialties && (
                          <div className="flex gap-1 mt-2">
                            {instructor.specialties.slice(0, 3).map((specialty) => (
                              <Badge key={specialty} variant="outline" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingItem(instructor);
                            setActiveDialog('instructor');
                          }}
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir Instrutor</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir "{instructor.name}"? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteInstructor.mutate(instructor.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Form components would be implemented here...
function WorkshopForm({ workshop, categories, onSubmit }: any) {
  // Implementation for workshop form
  return <div>Workshop Form (implementation needed)</div>;
}

function CategoryForm({ category, onSubmit }: any) {
  // Implementation for category form  
  return <div>Category Form (implementation needed)</div>;
}

function InstructorForm({ instructor, onSubmit }: any) {
  // Implementation for instructor form
  return <div>Instructor Form (implementation needed)</div>;
}