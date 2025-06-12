
import React, { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useClientNames } from '@/hooks/useClientNames';
import { ChevronDown } from 'lucide-react';

interface ClientInfoProps {
  clientName: string;
  onUpdateClientName: (clientName: string) => void;
}

const ClientInfo: React.FC<ClientInfoProps> = ({ clientName, onUpdateClientName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredNames, setFilteredNames] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { data: clientNames = [] } = useClientNames();

  useEffect(() => {
    const filtered = clientNames.filter(name => 
      name.toLowerCase().includes(clientName.toLowerCase())
    );
    setFilteredNames(filtered);
  }, [clientName, clientNames]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onUpdateClientName(value);
    setIsOpen(value.length > 0 && filteredNames.length > 0);
  };

  const handleInputFocus = () => {
    if (filteredNames.length > 0) {
      setIsOpen(true);
    }
  };

  const handleSelectClient = (name: string) => {
    onUpdateClientName(name);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Label className="text-sm font-medium mb-2 block">
        Client Name <span className="text-destructive">*</span>
      </Label>
      
      <div className="relative">
        <Input
          ref={inputRef}
          value={clientName}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder="Enter or select client name"
          className="focus:border-blue-600 focus:ring-0 focus:text-blue-600 transition-all duration-200 pr-8"
        />
        {clientNames.length > 0 && (
          <ChevronDown 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" 
          />
        )}
      </div>
      
      {isOpen && filteredNames.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
          {filteredNames.map((name, index) => (
            <button
              key={index}
              className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none text-sm"
              onClick={() => handleSelectClient(name)}
            >
              {name}
            </button>
          ))}
        </div>
      )}
      
      <div className="flex justify-between items-center mt-2">
        <p className="text-xs text-gray-500">
          Categorize logos by client (required)
        </p>
        <span className="text-xs text-gray-400">{clientName.length}</span>
      </div>
    </div>
  );
};

export default ClientInfo;
