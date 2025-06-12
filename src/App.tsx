
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { UploadProvider } from '@/contexts/UploadContext';
import Index from '@/pages/Index';
import Upload from '@/pages/Upload';
import Dashboard from '@/pages/Dashboard';
import LogoPreview from '@/pages/LogoPreview';
import LogoAccess from '@/pages/LogoAccess';
import LogoShare from '@/pages/LogoShare';
import Profile from '@/pages/Profile';
import NotFound from '@/pages/NotFound';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <UploadProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/edit/:logoId" element={<Upload />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/logo/:logoId" element={<LogoPreview />} />
                <Route path="/access/:logoId" element={<LogoAccess />} />
                <Route path="/share/:shareToken" element={<LogoShare />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </div>
          </Router>
        </UploadProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
