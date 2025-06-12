
import React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Logo } from '@/hooks/useLogos';

interface ShareLogoDisplayProps {
  logo: Logo;
}

export const ShareLogoDisplay: React.FC<ShareLogoDisplayProps> = ({ logo }) => {
  const getLogoUrl = () => {
    const { data } = supabase.storage.from('logos').getPublicUrl(logo.file_path);
    return data.publicUrl;
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-lg mb-4">
      <img 
        src={getLogoUrl()} 
        alt={logo.title}
        className="max-w-full max-h-full object-contain"
        style={{ maxHeight: '200px' }}
      />
    </div>
  );
};
