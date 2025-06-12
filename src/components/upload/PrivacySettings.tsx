
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Globe, Lock, Info } from 'lucide-react';

interface PrivacySettingsProps {
  isPublic: boolean;
  onUpdatePrivacy: (isPublic: boolean) => void;
}

const PrivacySettings: React.FC<PrivacySettingsProps> = ({
  isPublic,
  onUpdatePrivacy
}) => {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Privacy Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            {isPublic ? <Globe className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
            <span className="text-sm">
              {isPublic ? 'Public' : 'Private'}
            </span>
          </div>
          <Switch
            checked={isPublic}
            onCheckedChange={onUpdatePrivacy}
          />
        </div>
        <p className="text-xs text-gray-500 mb-3">
          {isPublic 
            ? 'Anyone with the link can view this logo' 
            : 'Only you can view this logo'
          }
        </p>
        
        {!isPublic && (
          <div className="flex items-start space-x-2 p-2 bg-blue-50 rounded-md border border-blue-200">
            <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-blue-700">
              <p className="font-medium mb-1">Grant Specific Access</p>
              <p>You can invite specific people to view your private logo with different permission levels after saving.</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PrivacySettings;
