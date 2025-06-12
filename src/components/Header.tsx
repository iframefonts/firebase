import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import AuthDialog from './auth/AuthDialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { User, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { data: profile } = useProfile();
  const location = useLocation();

  console.log('Header - User:', user);
  console.log('Header - Current location:', location.pathname);

  const getDisplayName = () => {
    if (profile?.full_name) return profile.full_name;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      window.location.href = `/#${sectionId}`;
      return;
    }
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const handleProfileClick = () => {
    console.log('Profile link clicked');
  };

  const handleDashboardClick = () => {
    console.log('Dashboard link clicked');
  };

  const navigationItems = [
    { name: 'Features', action: () => scrollToSection('features') },
    { name: 'Pricing', action: () => scrollToSection('pricing') },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[9999] bg-transparent h-[60px]">
        <div className="w-full px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Logo with Beta */}
            <div className="flex-shrink-0 flex items-center space-x-2">
              <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                <h1 className="text-xl font-bold">
                  Logo<span className="font-normal">Drop</span>
                </h1>
                <span className="bg-muted px-2 py-1 rounded text-xs font-medium">
                  Beta v1.0
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            {!user && location.pathname === '/' && (
              <nav className="hidden md:flex space-x-8">
                {navigationItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={item.action}
                    className="text-muted-foreground hover:text-foreground px-3 py-2 text-sm font-medium transition-colors rounded-md hover:bg-accent"
                  >
                    {item.name}
                  </button>
                ))}
              </nav>
            )}

            {/* Authentication Section */}
            <div className="hidden md:flex items-center space-x-3">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2 px-3 py-2 h-auto">
                      <span className="text-sm font-medium">{getDisplayName()}</span>
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {profile?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" onClick={handleDashboardClick}>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/profile" onClick={handleProfileClick}>
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => signOut()}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-3">
                  <AuthDialog>
                    <Button variant="ghost">Log in</Button>
                  </AuthDialog>
                  <AuthDialog>
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Sign up</Button>
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
                className="hover:bg-accent"
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
          <div className="md:hidden absolute top-[60px] left-4 right-4 z-50 bg-card shadow-lg rounded-3xl border">
            <div className="px-4 pt-4 pb-4 space-y-1">
              {!user && location.pathname === '/' && navigationItems.map((item) => (
                <button
                  key={item.name}
                  onClick={item.action}
                  className="flex items-center w-full text-left text-card-foreground hover:text-foreground hover:bg-accent px-3 py-2 text-base font-medium transition-colors rounded-md"
                >
                  {item.name}
                </button>
              ))}
              
              {/* Mobile Authentication */}
              <div className="border-t border-border pt-3 mt-3">
                {user ? (
                  <div className="space-y-1">
                    <div className="flex items-center px-3 py-2">
                      <Avatar className="h-8 w-8 mr-3">
                        <AvatarFallback className="bg-muted text-muted-foreground text-sm">
                          {profile?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-card-foreground">
                        {getDisplayName()}
                      </span>
                    </div>
                    <Link
                      to="/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full text-left text-card-foreground hover:text-foreground hover:bg-accent px-3 py-2 text-base font-medium transition-colors rounded-md flex items-center"
                    >
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full text-left text-card-foreground hover:text-foreground hover:bg-accent px-3 py-2 text-base font-medium transition-colors rounded-md flex items-center"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-left text-card-foreground hover:text-foreground hover:bg-accent px-3 py-2 text-base font-medium transition-colors rounded-md flex items-center"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <AuthDialog>
                      <Button variant="ghost" className="w-full justify-start text-card-foreground hover:text-foreground hover:bg-accent">
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

export default Header;
