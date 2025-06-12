import React, { useState } from 'react';
import { Download, Settings } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from 'sonner';
import { getExportOptions } from '@/utils/exports/export-options';
import { createAndDownloadZip } from '@/utils/exports/zip-utils';

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

interface ExportOptionsProps {
  isLogoUploaded: boolean;
  logoFile: File | null;
  colors?: Color[];
  fonts?: Font[];
  notes?: string;
  clientName?: string;
  externalLinks?: ExternalLink[];
}

const ExportOptions: React.FC<ExportOptionsProps> = ({ 
  isLogoUploaded, 
  logoFile,
  colors = [],
  fonts = [],
  notes = "",
  clientName = "",
  externalLinks = []
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  
  const exportOptions = getExportOptions();
  const [selectedOptions, setSelectedOptions] = useState<string[]>(exportOptions.map(option => option.name));

  const handleOptionToggle = (optionName: string) => {
    setSelectedOptions(prev => 
      prev.includes(optionName)
        ? prev.filter(name => name !== optionName)
        : [...prev, optionName]
    );
  };

  const handleExport = async () => {
    if (!isLogoUploaded || !logoFile) {
      toast.error("Please upload a logo first");
      return;
    }

    if (selectedOptions.length === 0) {
      toast.error("Please select at least one export option");
      return;
    }

    setIsExporting(true);
    setExportProgress(0);
    
    try {
      await createAndDownloadZip(logoFile, selectedOptions, setIsExporting, setExportProgress);
      toast.success("Selected files exported successfully!");
    } catch (error) {
      console.error('Export error:', error);
      toast.error("Error exporting files");
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  return (
    <div className="mt-8 flex flex-col">
      <h3 className="text-lg font-medium mb-4">Export Options</h3>

      <div className="space-y-4 flex-1">
        {exportOptions.map((option, index) => (
          <div 
            key={index} 
            className={`bg-gray-50 p-4 rounded-md border-2 transition-colors ${
              selectedOptions.includes(option.name) ? 'border-primary' : 'border-transparent'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-medium">{option.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                <p className="text-xs text-gray-500 mt-1">{option.formats}</p>
              </div>
              <Checkbox 
                checked={selectedOptions.includes(option.name)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedOptions(prev => [...prev, option.name]);
                  } else {
                    setSelectedOptions(prev => prev.filter(name => name !== option.name));
                  }
                }}
                className="h-5 w-5"
              />
            </div>
          </div>
        ))}

        {/* Advanced Options - keeping for future use */}
        <Collapsible open={showAdvancedOptions} onOpenChange={setShowAdvancedOptions}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between">
              <span className="flex items-center">
                <Settings className="w-4 h-4 mr-2" />
                Advanced Options
              </span>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 pt-4">
            {/* Advanced options content will be added here when available */}
          </CollapsibleContent>
        </Collapsible>
      </div>

      <div className="sticky bottom-0 bg-white pt-3 mt-4">
        {isExporting && (
          <div className="mb-4">
            <Progress value={exportProgress} className="h-2" />
            <p className="text-xs text-center mt-1 text-gray-500">Exporting... {exportProgress}%</p>
          </div>
        )}

        <Button
          className="w-full flex items-center justify-center"
          onClick={handleExport}
          disabled={!isLogoUploaded || isExporting || selectedOptions.length === 0}
        >
          <Download className="w-4 h-4 mr-2" />
          {isExporting ? "Exporting..." : "Download Selected Files"}
        </Button>
      </div>
    </div>
  );
};

export default ExportOptions;
