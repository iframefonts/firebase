import React, { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLogos } from '@/hooks/useLogos';
import { useProfile } from '@/hooks/useProfile';
import { toast } from 'sonner';
import { Navigate, useNavigate } from 'react-router-dom';
import { Logo } from '@/hooks/useLogos';
import Header from '@/components/Header';
import LogoGrid from '@/components/dashboard/LogoGrid';
import LogoListView from '@/components/dashboard/LogoListView';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import EmptyState from '@/components/dashboard/EmptyState';
import { 
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';

type ViewMode = 'grid' | 'list';
type SortField = 'client_name' | 'created_at' | 'title' | null;
type SortDirection = 'asc' | 'desc';

const ITEMS_PER_PAGE = 16;

const Dashboard: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { data: logos, isLoading: logosLoading } = useLogos();
  const { data: profile } = useProfile();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Filter and sort logos
  const filteredAndSortedLogos = useMemo(() => {
    if (!logos) return [];
    
    // Filter by search query
    let filtered = logos.filter(logo => {
      const clientName = logo.client_name?.toLowerCase() || '';
      const title = logo.title?.toLowerCase() || '';
      const query = searchQuery.toLowerCase();
      return clientName.includes(query) || title.includes(query);
    });
    
    // Sort by selected field
    if (sortField) {
      filtered.sort((a, b) => {
        let aValue, bValue;
        
        if (sortField === 'client_name') {
          aValue = a.client_name?.toLowerCase() || '';
          bValue = b.client_name?.toLowerCase() || '';
        } else if (sortField === 'title') {
          aValue = a.title?.toLowerCase() || '';
          bValue = b.title?.toLowerCase() || '';
        } else if (sortField === 'created_at') {
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
        }
        
        if (sortDirection === 'asc') {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
      });
    }
    
    return filtered;
  }, [logos, searchQuery, sortField, sortDirection]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredAndSortedLogos.length / ITEMS_PER_PAGE);
  
  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Get current page data
  const currentLogos = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredAndSortedLogos.length);
    return filteredAndSortedLogos.slice(startIndex, endIndex);
  }, [filteredAndSortedLogos, currentPage]);

  // Handle pagination
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo(0, 0);
    }
  };
  
  const handleSort = (field: 'client_name' | 'created_at' | 'title') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getShareUrl = (logo: Logo) => {
    if (logo.is_public && logo.share_token) {
      return `${window.location.origin}/share/${logo.share_token}`;
    }
    return `${window.location.origin}/logo/${logo.id}`;
  };

  const handleShare = (logo: Logo) => {
    const shareUrl = getShareUrl(logo);
    navigator.clipboard.writeText(shareUrl);
    
    if (logo.is_public) {
      toast.success('Public share link copied to clipboard!');
    } else {
      toast.success('Private link copied to clipboard!', {
        description: 'Note: Viewers will need to be logged in to access this logo.'
      });
    }
  };

  const handleEditLogo = (logo: Logo) => {
    console.log('Navigation to edit logo triggered for:', logo.id);
    navigate(`/edit/${logo.id}`);
  };

  // Calculate pagination display information
  const startItem = filteredAndSortedLogos.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, filteredAndSortedLogos.length);

  // Generate pagination items
  const renderPaginationItems = () => {
    const items = [];
    
    // First page is always shown
    items.push(
      <PaginationItem key="page-1">
        <PaginationLink 
          onClick={() => handlePageChange(1)} 
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    // If there are more than 5 pages, we need ellipsis
    if (totalPages > 5) {
      // Beginning ellipsis
      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis-1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Pages around current page
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        if (i !== 1 && i !== totalPages) {
          items.push(
            <PaginationItem key={`page-${i}`}>
              <PaginationLink 
                onClick={() => handlePageChange(i)} 
                isActive={currentPage === i}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      }

      // Ending ellipsis
      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis-2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    } else {
      // If 5 or fewer pages, just show all page numbers
      for (let i = 2; i < totalPages; i++) {
        items.push(
          <PaginationItem key={`page-${i}`}>
            <PaginationLink 
              onClick={() => handlePageChange(i)} 
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    // Last page (if more than 1 page)
    if (totalPages > 1) {
      items.push(
        <PaginationItem key={`page-${totalPages}`}>
          <PaginationLink 
            onClick={() => handlePageChange(totalPages)} 
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  // Render loading skeletons
  if (logosLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <DashboardHeader 
            subscriptionStatus={profile?.subscription_status}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            totalLogos={0}
            filteredLogos={0}
            currentPage={0}
            totalPages={0}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 animate-pulse rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <DashboardHeader 
            subscriptionStatus={profile?.subscription_status}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            totalLogos={logos?.length || 0}
            filteredLogos={filteredAndSortedLogos.length}
            currentPage={currentPage}
            totalPages={totalPages}
            startItem={startItem}
            endItem={endItem}
          />
        </div>

        {logos && logos.length > 0 ? (
          filteredAndSortedLogos.length > 0 ? (
            <>
              {viewMode === 'grid' ? (
                <LogoGrid logos={currentLogos} onShare={handleShare} onEdit={handleEditLogo} />
              ) : (
                <LogoListView 
                  logos={currentLogos} 
                  onShare={handleShare} 
                  onEdit={handleEditLogo}
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                />
              )}
              
              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination className="mt-8">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => handlePageChange(currentPage - 1)}
                        className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                    
                    {renderPaginationItems()}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => handlePageChange(currentPage + 1)}
                        className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          ) : (
            <div className="text-left py-12">
              <p className="text-gray-600 mb-4">No logos match your search criteria</p>
              <p className="text-sm text-gray-500">Try adjusting your search terms</p>
            </div>
          )
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
