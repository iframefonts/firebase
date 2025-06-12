
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LogoNameFieldProps {
  logoName: string;
  onUpdateLogoName: (logoName: string) => void;
}

const LogoNameField: React.FC<LogoNameFieldProps> = ({ logoName, onUpdateLogoName }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateLogoName(e.target.value);
  };

  return (
    <div>
      <Label className="text-sm font-medium mb-2 block">
        Logo Name <span className="text-red-500">*</span>
      </Label>
      
      <Input
        value={logoName}
        onChange={handleChange}
        placeholder="Enter logo name"
        className="focus:border-blue-600 focus:ring-0 focus:text-blue-600 transition-all duration-200"
      />
      
      <div className="flex justify-between items-center mt-2">
        <p className="text-xs text-gray-500">
          A descriptive name for this logo
        </p>
        <span className="text-xs text-gray-400">{logoName.length}</span>
      </div>
    </div>
  );
};

export default LogoNameField;
