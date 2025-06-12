import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Crown, Grid3X3, List, Search } from 'lucide-react';

interface DashboardHeaderProps {
  subscriptionStatus?: string;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalLogos: number;
  filteredLogos: number;
  currentPage?: number;
  totalPages?: number;
  startItem?: number;
  endItem?: number;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  subscriptionStatus, 
  viewMode,
  onViewModeChange,
  searchQuery,
  onSearchChange,
  totalLogos,
  filteredLogos,
  startItem = 0,
  endItem = 0
}) => {
  const navigate = useNavigate();

  const handleUploadNewLogo = () => {
    console.log('Navigation to /upload triggered');
    navigate('/upload');
  };

  return (
    <div className="space-y-6">
      {/* Main Header */}
      <div className="flex items-center justify-between">
        <div className="text-left">
          <h1 className="text-2xl font-medium text-left">Dashboard</h1>
          <p className="text-xs font-normal text-gray-600 text-left">Manage and share your brand assets</p>
        </div>
        <div className="flex items-center space-x-4">
          {subscriptionStatus === 'pro' && (
            <Badge variant="default">
              <Crown className="h-3 w-3 mr-1" />
              Pro
            </Badge>
          )}
          
          <Button 
            onClick={handleUploadNewLogo}
            className="bg-black text-white hover:bg-gray-800 text-sm font-medium rounded-[300px]"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Logo
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search logo or Client name"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Results Counter */}
          <span className="text-sm text-gray-600">
            {filteredLogos > 0 ? (
              startItem === endItem ? 
              `${startItem} of ${filteredLogos} logos` : 
              `${startItem}-${endItem} of ${filteredLogos} logos`
            ) : (
              `${filteredLogos} logos`
            )}
          </span>
          
          {/* View Toggle */}
          <div className="flex items-center border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('grid')}
              className="rounded-r-none"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('list')}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
