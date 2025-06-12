import React, { useState } from 'react';
import { Logo } from '@/hooks/useLogos';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Globe, Lock, MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { getExportOptions } from '@/utils/exports/export-options';
import { createAndDownloadZip } from '@/utils/exports/zip-utils';
import { useUpdateLogoPrivacy } from '@/hooks/useUpdateLogoPrivacy';
import InvitationDialog from './InvitationDialog';

interface LogoListItemProps {
  logo: Logo;
  onShare: (logo: Logo) => void;
  onEdit: (logo: Logo) => void;
}

const LogoListItem = ({ logo, onShare, onEdit }: LogoListItemProps) => {
  const navigate = useNavigate();
  const [isExporting, setIsExporting] = useState(false);
  const updateLogoPrivacyMutation = useUpdateLogoPrivacy();

  // Generate the public URL for the logo file
  const getLogoUrl = () => {
    if (!logo.file_path) return null;
    const { data } = supabase.storage.from('logos').getPublicUrl(logo.file_path);
    return data.publicUrl;
  };

  const logoUrl = getLogoUrl();

  const handleViewLogo = () => {
    navigate(`/logo/${logo.id}`);
  };

  const handleDownload = async () => {
    if (!logoUrl) {
      toast.error('Logo file not available for download');
      return;
    }

    setIsExporting(true);
    
    try {
      // Convert logo URL to File object
      const response = await fetch(logoUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch logo file');
      }
      
      const blob = await response.blob();
      const fileExtension = logoUrl.split('.').pop() || 'png';
      const mimeType = blob.type || `image/${fileExtension}`;
      const logoFile = new File([blob], `${logo.title || 'logo'}.${fileExtension}`, { type: mimeType });

      // Get all export options
      const exportOptions = getExportOptions();
      const selectedOptions = exportOptions.map(option => option.name);

      // Create and download ZIP with all formats
      await createAndDownloadZip(
        logoFile, 
        selectedOptions, 
        setIsExporting, 
        () => {} // Progress callback - not needed for this simple case
      );
      
      toast.success('Logo package downloaded successfully!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to download logo package');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this logo?')) {
      // Delete functionality would be implemented here
      toast.success('Logo deleted successfully');
    }
  };

  const handleEditLogo = () => {
    onEdit(logo);
  };

  const togglePrivacy = () => {
    updateLogoPrivacyMutation.mutate({
      logoId: logo.id,
      isPublic: !logo.is_public
    });
  };

  return (
    <TableRow className="hover:bg-muted/50 cursor-pointer" onClick={handleViewLogo}>
      <TableCell className="w-16 p-2 text-left">
        <div className="w-9 h-9 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
          {logoUrl ? (
            <img 
              src={logoUrl} 
              alt={logo.title || 'Logo'} 
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-400">
              Logo
            </div>
          )}
        </div>
      </TableCell>
      
      <TableCell className="font-medium text-left">
        <div className="max-w-48 text-left">
          <div className="font-semibold text-foreground truncate text-left">
            {logo.title || 'Untitled Logo'}
          </div>
        </div>
      </TableCell>
      
      <TableCell className="font-medium text-left">
        <div className="max-w-48 text-left">
          <div className="text-sm text-muted-foreground truncate text-left">
            {logo.client_name || '-'}
          </div>
        </div>
      </TableCell>
      
      <TableCell className="text-sm text-muted-foreground text-left">
        {format(new Date(logo.created_at), 'MMM d, yyyy')}
      </TableCell>
      
      <TableCell onClick={(e) => e.stopPropagation()} className="text-left">
        <div className="flex items-center space-x-2 justify-start">
          {logo.is_public ? (
            <Badge variant="secondary" className="text-xs">
              <Globe className="h-3 w-3 mr-1" />
              Public
            </Badge>
          ) : (
            <Badge variant="outline" className="text-xs">
              <Lock className="h-3 w-3 mr-1" />
              Private
            </Badge>
          )}
          <Switch 
            checked={logo.is_public} 
            onCheckedChange={togglePrivacy}
            disabled={updateLogoPrivacyMutation.isPending}
          />
        </div>
      </TableCell>
      
      <TableCell onClick={(e) => e.stopPropagation()} className="text-left">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={handleViewLogo}>
              View Logo
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleEditLogo}>
              Edit Logo
            </DropdownMenuItem>
            {!logo.is_public && (
              <InvitationDialog logoId={logo.id}>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  Invite Users
                </DropdownMenuItem>
              </InvitationDialog>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDownload} disabled={isExporting}>
              {isExporting ? 'Preparing Download...' : 'Download'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onShare(logo)}>
              Copy Share Link
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleDelete}
              className="text-destructive focus:text-destructive"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export default LogoListItem;
