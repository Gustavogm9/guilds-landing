import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogoService } from '@/lib/logoService';
import { useLogos } from '@/hooks/useLogos';
import { Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function LogoUploader() {
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'full' as const,
    variant: 'color' as const,
    usage_context: '',
    width: '',
    height: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const { refetch } = useLogos();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // Auto-generate name from filename
      const nameWithoutExt = file.name.split('.')[0];
      setFormData(prev => ({
        ...prev,
        name: nameWithoutExt
      }));

      // Try to get image dimensions
      const img = new Image();
      img.onload = () => {
        setFormData(prev => ({
          ...prev,
          width: img.width.toString(),
          height: img.height.toString()
        }));
      };
      img.src = URL.createObjectURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    try {
      await LogoService.uploadLogo(selectedFile, {
        ...formData,
        width: formData.width ? parseInt(formData.width) : undefined,
        height: formData.height ? parseInt(formData.height) : undefined,
      });

      toast.success('Logo uploaded successfully!');
      
      // Reset form
      setFormData({
        name: '',
        type: 'full',
        variant: 'color',
        usage_context: '',
        width: '',
        height: ''
      });
      setSelectedFile(null);
      
      // Refresh logos
      refetch();
      
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload logo');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Upload Logo</CardTitle>
        <CardDescription>
          Add a new logo to the Guilds brand system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="file">Image File</Label>
            <Input
              id="file"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              required
            />
          </div>

          <div>
            <Label htmlFor="name">Logo Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., guilds-shield"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Type</Label>
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
              <Label htmlFor="variant">Variant</Label>
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
              <Label htmlFor="width">Width (px)</Label>
              <Input
                id="width"
                type="number"
                value={formData.width}
                onChange={(e) => setFormData(prev => ({ ...prev, width: e.target.value }))}
                placeholder="Auto-detected"
              />
            </div>

            <div>
              <Label htmlFor="height">Height (px)</Label>
              <Input
                id="height"
                type="number"
                value={formData.height}
                onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                placeholder="Auto-detected"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="context">Usage Context</Label>
            <Input
              id="context"
              value={formData.usage_context}
              onChange={(e) => setFormData(prev => ({ ...prev, usage_context: e.target.value }))}
              placeholder="e.g., Headers, icons, business cards"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={!selectedFile || uploading}
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload Logo
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}