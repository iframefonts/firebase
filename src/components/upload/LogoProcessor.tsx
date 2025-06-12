
import React from 'react';
import LogoUploader from '@/components/LogoUploader';
import { useUpload } from '@/contexts/UploadContext';

const LogoProcessor: React.FC = () => {
  const {
    handleLogoUpload,
    isProcessing,
    logoPreviewUrl,
    previewType
  } = useUpload();

  return (
    <LogoUploader 
      onLogoUpload={handleLogoUpload} 
      isProcessing={isProcessing} 
      previewUrl={logoPreviewUrl}
      previewType={previewType}
    />
  );
};

export default LogoProcessor;
