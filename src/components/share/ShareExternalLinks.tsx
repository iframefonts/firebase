
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ExternalLinkItem {
  id: string;
  name: string;
  url: string;
}

interface ShareExternalLinksProps {
  externalLinks: ExternalLinkItem[];
}

export const ShareExternalLinks: React.FC<ShareExternalLinksProps> = ({ externalLinks }) => {
  if (!externalLinks || externalLinks.length === 0) {
    return null;
  }

  const handleLinkClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">
          External Links
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {externalLinks.map((link, index) => (
            <button
              key={index}
              onClick={() => handleLinkClick(link.url)}
              className="flex items-center justify-between w-full text-left bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded text-sm transition-colors"
            >
              <span className="font-medium text-gray-700">{link.name}</span>
              <ExternalLink className="h-3 w-3 text-gray-500" />
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
