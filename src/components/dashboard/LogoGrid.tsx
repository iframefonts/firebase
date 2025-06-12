
import React from 'react';
import { Logo } from '@/hooks/useLogos';
import LogoCard from '@/components/dashboard/LogoCard';

interface LogoGridProps {
  logos: Logo[];
  onShare: (logo: Logo) => void;
  onEdit: (logo: Logo) => void;
}

const LogoGrid: React.FC<LogoGridProps> = ({ logos, onShare, onEdit }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {logos.map((logo) => (
        <LogoCard 
          key={logo.id} 
          logo={logo} 
          onShare={onShare} 
          onEdit={onEdit} 
        />
      ))}
    </div>
  );
};

export default LogoGrid;
