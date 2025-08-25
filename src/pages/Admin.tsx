import React from 'react';
import { LogoUploader } from '@/components/admin/LogoUploader';
import { useLogos } from '@/hooks/useLogos';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Image as ImageIcon, Upload, Database } from 'lucide-react';

export default function Admin() {
  const { logos, loading, error } = useLogos();

  return (
    <div className="container max-w-6xl py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin - Logo Management</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie os logos da marca Guilds armazenados no banco de dados
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div>
            <LogoUploader />
          </div>

          {/* Current Logos */}
          <div className="space-y-4">
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
          </div>
        </div>
      </div>
    </div>
  );
}