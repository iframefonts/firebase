import React, { useState } from 'react';
import { useProfile, useUpdateProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Upload, X, Eye } from 'lucide-react';
import { toast } from 'sonner';

const BrandingSettings = () => {
  const { data: profile } = useProfile();
  const updateProfile = useUpdateProfile();
  const [uploading, setUploading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${profile?.id}/background.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('branding-backgrounds')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('branding-backgrounds')
        .getPublicUrl(fileName);

      await updateProfile.mutateAsync({
        branding_background_url: data.publicUrl,
        branding_enabled: true,
      });

      toast.success('Branding background uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload background image');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveBackground = async () => {
    try {
      await updateProfile.mutateAsync({
        branding_background_url: null,
        branding_enabled: false,
      });
      toast.success('Branding background removed');
    } catch (error) {
      toast.error('Failed to remove background');
    }
  };

  const handleToggleBranding = async (enabled: boolean) => {
    try {
      await updateProfile.mutateAsync({
        branding_enabled: enabled,
      });
      toast.success(`Branding ${enabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
      toast.error('Failed to update branding settings');
    }
  };

  const handleOpacityChange = async (value: number[]) => {
    try {
      await updateProfile.mutateAsync({
        branding_overlay_opacity: value[0],
      });
    } catch (error) {
      toast.error('Failed to update overlay opacity');
    }
  };

  // Get current opacity value with updated default
  const currentOpacity = profile?.branding_overlay_opacity ?? 0.8;
  const opacityPercentage = Math.round(currentOpacity * 100);

  return (
    <Card>
      <CardHeader className="text-left">
        <CardTitle className="flex items-center justify-between text-left">
          Share Page Branding
          {profile?.branding_background_url && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreviewMode(!previewMode)}
            >
              <Eye className="h-4 w-4 mr-2" />
              {previewMode ? 'Hide Preview' : 'Preview'}
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 text-left">
        {/* Enable/Disable Branding */}
        <div className="flex items-center space-x-2">
          <Switch
            id="branding-enabled"
            checked={profile?.branding_enabled || false}
            onCheckedChange={handleToggleBranding}
            disabled={!profile?.branding_background_url}
          />
          <Label htmlFor="branding-enabled">Enable custom branding</Label>
        </div>

        {/* Background Image Upload */}
        <div className="space-y-4">
          <Label>Background Image</Label>
          
          {profile?.branding_background_url ? (
            <div className="space-y-4">
              <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={profile.branding_background_url}
                  alt="Branding background"
                  className="w-full h-full object-cover"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={handleRemoveBackground}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-left">
              <Upload className="h-8 w-8 mb-2 text-gray-400" />
              <p className="text-sm text-gray-600 mb-4">
                Upload a background image for your logo share pages
              </p>
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
                id="background-upload"
              />
              <Label
                htmlFor="background-upload"
                className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                {uploading ? 'Uploading...' : 'Choose File'}
              </Label>
            </div>
          )}
        </div>

        {/* Overlay Opacity */}
        {profile?.branding_background_url && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Overlay Opacity</Label>
              <span className="text-sm font-medium text-gray-600">{opacityPercentage}%</span>
            </div>
            <div className="px-2">
              <Slider
                value={[currentOpacity]}
                onValueChange={handleOpacityChange}
                max={1}
                min={0}
                step={0.1}
                className="w-full"
              />
            </div>
            <p className="text-xs text-gray-500">
              Controls the darkness of the overlay for better text readability
            </p>
          </div>
        )}

        {/* Preview */}
        {previewMode && profile?.branding_background_url && (
          <div className="space-y-2">
            <Label>Preview</Label>
            <div 
              className="relative w-full h-48 rounded-lg overflow-hidden border"
              style={{
                backgroundImage: `url(${profile.branding_background_url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div 
                className="absolute inset-0 bg-black"
                style={{ opacity: currentOpacity }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white rounded-lg p-4 shadow-lg max-w-sm">
                  <div className="text-left">
                    <div className="w-16 h-16 bg-gray-200 rounded mb-2"></div>
                    <h3 className="font-semibold">Logo Preview</h3>
                    <p className="text-xs text-gray-600">This is how your share page will look</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <p className="text-xs text-gray-500">
          Add a custom background image to brand your logo share pages. 
          Recommended size: 1920x1080px or larger. Max file size: 5MB.
        </p>
      </CardContent>
    </Card>
  );
};

export default BrandingSettings;
