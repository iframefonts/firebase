
import React from 'react';

interface ShareBackgroundProps {
  brandingStyle: React.CSSProperties;
  overlayOpacity: number;
  children: React.ReactNode;
}

export const ShareBackground: React.FC<ShareBackgroundProps> = ({
  brandingStyle,
  overlayOpacity,
  children
}) => {
  return (
    <div className="fixed inset-0 pt-16" style={brandingStyle}>
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black"
        style={{ opacity: overlayOpacity }}
      />
      
      {/* Modal Container - Responsive with left alignment */}
      <div className="relative z-10 flex items-center justify-start min-h-full p-2 sm:p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full mx-2 sm:w-96 md:w-96 lg:w-80 max-h-[calc(90vh-4rem)] sm:max-h-[calc(600px-4rem)] min-h-[400px] flex flex-col overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
};
