import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { toast } from 'sonner';
import { useSaveLogo } from '@/hooks/useLogos';
import { useUpdateLogo } from '@/hooks/useUpdateLogo';
import { Color, extractColorsFromSVG } from '@/utils/svg-color-extractor';
import { processSVGWidth } from '@/utils/svg-processor';
import { supabase } from '@/integrations/supabase/client';

interface Font {
  id: string;
  name: string;
  url: string;
}

interface ExternalLink {
  id: string;
  name: string;
  url: string;
}

// Generate a secure random token using Web Crypto API
const generateShareToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};

interface UploadContextType {
  // State
  logoFile: File | null;
  logoPreviewUrl: string | null;
  previewType: 'svg' | null;
  colors: Color[];
  fonts: Font[];
  notes: string;
  logoName: string;
  clientName: string;
  externalLinks: ExternalLink[];
  isProcessing: boolean;
  conversionError: string | null;
  isEditMode: boolean;
  logoId: string | null;
  isPublic: boolean;
  
  // Setters
  setLogoFile: (file: File | null) => void;
  setLogoPreviewUrl: (url: string | null) => void;
  setPreviewType: (type: 'svg' | null) => void;
  setColors: (colors: Color[]) => void;
  setFonts: (fonts: Font[]) => void;
  setNotes: (notes: string) => void;
  setLogoName: (name: string) => void;
  setClientName: (name: string) => void;
  setExternalLinks: (links: ExternalLink[]) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  setConversionError: (error: string | null) => void;
  setIsPublic: (isPublic: boolean) => void;
  
  // Actions
  handleLogoUpload: (file: File) => Promise<void>;
  handleSave: (onSuccess?: () => void) => void;
  setLogoData: (data: any) => void;
}

const UploadContext = createContext<UploadContextType | undefined>(undefined);

export const UploadProvider: React.FC<{ 
  children: ReactNode;
  logoId?: string;
}> = ({ children, logoId }) => {
  const isEditMode = !!logoId;
  
  // State
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<'svg' | null>(null);
  const [colors, setColors] = useState<Color[]>([]);
  const [fonts, setFonts] = useState<Font[]>([]);
  const [notes, setNotes] = useState("");
  const [logoName, setLogoName] = useState("");
  const [clientName, setClientName] = useState("");
  const [externalLinks, setExternalLinks] = useState<ExternalLink[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversionError, setConversionError] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState(true);
  
  // Hooks
  const saveLogo = useSaveLogo();
  const updateLogo = useUpdateLogo();

  // Set logo data from existing logo
  const setLogoData = useCallback((data: any) => {
    if (!data) return;
    
    setColors(data.colors || []);
    setFonts(data.fonts || []);
    setNotes(data.notes || '');
    setLogoName(data.title || '');
    setClientName(data.client_name || '');
    setExternalLinks(data.external_links || []);
    setIsPublic(data.is_public || false);
    
    // Set preview for existing logo
    if (data.file_path) {
      try {
        const { data: fileData } = supabase.storage
          .from('logos')
          .getPublicUrl(data.file_path);
        console.log('Setting preview URL:', fileData.publicUrl);
        setLogoPreviewUrl(fileData.publicUrl);
        setPreviewType('svg');
      } catch (error) {
        console.error('Error loading logo preview:', error);
        toast.error('Failed to load logo preview');
      }
    }
  }, []);

  // Handle logo upload
  const handleLogoUpload = async (file: File) => {
    setIsProcessing(true);
    setConversionError(null);
    
    try {
      console.log(`Processing uploaded file: ${file.name}, type: ${file.type}, size: ${file.size} bytes`);
      
      // Clean up previous URLs
      if (logoPreviewUrl && logoFile) {
        URL.revokeObjectURL(logoPreviewUrl);
        setLogoPreviewUrl(null);
      }
      
      // Process SVG to set 2000px width
      console.log('Processing SVG file and setting width to 2000px');
      const processedFile = await processSVGWidth(file, 2000);
      setLogoFile(processedFile);
      
      // Create a preview URL for the processed SVG file
      const objectUrl = URL.createObjectURL(processedFile);
      setLogoPreviewUrl(objectUrl);
      setPreviewType('svg');
      
      // Extract real colors from processed SVG
      const extractedColors = await extractColorsFromSVG(processedFile);
      setColors(extractedColors);
      
      // Set default logo name from filename if not already set
      if (!logoName && !isEditMode) {
        const nameFromFile = file.name.replace(/\.[^/.]+$/, "");
        setLogoName(nameFromFile);
      }
      
      // Don't add default font anymore
      setFonts([]);
        
    } catch (error) {
      console.error('Error processing logo file:', error);
      setConversionError(error instanceof Error ? error.message : 'Unknown error');
      toast.error('Error processing the file. Please try a different one.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Handle save/update - now accepts a callback for navigation
  const handleSave = (onSuccess?: () => void) => {
    if (!logoName.trim()) {
      toast.error('Please enter a logo name');
      return;
    }

    if (isEditMode) {
      // Update existing logo
      if (!logoId) {
        toast.error('Logo ID not found');
        return;
      }
      
      updateLogo.mutate({
        logoId,
        title: logoName,
        colors,
        fonts,
        notes,
        clientName,
        externalLinks,
        file: logoFile || undefined,
        isPublic,
        shareToken: isPublic ? generateShareToken() : null
      }, {
        onSuccess: () => {
          toast.success('Logo updated successfully!');
          onSuccess?.();
        },
        onError: (error) => {
          console.error('Update error:', error);
          toast.error('Failed to update logo. Please try again.');
        }
      });
    } else {
      // Create new logo
      if (!logoFile) {
        toast.error('Please upload a logo first');
        return;
      }
      
      saveLogo.mutate({
        file: logoFile,
        title: logoName,
        colors,
        fonts,
        notes,
        clientName,
        externalLinks,
        isPublic,
        shareToken: isPublic ? generateShareToken() : null
      }, {
        onSuccess: () => {
          onSuccess?.();
        }
      });
    }
  };

  const value = {
    logoFile,
    logoPreviewUrl,
    previewType,
    colors,
    fonts,
    notes,
    logoName,
    clientName,
    externalLinks,
    isProcessing,
    conversionError,
    isEditMode,
    logoId: logoId || null,
    isPublic,
    
    setLogoFile,
    setLogoPreviewUrl,
    setPreviewType,
    setColors,
    setFonts,
    setNotes,
    setLogoName,
    setClientName,
    setExternalLinks,
    setIsProcessing,
    setConversionError,
    setIsPublic,
    
    handleLogoUpload,
    handleSave,
    setLogoData
  };

  return (
    <UploadContext.Provider value={value}>
      {children}
    </UploadContext.Provider>
  );
};

export const useUpload = () => {
  const context = useContext(UploadContext);
  if (context === undefined) {
    throw new Error('useUpload must be used within a UploadProvider');
  }
  return context;
};

export default UploadProvider;
