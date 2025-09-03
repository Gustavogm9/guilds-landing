import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Upload, X, Link, User } from 'lucide-react';
import { AvatarService } from '@/lib/avatarService';
import { useToast } from '@/hooks/use-toast';

interface AvatarUploaderProps {
  currentUrl?: string;
  memberName?: string;
  memberId?: string;
  onUrlChange: (url: string) => void;
  className?: string;
}

export const AvatarUploader: React.FC<AvatarUploaderProps> = ({
  currentUrl,
  memberName = '',
  memberId,
  onUrlChange,
  className = ''
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState(currentUrl || '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const initials = memberName
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase();

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      const avatarUrl = await AvatarService.uploadAvatar(file, memberId);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      onUrlChange(avatarUrl);
      toast({
        title: "Avatar enviado!",
        description: "O avatar foi carregado com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro no upload",
        description: error.message || "Não foi possível enviar o avatar.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleUrlSubmit = () => {
    onUrlChange(urlInput);
    setShowUrlInput(false);
    toast({
      title: "URL do avatar atualizada",
      description: "O link do avatar foi atualizado.",
    });
  };

  const clearAvatar = () => {
    onUrlChange('');
    setUrlInput('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Label>Avatar do Membro</Label>
      
      {/* Avatar Preview */}
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20 ring-2 ring-border">
          <AvatarImage src={currentUrl} alt={memberName} />
          <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-primary/20 to-accent/20">
            {initials || <User className="h-8 w-8" />}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-2">
          {currentUrl && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={clearAvatar}
              className="text-destructive"
            >
              <X className="h-3 w-3 mr-1" />
              Remover
            </Button>
          )}
        </div>
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <div className="space-y-2">
          <Progress value={uploadProgress} className="h-2" />
          <p className="text-sm text-muted-foreground">
            Enviando avatar... {uploadProgress}%
          </p>
        </div>
      )}

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-border hover:border-primary/50'
        } ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
        <p className="text-sm font-medium mb-1">
          Arraste uma imagem ou clique para selecionar
        </p>
        <p className="text-xs text-muted-foreground mb-4">
          PNG, JPG até 5MB • Será redimensionada para 400x400px
        </p>
        
        <div className="flex gap-2 justify-center">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <Upload className="h-3 w-3 mr-1" />
            Selecionar Arquivo
          </Button>
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowUrlInput(!showUrlInput)}
            disabled={isUploading}
          >
            <Link className="h-3 w-3 mr-1" />
            URL Manual
          </Button>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
      />

      {/* Manual URL Input */}
      {showUrlInput && (
        <div className="space-y-2 p-4 border rounded-lg bg-muted/50">
          <Label htmlFor="avatar-url" className="text-sm">
            URL da Imagem
          </Label>
          <div className="flex gap-2">
            <Input
              id="avatar-url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://exemplo.com/avatar.jpg"
              className="flex-1"
            />
            <Button
              type="button"
              size="sm"
              onClick={handleUrlSubmit}
              disabled={!urlInput.trim()}
            >
              Aplicar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};