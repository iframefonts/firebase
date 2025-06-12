
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Trash2, UserPlus, Calendar as CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { 
  useLogoInvitations, 
  useCreateInvitation, 
  useDeleteInvitation, 
  useUpdateInvitation,
  AccessLevel 
} from '@/hooks/useLogoInvitations';

interface InvitationDialogProps {
  logoId: string;
  children: React.ReactNode;
}

const InvitationDialog: React.FC<InvitationDialogProps> = ({ logoId, children }) => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [accessLevel, setAccessLevel] = useState<AccessLevel>('edit');
  const [expiresAt, setExpiresAt] = useState<Date | undefined>();

  const { data: invitations, isLoading } = useLogoInvitations(logoId);
  const createInvitation = useCreateInvitation();
  const deleteInvitation = useDeleteInvitation();
  const updateInvitation = useUpdateInvitation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      return;
    }

    await createInvitation.mutateAsync({
      logoId,
      email: email.trim(),
      accessLevel,
      expiresAt: expiresAt?.toISOString() || null
    });

    setEmail('');
    setExpiresAt(undefined);
  };

  const handleDeleteInvitation = (invitationId: string) => {
    if (confirm('Are you sure you want to revoke this invitation?')) {
      deleteInvitation.mutate(invitationId);
    }
  };

  const copyInviteLink = (inviteToken: string) => {
    const inviteUrl = `${window.location.origin}/access/${logoId}?invite=${inviteToken}`;
    navigator.clipboard.writeText(inviteUrl);
    toast.success('Invite link copied to clipboard');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Manage Access
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Invite New User Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                required
              />
            </div>

            <div>
              <Label>Expiration Date (Optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !expiresAt && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {expiresAt ? format(expiresAt, "PPP") : "No expiration"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={expiresAt}
                    onSelect={setExpiresAt}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                  {expiresAt && (
                    <div className="p-2 border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpiresAt(undefined)}
                        className="w-full"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Clear Date
                      </Button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={createInvitation.isPending || !email.trim()}
            >
              {createInvitation.isPending ? 'Sending...' : 'Send Invitation'}
            </Button>
          </form>

          {/* Current Invitations */}
          <div>
            <h4 className="font-medium text-sm mb-3">Current Access ({invitations?.length || 0})</h4>
            {isLoading ? (
              <div className="text-sm text-muted-foreground">Loading invitations...</div>
            ) : invitations && invitations.length > 0 ? (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {invitations.map((invitation) => (
                  <div key={invitation.id} className="flex items-center justify-between p-2 border rounded-md">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {invitation.invited_email}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {invitation.expires_at && (
                          <span className="text-xs text-muted-foreground">
                            Expires {format(new Date(invitation.expires_at), 'MMM d')}
                          </span>
                        )}
                      </div>
                      {invitation.invite_token && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyInviteLink(invitation.invite_token!)}
                          className="h-6 px-2 text-xs mt-1"
                        >
                          Copy Invite Link
                        </Button>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteInvitation(invitation.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground text-center py-4">
                No one has access to this logo yet
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvitationDialog;
