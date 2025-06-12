import React, { useState, useMemo } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useLogoByShareToken } from '@/hooks/useLogoByShareToken';
import { useDesignerProfile } from '@/hooks/useDesignerProfile';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { createAndDownloadZip } from '@/utils/exports/zip-utils';
import { getExportOptions } from '@/utils/exports/export-options';
import { sanitizeFileName } from '@/utils/security';
import { ShareBackground } from '@/components/share/ShareBackground';
import { ShareHeader } from '@/components/share/ShareHeader';
import { ShareLogoDisplay } from '@/components/share/ShareLogoDisplay';
import { ShareLogoInfo } from '@/components/share/ShareLogoInfo';
import { ShareSidebar } from '@/components/share/ShareSidebar';
import { SharePageHeader } from '@/components/share/SharePageHeader';
import Footer from '@/components/Footer';

const LogoShare = () => {
  const { shareToken } = useParams<{ shareToken: string }>();
  const { data: logo, isLoading, error } = useLogoByShareToken(shareToken!);
  const { designerProfile, profileLoading, profileError, profileRetryCount } = useDesignerProfile(logo?.user_id, isLoading);
  
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  // Enhanced background style computation with better logging
  const brandingStyle = useMemo(() => {
    console.log('LogoShare: Computing branding style with profile:', {
      branding_enabled: designerProfile?.branding_enabled,
      branding_background_url: designerProfile?.branding_background_url,
      branding_overlay_opacity: designerProfile?.branding_overlay_opacity,
      profile_exists: !!designerProfile,
      profile_data: designerProfile
    });

    if (designerProfile?.branding_enabled && designerProfile?.branding_background_url) {
      const style = {
        backgroundImage: `url(${designerProfile.branding_background_url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      };
      console.log('LogoShare: Using custom branding background:', style);
      return style;
    } else {
      const defaultStyle = {
        backgroundColor: 'white',
      };
      console.log('LogoShare: Using white background:', {
        reason: !designerProfile ? 'No profile data' : 
                !designerProfile.branding_enabled ? 'Branding disabled' : 
                !designerProfile.branding_background_url ? 'No background URL' : 'Unknown'
      });
      return defaultStyle;
    }
  }, [designerProfile]);

  const overlayOpacity = designerProfile?.branding_overlay_opacity ?? 0.8;

  if (!shareToken) {
    return <Navigate to="/" replace />;
  }

  if (isLoading) {
    return (
      <div className="relative min-h-screen flex flex-col">
        <SharePageHeader />
        <div className="flex-1 bg-white flex items-center justify-center">
          <div className="text-left text-gray-800">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-800 mb-4"></div>
            <p className="text-lg">Loading logo...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !logo) {
    console.error('LogoShare: Logo not found or error:', error);
    return (
      <div className="relative min-h-screen flex flex-col">
        <SharePageHeader />
        <div className="flex-1 bg-white flex items-center justify-center">
          <div className="text-left text-gray-800">
            <h1 className="text-2xl font-bold mb-2">Logo Not Found</h1>
            <p className="opacity-80">This logo may have been removed or made private.</p>
            {profileError && (
              <p className="text-sm opacity-60 mt-2">Profile error: {profileError}</p>
            )}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const convertBlobToFile = (blob: Blob, filename: string, mimeType: string): File => {
    const sanitizedFilename = sanitizeFileName(filename);
    return new File([blob], sanitizedFilename, { type: mimeType });
  };

  const handleDownload = async () => {
    if (isExporting) return;
    
    setIsExporting(true);
    setExportProgress(0);
    
    try {
      const { data: logoBlob, error: downloadError } = await supabase.storage
        .from('logos')
        .download(logo.file_path);
      
      if (downloadError) throw downloadError;
      if (!logoBlob) throw new Error('Failed to download logo file');
      
      const logoFile = convertBlobToFile(
        logoBlob,
        logo.title || 'logo',
        logo.file_type || logoBlob.type
      );
      
      const exportOptions = getExportOptions();
      const selectedOptions = exportOptions.map(option => option.name);
      
      await createAndDownloadZip(
        logoFile, 
        selectedOptions, 
        setIsExporting, 
        setExportProgress
      );
      
      toast.success('ZIP package downloaded successfully!');
    } catch (error) {
      console.error('ZIP export error:', error);
      toast.error('Failed to create ZIP package');
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard');
  };

  const getDesignerName = () => {
    return designerProfile?.full_name || designerProfile?.email || 'Unknown Designer';
  };

  console.log('LogoShare: Final render with overlay opacity:', overlayOpacity);
  console.log('LogoShare: Final branding style:', brandingStyle);

  return (
    <div className="relative min-h-screen flex flex-col pt-[60px]">
      {/* Fixed positioned header */}
      <SharePageHeader />
      
      <div className="flex-1">
        <ShareBackground brandingStyle={brandingStyle} overlayOpacity={overlayOpacity}>
          {/* Fixed Header */}
          <div className="flex-shrink-0 p-4 border-b border-gray-100">
            <ShareHeader
              logoTitle={logo.title}
              designerName={getDesignerName()}
              profileLoading={profileLoading}
              profileRetryCount={profileRetryCount}
            />
          </div>

          {/* Scrollable Content Area - Using native overflow instead of ScrollArea */}
          <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="p-4 space-y-4">
              <ShareLogoDisplay logo={logo} />
              <ShareLogoInfo logo={logo} />
            </div>
          </div>

          {/* Fixed Download Section */}
          <ShareSidebar
            isExporting={isExporting}
            exportProgress={exportProgress}
            onDownload={handleDownload}
          />
        </ShareBackground>
      </div>

      <Footer />
    </div>
  );
};

export default LogoShare;
