
import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLogoById } from '@/hooks/useLogoById';
import { useLogoByInviteToken } from '@/hooks/useLogoByInviteToken';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Lock, Key, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import Header from '@/components/Header';

const LogoAccess = () => {
  const { logoId } = useParams<{ logoId: string }>();
  const { user } = useAuth();
  const [inviteCode, setInviteCode] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);

  // Try to get logo by ID first (for owned logos or public logos)
  const { data: ownedLogo, isLoading: isLoadingOwned, error: ownedError } = useLogoById(logoId || '');
  
  // Try to get logo by invite token
  const { data: invitedLogo, isLoading: isLoadingInvited, refetch: refetchInvited } = useLogoByInviteToken(inviteCode);

  useEffect(() => {
    if (!logoId) return;

    // Check if user owns the logo or it's public
    if (ownedLogo) {
      if (ownedLogo.user_id === user?.id || ownedLogo.is_public) {
        setAccessGranted(true);
        return;
      }
    }

    // If not owned/public and no access granted, show invite modal
    if (!accessGranted && !isLoadingOwned && ownedError) {
      setShowInviteModal(true);
    }
  }, [ownedLogo, user?.id, ownedError, isLoadingOwned, accessGranted, logoId]);

  const handleInviteCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inviteCode.trim()) {
      toast.error('Please enter an invite code');
      return;
    }

    try {
      const result = await refetchInvited();
      if (result.data) {
        setAccessGranted(true);
        setShowInviteModal(false);
        toast.success('Access granted! Redirecting to logo...');
        // Store the invite code in session storage for this logo
        sessionStorage.setItem(`invite_access_${logoId}`, inviteCode);
      } else {
        toast.error('Invalid invite code or access expired');
      }
    } catch (error) {
      toast.error('Invalid invite code or access expired');
    }
  };

  // Check for stored invite code on mount
  useEffect(() => {
    if (logoId && !accessGranted) {
      const storedInviteCode = sessionStorage.getItem(`invite_access_${logoId}`);
      if (storedInviteCode) {
        setInviteCode(storedInviteCode);
      }
    }
  }, [logoId, accessGranted]);

  if (!logoId) {
    return <Navigate to="/dashboard" replace />;
  }

  if (isLoadingOwned || isLoadingInvited) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If access is granted, redirect to the actual logo preview
  if (accessGranted && (ownedLogo || invitedLogo)) {
    const logo = ownedLogo || invitedLogo;
    if (logo) {
      return <Navigate to={`/logo/${logoId}`} replace />;
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="p-6 text-center">
              <Lock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h1 className="text-2xl font-bold mb-2">Private Logo</h1>
              <p className="text-muted-foreground mb-6">
                This logo is private. You need an invite code to access it.
              </p>
              <Button onClick={() => setShowInviteModal(true)} className="w-full">
                <Key className="h-4 w-4 mr-2" />
                Enter Invite Code
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showInviteModal} onOpenChange={setShowInviteModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Enter Invite Code
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleInviteCodeSubmit} className="space-y-4">
            <div>
              <Label htmlFor="inviteCode">Invite Code</Label>
              <Input
                id="inviteCode"
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                placeholder="Enter your invite code"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                This code was provided by the logo owner
              </p>
            </div>

            <div className="flex items-start space-x-2 p-3 bg-blue-50 rounded-md border border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-blue-700">
                <p className="font-medium mb-1">Need an invite code?</p>
                <p>Ask the logo owner to send you an invitation link or provide you with an invite code.</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setShowInviteModal(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Access Logo
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LogoAccess;
