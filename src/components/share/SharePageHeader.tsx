
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, User } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import AuthDialog from '@/components/auth/AuthDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const SharePageHeader: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { data: profile } = useProfile();

  const navigationItems = [
    { name: 'Features', path: '#features' },
    { name: 'Pricing', path: '#pricing' },
  ];

  const handleNavigation = (path: string) => {
    if (path.startsWith('#')) {
      // Handle anchor links for Features and Pricing
      console.log('Navigate to:', path);
    } else {
      navigate(path);
    }
    setIsMobileMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getUserDisplayName = () => {
    return profile?.full_name || user?.email || 'User';
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[9999] bg-transparent h-[60px]">
        <div className="w-full px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Logo with Beta - Now clickable */}
            <div className="flex-shrink-0 flex items-center space-x-2">
              <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                <h1 className="text-xl font-bold text-white">LogoDrop</h1>
                <span className="bg-white/20 text-white px-2 py-1 rounded text-xs font-medium">
                  Beta v1.0
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigationItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.path)}
                  className="text-white/80 hover:text-white px-3 py-2 text-sm font-medium transition-colors rounded-md hover:bg-white/10"
                >
                  {item.name}
                </button>
              ))}
            </nav>

            {/* Authentication Section */}
            <div className="hidden md:flex items-center space-x-3">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2 hover:bg-white/10 text-white">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-white/20 text-white text-sm">
                          {getInitials(getUserDisplayName())}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-white">
                        {getUserDisplayName()}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut}>
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-3">
                  <AuthDialog>
                    <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10">
                      Log in
                    </Button>
                  </AuthDialog>
                  <AuthDialog>
                    <Button className="bg-white text-gray-900 hover:bg-white/90">
                      Sign up
                    </Button>
                  </AuthDialog>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="hover:bg-white/10 text-white"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-[60px] left-4 right-4 z-50 bg-white shadow-lg rounded-3xl">
            <div className="px-4 pt-4 pb-4 space-y-1">
              {navigationItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.path)}
                  className="flex items-center w-full text-left text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 text-base font-medium transition-colors rounded-md"
                >
                  {item.name}
                </button>
              ))}
              
              {/* Mobile Authentication */}
              <div className="border-t border-gray-200 pt-3 mt-3">
                {user ? (
                  <div className="space-y-1">
                    <div className="flex items-center px-3 py-2">
                      <Avatar className="h-8 w-8 mr-3">
                        <AvatarFallback className="bg-gray-200 text-gray-700 text-sm">
                          {getInitials(getUserDisplayName())}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-gray-900">
                        {getUserDisplayName()}
                      </span>
                    </div>
                    <button
                      onClick={() => navigate('/dashboard')}
                      className="w-full text-left text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 text-base font-medium transition-colors rounded-md"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => navigate('/profile')}
                      className="w-full text-left text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 text-base font-medium transition-colors rounded-md"
                    >
                      Profile
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 text-base font-medium transition-colors rounded-md"
                    >
                      Sign out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <AuthDialog>
                      <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-gray-900 hover:bg-gray-100">
                        Log in
                      </Button>
                    </AuthDialog>
                    <AuthDialog>
                      <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                        Sign up
                      </Button>
                    </AuthDialog>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
