import { supabase } from '@/integrations/supabase/client';

export class AvatarService {
  static async resizeImage(file: File, maxSize: number = 400): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions maintaining aspect ratio
        let { width, height } = img;
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(resizedFile);
          }
        }, 'image/jpeg', 0.8);
      };
      
      img.src = URL.createObjectURL(file);
    });
  }

  static async uploadAvatar(file: File, memberId?: string): Promise<string> {
    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Apenas arquivos de imagem são permitidos');
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Arquivo muito grande. Tamanho máximo: 5MB');
      }

      // Resize image
      const resizedFile = await this.resizeImage(file);
      
      // Generate unique filename
      const fileExt = 'jpg'; // Always use jpg after compression
      const fileName = `avatars/${memberId || Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('assets')
        .upload(fileName, resizedFile, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('assets')
        .getPublicUrl(fileName);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    }
  }

  static async deleteAvatar(avatarUrl: string): Promise<void> {
    try {
      // Extract file path from URL
      const url = new URL(avatarUrl);
      const pathParts = url.pathname.split('/');
      const fileName = pathParts[pathParts.length - 1];
      const filePath = `avatars/${fileName}`;

      // Delete from storage
      const { error } = await supabase.storage
        .from('assets')
        .remove([filePath]);

      if (error) {
        console.warn('Storage delete error:', error);
        // Don't throw - avatar might have been manually deleted
      }
    } catch (error) {
      console.error('Error deleting avatar:', error);
      // Don't throw - this is a cleanup operation
    }
  }
}