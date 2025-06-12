import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLogoById } from '@/hooks/useLogoById';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { PreviewLogoInfo } from '@/components/preview/PreviewLogoInfo';
import { 
  Share2, 
  Copy, 
  Mail, 
  QrCode,
  ArrowLeft,
  Globe,
  Lock,
  Download
} from 'lucide-react';
import { toast } from 'sonner';
import { getExportOptions } from '@/utils/exports/export-options';
import { createAndDownloadZip } from '@/utils/exports/zip-utils';
import QRCode from 'qrcode';

const LogoPreview = () => {
  const { logoId } = useParams<{ logoId: string }>();
  const { user } = useAuth();
  const { data: logo, isLoading, error } = useLogoById(logoId || '');
  const { data: profile } = useProfile();
  const [shareEmail, setShareEmail] = useState('');
  const [shareMessage, setShareMessage] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  // Generate QR code when component mounts or share URL changes
  useEffect(() => {
    const generateQRCode = async () => {
      if (!logo) return;
      
      try {
        const getShareUrl = () => {
          if (logo.is_public && logo.share_token) {
            return `${window.location.origin}/share/${logo.share_token}`;
          }
          return window.location.href;
        };

        const shareUrl = getShareUrl();
        const qrDataUrl = await QRCode.toDataURL(shareUrl, {
          width: 200,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#ffffff'
          }
        });
        setQrCodeDataUrl(qrDataUrl);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };

    generateQRCode();
  }, [logo]);

  // Now handle conditional rendering after all hooks
  if (!logoId) {
    return <Navigate to="/dashboard" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !logo) {
    return <Navigate to="/dashboard" replace />;
  }

  // Check access permissions
  const hasAccess = () => {
    // Owner always has access
    if (logo.user_id === user?.id) return true;
    
    // Public logos are accessible to everyone
    if (logo.is_public) return true;
    
    // Check for invite-based access
    const inviteCode = sessionStorage.getItem(`invite_access_${logoId}`);
    if (inviteCode) return true;
    
    // Check if user has invitation access (from useLogos hook)
    if ((logo as any).invited_access_level) return true;
    
    return false;
  };

  // Redirect to access page if no permission
  if (!hasAccess()) {
    return <Navigate to={`/access/${logoId}`} replace />;
  }

  const getLogoUrl = () => {
    const { data } = supabase.storage.from('logos').getPublicUrl(logo.file_path);
    return data.publicUrl;
  };

  const getShareUrl = () => {
    // Always use the share token if it exists and logo is public
    // This ensures consistent URLs even when privacy is toggled
    if (logo.share_token && logo.is_public) {
      return `${window.location.origin}/share/${logo.share_token}`;
    }
    // Fallback to current URL for private logos or logos without share tokens
    return window.location.href;
  };

  const handleDownloadAll = async () => {
    try {
      setIsExporting(true);
      setExportProgress(0);

      // Download the logo file from Supabase storage
      const { data, error } = await supabase.storage
        .from('logos')
        .download(logo.file_path);
      
      if (error) throw error;
      
      // Convert blob to File object with proper name and type
      const logoFile = new File([data], logo.title, { type: logo.file_type });
      
      // Get all export options
      const exportOptions = getExportOptions();
      const allOptionNames = exportOptions.map(option => option.name);
      
      // Create and download zip with all export formats
      await createAndDownloadZip(
        logoFile, 
        allOptionNames,
        setIsExporting,
        setExportProgress
      );
      
      toast.success('All export files downloaded successfully');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download files');
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const handleCopyLink = () => {
    const url = getShareUrl();
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard');
  };

  const handleShareEmail = () => {
    if (!shareEmail) {
      toast.error('Please enter an email address');
      return;
    }
    
    const subject = `Check out this logo: ${logo.title}`;
    const body = `${shareMessage}\n\nView the logo here: ${getShareUrl()}`;
    const mailtoUrl = `mailto:${shareEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    window.open(mailtoUrl);
    toast.success('Opening email client...');
  };

  const handleDownloadQRCode = () => {
    if (!qrCodeDataUrl) {
      toast.error('QR code not ready');
      return;
    }

    // Create a download link for the QR code
    const link = document.createElement('a');
    link.href = qrCodeDataUrl;
    link.download = `${logo.title}-qr-code.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('QR code downloaded');
  };

  const getDesignerName = () => {
    return profile?.full_name || user?.email || 'Unknown Designer';
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 py-4 flex-1">
        <div className="mb-4 text-left">
          <Button variant="ghost" onClick={() => window.history.back()} className="text-xs font-normal hover:bg-gray-100">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Logo Display */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold">{logo.title}</h1>
                <div className="flex items-center space-x-2">
                  {logo.is_public ? (
                    <Badge variant="secondary" className="flex items-center">
                      <Globe className="h-3 w-3 mr-1" />
                      Public
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="flex items-center">
                      <Lock className="h-3 w-3 mr-1" />
                      Private
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="aspect-[4/3] bg-gray-50 rounded-lg flex items-center justify-center mb-6">
              <img 
                src={getLogoUrl()} 
                alt={logo.title}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* Logo Information Below Image */}
            <PreviewLogoInfo logo={logo} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Download Section */}
            <Card className="shadow-none">
              <CardContent className="p-6">
                {isExporting && (
                  <div className="mb-4">
                    <Progress value={exportProgress} className="h-2" />
                    <p className="text-xs text-center mt-1 text-gray-500">Exporting... {exportProgress}%</p>
                  </div>
                )}
                <Button 
                  onClick={handleDownloadAll} 
                  className="w-full mb-4 h-12 text-base font-medium text-white bg-gradient-to-r from-purple-500 to-purple-600 rounded-full hover:from-purple-600 hover:to-purple-700 transition-all duration-200" 
                  size="lg"
                  disabled={isExporting}
                >
                  {isExporting ? "Exporting..." : "Get your logo"}
                </Button>
                <p className="text-xs text-gray-500 text-center">
                  Complete export package with print, social media, and website formats
                </p>
              </CardContent>
            </Card>

            {/* Share Section */}
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Share2 className="h-5 w-5 mr-2" />
                  Share This Logo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Share Link Display */}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <label className="text-xs font-medium mb-2 block">Public Share Link</label>
                  <div className="flex gap-2">
                    <Input
                      value={getShareUrl()}
                      readOnly
                      className="flex-1 bg-white text-xs"
                    />
                    <Button onClick={handleCopyLink} variant="outline" size="sm">
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  {logo.is_public ? (
                    <p className="text-xs text-gray-500 mt-2">
                      ✓ Public link - no login required
                    </p>
                  ) : (
                    <p className="text-xs text-orange-600 mt-2">
                      ⚠ Private logo - viewers need access
                    </p>
                  )}
                  {/* Show URL consistency message */}
                  {logo.share_token && (
                    <p className="text-xs text-gray-500 mt-1">
                      💡 This URL stays the same even when you change privacy settings
                    </p>
                  )}
                </div>

                {/* Email Invite */}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <label className="text-xs font-medium mb-2 block">Send Email Invite</label>
                  <div className="space-y-2">
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      value={shareEmail}
                      onChange={(e) => setShareEmail(e.target.value)}
                      className="text-xs"
                    />
                    <Textarea
                      placeholder="Add a personal message (optional)"
                      value={shareMessage}
                      onChange={(e) => setShareMessage(e.target.value)}
                      rows={2}
                      className="text-xs"
                    />
                    <Button onClick={handleShareEmail} className="w-full" variant="outline" size="sm">
                      <Mail className="h-3 w-3 mr-2" />
                      Send Email Invite
                    </Button>
                  </div>
                </div>

                {/* QR Code */}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <label className="text-xs font-medium mb-2 block">QR Code</label>
                  <div className="flex flex-col items-center space-y-2">
                    {qrCodeDataUrl ? (
                      <img 
                        src={qrCodeDataUrl} 
                        alt="QR Code for sharing logo" 
                        className="w-24 h-24 border rounded bg-white"
                      />
                    ) : (
                      <div className="w-24 h-24 border rounded flex items-center justify-center bg-white">
                        <QrCode className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                    <Button onClick={handleDownloadQRCode} variant="outline" disabled={!qrCodeDataUrl} size="sm">
                      <Download className="h-3 w-3 mr-1" />
                      Download QR
                    </Button>
                    <p className="text-xs text-gray-500 text-center">
                      {logo.is_public 
                        ? 'Scan to open the public logo link' 
                        : 'Scan to open logo - viewers need access'
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Credits */}
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle className="text-sm">Credits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="text-xs text-gray-600">
                    Design by: {getDesignerName()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default LogoPreview;
