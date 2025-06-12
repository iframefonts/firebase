import React from 'react';
import ColorPalette from '@/components/ColorPalette';
import FontManager from '@/components/FontManager';
import ExternalLinks from '@/components/ExternalLinks';
import Notes from '@/components/Notes';
import LogoNameField from '@/components/LogoNameField';
import ClientInfo from '@/components/ClientInfo';
import PrivacySettings from '@/components/upload/PrivacySettings';
import { Button } from "@/components/ui/button";
import { useUpload } from '@/contexts/UploadContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const UploadSidebar: React.FC = () => {
  const {
    isEditMode,
    colors,
    setColors,
    fonts,
    setFonts,
    notes,
    setNotes,
    logoName,
    setLogoName,
    clientName,
    setClientName,
    logoFile,
    logoPreviewUrl,
    externalLinks,
    setExternalLinks,
    isPublic,
    setIsPublic,
    handleSave
  } = useUpload();

  const { user } = useAuth();
  const navigate = useNavigate();

  // Consider a logo uploaded if editing an existing logo or a new file was added
  const isLogoUploaded = isEditMode || !!logoFile || !!logoPreviewUrl;
  
  // Only allow save if user is logged in
  const onSaveLogo = user ? () => {
    handleSave(() => {
      navigate('/dashboard');
    });
  } : () => {};
  
  // Disable save if no logo uploaded or no client name
  const isDisabled = !isLogoUploaded || !clientName.trim();

  return (
    <aside className="w-full md:w-[360px] bg-white border-l flex flex-col relative text-left h-screen">
      {/* Scrollable content area */}
      <div className="p-4 overflow-y-auto flex-1 pb-20">
        <h2 className="text-2xl font-medium mb-4 text-left">Additional Information</h2>
        
        <div className="space-y-6 text-left">
          <LogoNameField logoName={logoName} onUpdateLogoName={setLogoName} />
          <ClientInfo clientName={clientName} onUpdateClientName={setClientName} />
          <PrivacySettings isPublic={isPublic} onUpdatePrivacy={setIsPublic} />
          <ColorPalette colors={colors} onUpdateColors={setColors} />
          <FontManager fonts={fonts} onUpdateFonts={setFonts} />
          <ExternalLinks externalLinks={externalLinks} onUpdateExternalLinks={setExternalLinks} />
          <Notes notes={notes} onUpdateNotes={setNotes} />
        </div>
      </div>

      {/* Fixed Update Logo Button */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t p-4 pb-12">
        <Button
          className="w-full h-12 text-base font-medium text-white bg-gradient-to-r from-purple-500 to-purple-600 rounded-full hover:from-purple-600 hover:to-purple-700 transition-all duration-200 text-left"
          onClick={onSaveLogo}
          disabled={isDisabled}
        >
          {isEditMode ? 'Update Logo' : 'Save Logo'}
        </Button>
      </div>
    </aside>
  );
};

export default UploadSidebar;
