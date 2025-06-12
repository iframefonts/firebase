
import React, { useState } from 'react';
import { Plus, Trash2, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';

interface Font {
  id: string;
  name: string;
  url: string;
}

interface FontManagerProps {
  fonts: Font[];
  onUpdateFonts: (fonts: Font[]) => void;
}

const FontManager: React.FC<FontManagerProps> = ({ fonts, onUpdateFonts }) => {
  const [fontName, setFontName] = useState("");
  const [fontUrl, setFontUrl] = useState("");

  const handleAddFont = () => {
    if (!fontName.trim() || !fontUrl.trim()) {
      toast.error("Please enter both font name and URL");
      return;
    }

    if (fonts.some(f => f.name === fontName)) {
      toast.error("This font is already added");
      return;
    }

    const newFont = {
      id: Date.now().toString(),
      name: fontName,
      url: fontUrl
    };
    
    onUpdateFonts([...fonts, newFont]);
    setFontName("");
    setFontUrl("");
    toast.success("Font added successfully");
  };

  const handleRemoveFont = (id: string) => {
    onUpdateFonts(fonts.filter(font => font.id !== id));
    toast.success("Font removed");
  };

  return (
    <div>
      <h3 className="text-sm font-medium mb-3 text-left">Fonts</h3>
      
      <div className="grid grid-cols-1 gap-3 mb-3">
        <Input
          placeholder="Font name (e.g., Inter Regular)"
          value={fontName}
          onChange={(e) => setFontName(e.target.value)}
          className="focus:border-blue-600 focus:ring-0 focus:text-blue-600 transition-all duration-200 text-left"
        />
        <Input
          placeholder="Font URL (e.g., https://fonts.google.com/specimen/Inter)"
          value={fontUrl}
          onChange={(e) => setFontUrl(e.target.value)}
          className="focus:border-blue-600 focus:ring-0 focus:text-blue-600 transition-all duration-200 text-left"
        />
        <Button onClick={handleAddFont} className="w-full justify-start">
          <Plus className="w-4 h-4 mr-2" />
          Add Font
        </Button>
      </div>
      
      <div className="space-y-2">
        {fonts.length === 0 ? (
          <p className="text-sm text-gray-500 italic text-left">No fonts added yet. Add custom fonts to use with your logo.</p>
        ) : (
          fonts.map(font => (
            <div key={font.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
              <div className="text-left">
                <div className="font-medium text-left">{font.name}</div>
                <a 
                  href={font.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-xs text-blue-500 hover:text-blue-700 hover:underline flex items-center"
                >
                  {font.url.length > 30 ? font.url.substring(0, 30) + '...' : font.url}
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => handleRemoveFont(font.id)}
                className="h-8 w-8"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FontManager;
