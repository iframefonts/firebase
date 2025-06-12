
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Globe } from 'lucide-react';

interface ShareHeaderProps {
  logoTitle: string;
  designerName: string;
  profileLoading: boolean;
  profileRetryCount: number;
}

export const ShareHeader: React.FC<ShareHeaderProps> = ({
  logoTitle,
  designerName,
  profileLoading,
  profileRetryCount
}) => {
  return (
    <div className="flex items-start justify-between mb-4">
      <div className="text-left">
        <h1 className="text-2xl font-bold text-gray-900">{logoTitle}</h1>
        <p className="text-sm text-gray-600">by {designerName}</p>
        {profileLoading && (
          <p className="text-xs text-blue-600">Loading designer info...</p>
        )}
        {profileRetryCount > 0 && (
          <p className="text-xs text-orange-600">Retrying profile load ({profileRetryCount}/3)</p>
        )}
      </div>
      <Badge variant="secondary" className="flex items-center">
        <Globe className="h-3 w-3 mr-1" />
        Public
      </Badge>
    </div>
  );
};
