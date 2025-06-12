
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { useUpload } from '@/contexts/UploadContext';
import { useAuth } from '@/contexts/AuthContext';

interface FormActionsProps {
  isLogoUploaded: boolean;
  className?: string;
}

const FormActions: React.FC<FormActionsProps> = ({ isLogoUploaded, className = "" }) => {
  const { isEditMode, handleSave, clientName } = useUpload();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Only allow save if user is logged in
  const onSaveLogo = user ? () => {
    handleSave(() => {
      navigate('/dashboard');
    });
  } : () => {};
  
  // Disable save if no logo uploaded or no client name
  const isDisabled = !isLogoUploaded || !clientName.trim();
  
  return (
    <div className={className}>
      <Button
        className="w-full h-12 text-base font-medium text-white bg-gradient-to-r from-purple-500 to-purple-600 rounded-full hover:from-purple-600 hover:to-purple-700 transition-all duration-200 justify-start"
        onClick={onSaveLogo}
        disabled={isDisabled}
      >
        {isEditMode ? 'Update Logo' : 'Save Logo'}
      </Button>
    </div>
  );
};

export default FormActions;
