
import React from 'react';
import { Logo } from '@/hooks/useLogos';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import LogoListItem from './LogoListItem';

interface LogoListViewProps {
  logos: Logo[];
  onShare: (logo: Logo) => void;
  onEdit: (logo: Logo) => void;
  sortField: 'client_name' | 'created_at' | 'title' | null;
  sortDirection: 'asc' | 'desc';
  onSort: (field: 'client_name' | 'created_at' | 'title') => void;
}

const LogoListView = ({ 
  logos, 
  onShare, 
  onEdit, 
  sortField, 
  sortDirection, 
  onSort 
}: LogoListViewProps) => {
  const getSortIcon = (field: 'client_name' | 'created_at' | 'title') => {
    if (sortField !== field) return <ChevronDown className="h-4 w-4 opacity-30" />;
    return sortDirection === 'asc' ? 
      <ChevronUp className="h-4 w-4" /> : 
      <ChevronDown className="h-4 w-4" />;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16 text-left">Logo</TableHead>
            <TableHead className="text-left">
              <Button 
                variant="ghost" 
                className="p-0 h-auto font-medium hover:bg-transparent text-left justify-start"
                onClick={() => onSort('title')}
              >
                Logo Name
                {getSortIcon('title')}
              </Button>
            </TableHead>
            <TableHead className="text-left">
              <Button 
                variant="ghost" 
                className="p-0 h-auto font-medium hover:bg-transparent text-left justify-start"
                onClick={() => onSort('client_name')}
              >
                Client Name
                {getSortIcon('client_name')}
              </Button>
            </TableHead>
            <TableHead className="text-left">
              <Button 
                variant="ghost" 
                className="p-0 h-auto font-medium hover:bg-transparent text-left justify-start"
                onClick={() => onSort('created_at')}
              >
                Date
                {getSortIcon('created_at')}
              </Button>
            </TableHead>
            <TableHead className="text-left">Status</TableHead>
            <TableHead className="w-32 text-left">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logos.length > 0 ? (
            logos.map((logo) => (
              <LogoListItem 
                key={logo.id} 
                logo={logo} 
                onShare={onShare}
                onEdit={onEdit}
              />
            ))
          ) : (
            <TableRow>
              <td colSpan={6} className="text-left py-6 text-gray-500">
                No logos to display
              </td>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default LogoListView;
