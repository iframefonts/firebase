
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/hooks/useLogos';
import { ShareExternalLinks } from '@/components/share/ShareExternalLinks';
import { ShareUsageNotes } from '@/components/share/ShareUsageNotes';

interface PreviewLogoInfoProps {
  logo: Logo;
}

export const PreviewLogoInfo: React.FC<PreviewLogoInfoProps> = ({ logo }) => {
  const handleFontClick = (url: string) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Colors Card */}
      {logo.colors && logo.colors.length > 0 && (
        <Card className="shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">
              Colors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-2">
              {logo.colors.slice(0, 8).map((color: any, index: number) => (
                <div key={index} className="flex flex-col items-center space-y-1">
                  <div 
                    className="w-10 h-10 rounded border border-gray-200 shadow-sm"
                    style={{ backgroundColor: color.value }}
                  />
                  <span className="text-xs font-mono text-gray-600 uppercase text-center">{color.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Fonts Card */}
      {logo.fonts && logo.fonts.length > 0 && (
        <Card className="shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">
              Fonts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {logo.fonts.slice(0, 5).map((font: any, index: number) => (
                <div key={index}>
                  {font.url ? (
                    <button
                      onClick={() => handleFontClick(font.url)}
                      className="flex items-center justify-between w-full text-left bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded text-sm transition-colors"
                    >
                      <span className="font-medium text-gray-700">{font.name}</span>
                      <ExternalLink className="h-3 w-3 text-gray-500" />
                    </button>
                  ) : (
                    <div className="bg-gray-50 px-3 py-2 rounded text-sm">
                      <span className="font-medium text-gray-700">{font.name}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* External Links Card */}
      <ShareExternalLinks externalLinks={logo.external_links || []} />
      
      {/* Usage Notes Card */}
      <ShareUsageNotes notes={logo.notes || ''} />
    </div>
  );
};
