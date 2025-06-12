
import React from 'react';
import Header from '@/components/Header';
import UploadBreadcrumb from '@/components/UploadBreadcrumb';
import LogoProcessor from '@/components/upload/LogoProcessor';
import UploadSidebar from '@/components/upload/UploadSidebar';
import { useUpload } from '@/contexts/UploadContext';
import Footer from '@/components/Footer';

const UploadLayout: React.FC = () => {
  const { isEditMode } = useUpload();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 flex flex-col md:flex-row">
        <div className="flex-1 flex flex-col p-6 md:p-10">
          <div className="max-w-4xl mx-auto w-full">
            <UploadBreadcrumb />
            <h1 className="text-2xl font-medium mb-3 text-left">
              {isEditMode ? 'Edit Your Logo!' : 'Lets LogoDrop it!'}
            </h1>
            <p className="text-xs mb-8 text-gray-700 text-left">
              {isEditMode 
                ? 'Update your logo and its information.' 
                : 'Get your logo in all the formats you need with one click.'
              }
            </p>
            
            <LogoProcessor />
          </div>
        </div>
        
        <UploadSidebar />
      </div>

      <Footer />
    </div>
  );
};

export default UploadLayout;
