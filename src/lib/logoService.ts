import { supabase } from '@/integrations/supabase/client';

interface LogoData {
  name: string;
  type: 'symbol' | 'full' | 'text';
  variant: 'light' | 'dark' | 'color' | 'transparent';
  file_path: string;
  width?: number;
  height?: number;
  usage_context?: string;
}

export class LogoService {
  static async uploadLogo(file: File, logoData: Omit<LogoData, 'file_path'>) {
    try {
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `logos/${logoData.name}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('assets')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('assets')
        .getPublicUrl(fileName);

      // Insert logo metadata into database
      const { data: logoRecord, error: dbError } = await supabase
        .from('logos')
        .insert({
          ...logoData,
          file_path: fileName,
          public_url: urlData.publicUrl,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      return logoRecord;
    } catch (error) {
      console.error('Error uploading logo:', error);
      throw error;
    }
  }

  static async seedDefaultLogos() {
    try {
      // Check if logos already exist
      const { data: existingLogos } = await supabase
        .from('logos')
        .select('name');

      if (existingLogos && existingLogos.length > 0) {
        console.log('Logos already exist, skipping seed');
        return;
      }

      // Default logos to seed (using existing SVG files as fallback)
      const defaultLogos = [
        {
          name: 'guilds-shield',
          type: 'symbol' as const,
          variant: 'color' as const,
          file_path: 'logos/guilds-shield.svg',
          public_url: '/src/assets/guilds-logo-shield.svg',
          width: 64,
          height: 64,
          usage_context: 'Icon, favicon, small spaces'
        },
        {
          name: 'guilds-full',
          type: 'full' as const,
          variant: 'color' as const,
          file_path: 'logos/guilds-full.svg',
          public_url: '/src/assets/guilds-logo-full.svg',
          width: 200,
          height: 64,
          usage_context: 'Headers, main logo, branding'
        }
      ];

      const { error } = await supabase
        .from('logos')
        .insert(defaultLogos);

      if (error) throw error;

      console.log('Default logos seeded successfully');
    } catch (error) {
      console.error('Error seeding default logos:', error);
    }
  }
}