import React, { useState, useRef } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

interface LogoUploaderProps {
  onLogoUpload: (file: File) => void;
  isProcessing?: boolean;
  previewUrl?: string | null;
  previewType?: string | null;
}

const LogoUploader: React.FC<LogoUploaderProps> = ({ 
  onLogoUpload, 
  isProcessing = false, 
  previewUrl = null,
  previewType = null
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (isProcessing) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      validateAndUploadFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isProcessing) return;
    
    if (e.target.files && e.target.files.length > 0) {
      validateAndUploadFile(e.target.files[0]);
    }
  };

  const validateAndUploadFile = (file: File) => {
    const validTypes = ['image/svg+xml'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      toast.error('Invalid file type! Please upload an SVG file only.', {
        description: 'Only SVG files are supported for logo uploads.',
        duration: 4000,
      });
      return;
    }

    if (file.size > maxSize) {
      toast.error('File too large! Please upload a file smaller than 5MB.', {
        description: `Your file is ${(file.size / (1024 * 1024)).toFixed(1)}MB. Maximum size is 5MB.`,
        duration: 4000,
      });
      return;
    }

    console.log('Uploading file:', file.name, 'Type:', file.type, 'Size:', file.size);
    onLogoUpload(file);
    toast.success('Logo uploaded successfully!');
  };

  const triggerFileInput = () => {
    if (fileInputRef.current && !isProcessing) {
      fileInputRef.current.click();
    }
  };

  // Determine if we have a preview to show
  const hasPreview = previewUrl && previewType === 'svg';

  return (
    <div className="logo-uploader-container sticky top-4">
      <div
        className={`logo-drop-area border-2 border-dashed p-8 rounded-lg transition-all ${
          isDragging ? 'border-primary bg-primary/5' : 'border-gray-200'
        } ${isProcessing ? 'opacity-70 cursor-not-allowed' : 'hover:border-primary hover:bg-primary/5 cursor-pointer'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        <div className="flex flex-col items-center">
          {isProcessing ? (
            <div className="w-24 h-24 rounded-full border border-gray-200 flex items-center justify-center mb-4">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : hasPreview ? (
            <div className="preview-container mb-4 p-4 border border-gray-200 rounded-lg bg-white">
              <img 
                src={previewUrl} 
                alt="Logo Preview" 
                className="max-h-48 max-w-full object-contain"
              />
            </div>
          ) : (
            <div className="w-24 h-24 rounded-full border border-gray-200 flex items-center justify-center mb-4">
              <Plus className="w-10 h-10 text-gray-400" />
            </div>
          )}
          <h3 className="text-xl mb-2">
            {isProcessing ? 'Processing...' : hasPreview ? 'Your logo' : 'Drop your SVG logo here or click to browse'}
          </h3>
          {!isProcessing && !hasPreview && <p className="text-gray-500 text-sm">SVG only · 5MB Limit</p>}
          {hasPreview && <p className="text-sm text-muted-foreground">Click to upload a different logo</p>}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept=".svg,image/svg+xml"
          className="hidden"
          disabled={isProcessing}
        />
      </div>
    </div>
  );
};

export default LogoUploader;
