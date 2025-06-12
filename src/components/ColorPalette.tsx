
import React, { useState, useRef } from 'react';
import { Plus, Trash2, Pencil } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

interface Color {
  id: string;
  value: string;
  rgbValue: string;
}

interface ColorPaletteProps {
  colors: Color[];
  onUpdateColors: (colors: Color[]) => void;
}

const ColorPalette: React.FC<ColorPaletteProps> = ({ colors, onUpdateColors }) => {
  const [newColor, setNewColor] = useState("#000000");
  const [editingColorId, setEditingColorId] = useState<string | null>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);
  const editColorInputRef = useRef<HTMLInputElement>(null);

  const handleColorPickerClick = () => {
    colorInputRef.current?.click();
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedColor = e.target.value;
    setNewColor(selectedColor);
  };

  const handleAddColor = () => {
    // Check if color already exists
    if (colors.some(c => c.value === newColor)) {
      toast.error("This color is already in your palette");
      return;
    }

    const rgbValue = hexToRgb(newColor);
    const newColorObj = {
      id: Date.now().toString(),
      value: newColor,
      rgbValue
    };
    
    onUpdateColors([...colors, newColorObj]);
    toast.success("Color added to palette");
  };

  const handleEditColor = (colorId: string, currentColor: string) => {
    setEditingColorId(colorId);
    // Set the edit input to the current color value
    if (editColorInputRef.current) {
      editColorInputRef.current.value = currentColor;
    }
    editColorInputRef.current?.click();
  };

  const handleEditColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedColor = e.target.value;
    
    if (!editingColorId) return;

    // Check if the new color already exists (excluding the current color being edited)
    if (colors.some(c => c.value === selectedColor && c.id !== editingColorId)) {
      toast.error("This color is already in your palette");
      setEditingColorId(null);
      return;
    }

    const rgbValue = hexToRgb(selectedColor);
    const updatedColors = colors.map(color => 
      color.id === editingColorId 
        ? { ...color, value: selectedColor, rgbValue }
        : color
    );
    
    onUpdateColors(updatedColors);
    toast.success("Color updated successfully");
    setEditingColorId(null);
  };

  const handleRemoveColor = (id: string) => {
    onUpdateColors(colors.filter(color => color.id !== id));
    toast.success("Color removed from palette");
  };

  // Helper function to convert HEX to RGB
  const hexToRgb = (hex: string): string => {
    // Remove the # if present
    hex = hex.replace(/^#/, '');
    
    // Parse the hex values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium">Color Palette</h3>
        <div className="flex space-x-2">
          <input
            ref={colorInputRef}
            type="color" 
            value={newColor} 
            onChange={handleColorChange}
            className="sr-only"
          />
          <input
            ref={editColorInputRef}
            type="color"
            onChange={handleEditColorChange}
            className="sr-only"
          />
          <Button 
            size="sm" 
            onClick={handleColorPickerClick}
            className="mr-2"
          >
            Pick Color
          </Button>
          <Button 
            size="sm" 
            onClick={handleAddColor}
          >
            <Plus className="w-4 h-4 mr-1" /> Add
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        {colors.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No colors detected yet. Colors will be automatically extracted from your uploaded logo.</p>
        ) : (
          colors.map(color => (
            <div key={color.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
              <div className="flex items-center">
                <div 
                  className="w-6 h-6 rounded-full mr-3" 
                  style={{ backgroundColor: color.value }}
                ></div>
                <div>
                  <div className="text-sm font-mono">{color.value}</div>
                  <div className="text-xs text-gray-500">{color.rgbValue}</div>
                </div>
              </div>
              <div className="flex space-x-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleEditColor(color.id, color.value)}
                  className="h-8 w-8"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleRemoveColor(color.id)}
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

export default ColorPalette;
