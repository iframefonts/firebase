
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const EmptyState: React.FC = () => {
  const navigate = useNavigate();

  const handleUploadNewLogo = () => {
    navigate('/upload');
  };

  return (
    <div className="text-left py-12">
      <div className="w-24 h-24 bg-gray-200 rounded-full mb-4 flex items-center justify-center">
        <Plus className="h-12 w-12 text-gray-400" />
      </div>
      <h3 className="text-xl font-medium mb-2">No logos yet</h3>
      <p className="text-gray-600 mb-6">Create your first logo with a name and organize by client</p>
      <Button onClick={handleUploadNewLogo}>
        <Plus className="h-4 w-4 mr-2" />
        Upload Your First Logo
      </Button>
    </div>
  );
};

export default EmptyState;
