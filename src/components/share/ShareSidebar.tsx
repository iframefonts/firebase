
import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';

interface ShareSidebarProps {
  isExporting: boolean;
  exportProgress: number;
  onDownload: () => void;
}

export const ShareSidebar: React.FC<ShareSidebarProps> = ({
  isExporting,
  exportProgress,
  onDownload
}) => {
  return (
    <div className="flex-shrink-0 border-t border-gray-100 bg-white p-4 relative z-10">
      {/* Export Progress */}
      {isExporting && exportProgress > 0 && (
        <div className="mb-3">
          <Progress value={exportProgress} className="h-2 mb-2" />
          <p className="text-xs text-center text-gray-500">
            Creating ZIP... {exportProgress}%
          </p>
        </div>
      )}
      
      {/* Action Buttons - Optimized for 320px width */}
      <div className="space-y-2">
        <Button 
          onClick={onDownload} 
          disabled={isExporting}
          className="w-full h-12 text-base font-medium text-white bg-gradient-to-r from-purple-500 to-purple-600 rounded-full hover:from-purple-600 hover:to-purple-700 transition-all duration-200" 
          size="lg"
        >
          {isExporting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Creating ZIP...
            </>
          ) : (
            "Get your logo"
          )}
        </Button>

        {/* Credits */}
        <div className="text-center pt-1">
          <p className="text-xs text-gray-500">
            Powered by Logo Drop
          </p>
        </div>
      </div>
    </div>
  );
};
