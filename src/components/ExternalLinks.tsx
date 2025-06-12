
import React, { useState } from 'react';
import { Plus, Trash2, ExternalLink } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

interface ExternalLinkItem {
  id: string;
  name: string;
  url: string;
}

interface ExternalLinksProps {
  externalLinks: ExternalLinkItem[];
  onUpdateExternalLinks: (links: ExternalLinkItem[]) => void;
}

const ExternalLinks: React.FC<ExternalLinksProps> = ({ externalLinks, onUpdateExternalLinks }) => {
  const [newLinkName, setNewLinkName] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");

  const handleAddLink = () => {
    if (!newLinkName.trim() || !newLinkUrl.trim()) {
      toast.error("Please fill in both name and URL");
      return;
    }

    // Basic URL validation
    try {
      new URL(newLinkUrl);
    } catch {
      toast.error("Please enter a valid URL");
      return;
    }

    const newLink = {
      id: Date.now().toString(),
      name: newLinkName.trim(),
      url: newLinkUrl.trim()
    };
    
    onUpdateExternalLinks([...externalLinks, newLink]);
    setNewLinkName("");
    setNewLinkUrl("");
    toast.success("External link added");
  };

  const handleRemoveLink = (id: string) => {
    onUpdateExternalLinks(externalLinks.filter(link => link.id !== id));
    toast.success("External link removed");
  };

  const handleOpenLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div>
      <h3 className="text-sm font-medium mb-3 text-left">External Links</h3>
      
      <div className="space-y-3 mb-3">
        <Input
          placeholder="Link name (e.g., Website)"
          value={newLinkName}
          onChange={(e) => setNewLinkName(e.target.value)}
          className="focus:border-blue-600 focus:ring-0 focus:text-blue-600 transition-all duration-200 text-left"
        />
        <Input
          placeholder="URL (e.g., https://example.com)"
          value={newLinkUrl}
          onChange={(e) => setNewLinkUrl(e.target.value)}
          className="focus:border-blue-600 focus:ring-0 focus:text-blue-600 transition-all duration-200 text-left"
        />
        <Button 
          size="sm" 
          onClick={handleAddLink}
          className="w-full justify-start"
        >
          <Plus className="w-4 h-4 mr-1" /> Add Link
        </Button>
      </div>
      
      <div className="space-y-2">
        {externalLinks.length === 0 ? (
          <p className="text-sm text-gray-500 italic text-left">No external links added yet.</p>
        ) : (
          externalLinks.map(link => (
            <div key={link.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
              <div className="flex-1 min-w-0 text-left">
                <div className="text-sm font-medium truncate text-left">{link.name}</div>
                <div className="text-xs text-gray-500 truncate text-left">{link.url}</div>
              </div>
              <div className="flex space-x-1 ml-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleOpenLink(link.url)}
                  className="h-8 w-8"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleRemoveLink(link.id)}
                  className="h-8 w-8"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExternalLinks;
