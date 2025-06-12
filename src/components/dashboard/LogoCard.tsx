
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Download, Eye, Trash2, Globe, Lock, Edit, UserPlus } from 'lucide-react';
import { Logo, useDeleteLogo } from '@/hooks/useLogos';
import { useUpdateLogoPrivacy } from '@/hooks/useUpdateLogoPrivacy';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import InvitationDialog from './InvitationDialog';

interface LogoCardProps {
  logo: Logo;
  onShare: (logo: Logo) => void;
  onEdit: (logo: Logo) => void;
}

const LogoCard: React.FC<LogoCardProps> = ({ logo, onShare, onEdit }) => {
  const deleteLogo = useDeleteLogo();
  const updatePrivacy = useUpdateLogoPrivacy();
  const navigate = useNavigate();
  
  const getLogoUrl = () => {
    const { data } = supabase.storage.from('logos').getPublicUrl(logo.file_path);
    return data.publicUrl;
  };

  const handleDownload = async () => {
    try {
      const { data, error } = await supabase.storage
        .from('logos')
        .download(logo.file_path);
      
      if (error) throw error;
      
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = logo.title;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Logo downloaded successfully');
    } catch (error) {
      toast.error('Failed to download logo');
    }
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this logo?')) {
      deleteLogo.mutate(logo);
    }
  };

  const handleLogoClick = () => {
    navigate(`/logo/${logo.id}`);
  };

  const handleViewClick = () => {
    navigate(`/logo/${logo.id}`);
  };

  const handleEditClick = () => {
    onEdit(logo);
  };

  const handlePrivacyToggle = (isPublic: boolean) => {
    updatePrivacy.mutate({ logoId: logo.id, isPublic });
  };

  return (
    <TooltipProvider>
      <Card className="group hover:shadow-lg transition-shadow">
        <CardContent className="p-4">
          <div 
            className="aspect-square bg-gray-50 rounded-lg mb-3 flex items-center justify-center overflow-hidden cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={handleLogoClick}
          >
            <img 
              src={getLogoUrl()} 
              alt={logo.title}
              className="max-w-full max-h-full object-contain"
            />
          </div>
          
          <div className="mb-3">
            <h3 
              className="font-semibold text-foreground truncate cursor-pointer hover:text-blue-600 transition-colors mb-1"
              onClick={handleLogoClick}
            >
              {logo.title || 'Untitled Logo'}
            </h3>
            
            {logo.client_name && (
              <p className="text-sm text-muted-foreground truncate">
                Client: {logo.client_name}
              </p>
            )}
            
            {/* Privacy Toggle */}
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center space-x-2">
                {logo.is_public ? (
                  <Globe className="h-3 w-3 text-blue-600" />
                ) : (
                  <Lock className="h-3 w-3 text-gray-500" />
                )}
                <span className="text-xs text-gray-600">
                  {logo.is_public ? 'Public' : 'Private'}
                </span>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Switch
                      checked={logo.is_public}
                      onCheckedChange={handlePrivacyToggle}
                      disabled={updatePrivacy.isPending}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{logo.is_public ? 'Make private' : 'Make public'}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          
          <div className="space-y-2 text-sm text-gray-600 mb-3">
            <div className="flex items-center justify-between">
              <span>{new Date(logo.created_at).toLocaleDateString()}</span>
              <div className="flex items-center space-x-2">
                {logo.is_public && <Badge variant="secondary">Public</Badge>}
                <div className="flex items-center text-xs">
                  <Eye className="h-3 w-3 mr-1" />
                  {logo.download_count}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between border-t pt-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleDownload}
                  className="flex-1 mr-1"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleViewClick}
                  className="flex-1 mx-1"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View Details</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleEditClick}
                  className="flex-1 mx-1"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit Logo</p>
              </TooltipContent>
            </Tooltip>

            {!logo.is_public && (
              <InvitationDialog logoId={logo.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="flex-1 mx-1"
                    >
                      <UserPlus className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Manage Access</p>
                  </TooltipContent>
                </Tooltip>
              </InvitationDialog>
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleDelete}
                  className="flex-1 ml-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default LogoCard;
