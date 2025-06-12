
import React from 'react';
import { useParams } from 'react-router-dom';
import ColorPalette from './ColorPalette';
import FontManager from './FontManager';
import ExternalLinks from './ExternalLinks';
import Notes from './Notes';
import ClientInfo from './ClientInfo';
import { Save, Edit } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface Color {
  id: string;
  value: string;
  rgbValue: string;
}

interface Font {
  id: string;
  name: string;
  url: string;
}

interface ExternalLink {
  id: string;
  name: string;
  url: string;
}

interface SidebarProps {
  colors: Color[];
  onUpdateColors: (colors: Color[]) => void;
  fonts: Font[];
  onUpdateFonts: (fonts: Font[]) => void;
  notes: string;
  onUpdateNotes: (notes: string) => void;
  clientName: string;
  onUpdateClientName: (clientName: string) => void;
  isLogoUploaded: boolean;
  onSaveLogo: () => void;
  externalLinks: ExternalLink[];
  onUpdateExternalLinks: (links: ExternalLink[]) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  colors,
  onUpdateColors,
  fonts,
  onUpdateFonts,
  notes,
  onUpdateNotes,
  clientName,
  onUpdateClientName,
  isLogoUploaded,
  onSaveLogo,
  externalLinks,
  onUpdateExternalLinks
}) => {
  const { logoId } = useParams();
  const isEditMode = !!logoId;

  return (
    <aside className="w-full md:w-[360px] bg-white border-l p-5 overflow-y-auto flex flex-col">
      <h2 className="text-2xl font-bold mb-6">Additional Information</h2>
      
      <div className="flex-1">
        <ClientInfo clientName={clientName} onUpdateClientName={onUpdateClientName} />
        <ColorPalette colors={colors} onUpdateColors={onUpdateColors} />
        <FontManager fonts={fonts} onUpdateFonts={onUpdateFonts} />
        <ExternalLinks externalLinks={externalLinks} onUpdateExternalLinks={onUpdateExternalLinks} />
        <Notes notes={notes} onUpdateNotes={onUpdateNotes} />
      </div>

      <div className="sticky bottom-0 bg-white pt-3 mt-4">
        <Button
          className="w-full flex items-center justify-center bg-black text-white rounded-full hover:bg-gray-800"
          onClick={onSaveLogo}
          disabled={!isLogoUploaded}
        >
          {isEditMode ? (
            <>
              <Edit className="w-4 h-4 mr-2" />
              Update Logo
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Logo
            </>
          )}
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
