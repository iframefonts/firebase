
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useLogoById } from '@/hooks/useLogoById';
import { UploadProvider } from '@/contexts/UploadContext';
import UploadLayout from '@/components/upload/UploadLayout';
import { useUpload } from '@/contexts/UploadContext';

// This component is used to load data for edit mode
const LogoDataLoader: React.FC = () => {
  const { logoId } = useParams();
  const navigate = useNavigate();
  const { setLogoData } = useUpload();
  const { data: existingLogo, isLoading: logoLoading, error: logoError } = useLogoById(logoId || '');

  // Load existing logo data when in edit mode
  useEffect(() => {
    if (!logoLoading && existingLogo) {
      console.log('Loading existing logo data:', existingLogo);
      setLogoData(existingLogo);
    }
  }, [existingLogo, logoLoading, setLogoData]);

  // Handle logo loading errors
  useEffect(() => {
    if (logoError && logoId) {
      console.error('Error loading logo:', logoError);
      toast.error('Failed to load logo data. Please try again.');
      navigate('/dashboard');
    }
  }, [logoError, logoId, navigate]);

  if (logoId && logoLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (logoId && logoError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Failed to Load Logo</h2>
          <p className="text-gray-600 mb-4">The logo you're trying to edit could not be found or you don't have permission to access it.</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <UploadLayout />;
};

const Upload: React.FC = () => {
  const { logoId } = useParams();
  const { user } = useAuth();

  return (
    <UploadProvider logoId={logoId}>
      <LogoDataLoader />
    </UploadProvider>
  );
};

export default Upload;
