import React from 'react';
import { LogoUploader } from '@/components/admin/LogoUploader';
import { EditLogoDialog } from '@/components/admin/EditLogoDialog';
import { SEOAdmin } from '@/components/seo/SEOAdmin';
import { QualificationAdmin } from '@/components/admin/QualificationAdmin';
import { ContactAdmin } from '@/components/admin/ContactAdmin';
import { AnalyticsAdmin } from '@/components/admin/AnalyticsAdmin';
import { CraftAdmin } from '@/components/admin/CraftAdmin';
import { LabAdmin } from '@/components/admin/LabAdmin';
import { CompanyAdmin } from '@/components/admin/CompanyAdmin';
import { AdminHeader } from '@/components/auth/AdminHeader';
import { useLogos } from '@/hooks/useLogos';
import { LogoService } from '@/lib/logoService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
import { Image as ImageIcon, Upload, Database, Edit2, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';

export default function Admin() {
  const { logos, loading, error, refetch } = useLogos();
  const [editingLogo, setEditingLogo] = React.useState<any>(null);
  const [deletingLogoId, setDeletingLogoId] = React.useState<string | null>(null);

  const handleDeleteLogo = async (logo: any) => {
    try {
      setDeletingLogoId(logo.id);
      await LogoService.deleteLogo(logo.id, logo.file_path);
      toast.success('Logo deleted successfully!');
      refetch();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete logo');
    } finally {
      setDeletingLogoId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <div className="container max-w-6xl py-8">
        <div className="space-y-8">
          <div>
            {/* Header content now handled by AdminHeader */}
          </div>

        <Tabs defaultValue="logos" className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="logos" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Logos
            </TabsTrigger>
            <TabsTrigger value="seo" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              SEO
            </TabsTrigger>
            <TabsTrigger value="forms" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Formulários
            </TabsTrigger>
            <TabsTrigger value="newsletter" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Newsletter
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Contatos
            </TabsTrigger>
            <TabsTrigger value="company" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Empresa
            </TabsTrigger>
            <TabsTrigger value="lab" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Lab
            </TabsTrigger>
            <TabsTrigger value="craft" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Craft
            </TabsTrigger>
          </TabsList>

          <TabsContent value="logos" className="space-y-8">
            {/* Logo Management Content */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload New Logo
                </CardTitle>
                <CardDescription>
                  Upload a new logo to the Guilds brand system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LogoUploader />
              </CardContent>
            </Card>

            {/* Current Logos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Current Logos
                </CardTitle>
                <CardDescription>
                  Logos currently stored in the database
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading && (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary" />
                  </div>
                )}

                {error && (
                  <div className="text-red-500 p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
                    Error: {error}
                  </div>
                )}

                {!loading && !error && (
                  <div className="space-y-4">
                    {logos.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>No logos found</p>
                        <p className="text-sm">Upload your first logo to get started</p>
                      </div>
                    ) : (
                      logos.map((logo) => (
                        <div key={logo.id} className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-medium">{logo.name}</h3>
                              <div className="flex gap-2 mt-1">
                                <Badge variant="secondary">{logo.type}</Badge>
                                <Badge variant="outline">{logo.variant}</Badge>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              {logo.public_url && (
                                <div className={`w-16 h-16 border rounded flex items-center justify-center ${
                                  logo.variant === 'light' || logo.variant === 'transparent' 
                                    ? 'bg-slate-800' 
                                    : 'bg-slate-100 dark:bg-slate-800'
                                }`}>
                                  <img
                                    src={logo.public_url}
                                    alt={logo.name}
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                              )}
                              
                              <div className="flex flex-col gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingLogo(logo)}
                                >
                                  <Edit2 className="w-3 h-3" />
                                </Button>
                                
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="text-destructive hover:text-destructive"
                                      disabled={deletingLogoId === logo.id}
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Logo</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete "{logo.name}"? This action cannot be undone and will remove the logo from storage and database.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteLogo(logo)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
        </div>
      </div>
    </div>
                          
                          {logo.usage_context && (
                            <>
                              <Separator />
                              <p className="text-sm text-muted-foreground">
                                <strong>Context:</strong> {logo.usage_context}
                              </p>
                            </>
                          )}
                          
                          {(logo.width || logo.height) && (
                            <p className="text-xs text-muted-foreground">
                              Dimensions: {logo.width}x{logo.height}px
                            </p>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo" className="space-y-8">
            <SEOAdmin />
          </TabsContent>

          <TabsContent value="forms" className="space-y-8">
            <QualificationAdmin />
          </TabsContent>
          
          <TabsContent value="newsletter" className="space-y-8">
            <NewsletterAdmin />
          </TabsContent>
          
          <TabsContent value="contacts" className="space-y-8">
            <ContactAdmin />
          </TabsContent>
          
          <TabsContent value="company" className="space-y-8">
            <CompanyAdmin />
          </TabsContent>
          
          <TabsContent value="lab" className="space-y-8">
            <LabAdmin />
          </TabsContent>
          
          <TabsContent value="craft" className="space-y-8">
            <CraftAdmin />
          </TabsContent>
        </Tabs>
        </div>
      </div>
      
      <EditLogoDialog 
        logo={editingLogo}
        open={!!editingLogo}
        onClose={() => setEditingLogo(null)}
        onSave={() => refetch()}
      />
    </div>
  );
}