
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useAuth } from '@/contexts/AuthContext';

const UploadBreadcrumb = () => {
  const { user } = useAuth();
  
  return (
    <div className="text-left">
      <Breadcrumb className="mb-6">
        <BreadcrumbList className="text-xs font-normal gap-1 justify-start">
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to={user ? "/dashboard" : "/"} className="text-xs font-normal">
                {user ? "Dashboard" : "Home"}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="mx-1" />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-xs font-normal">
              Upload Logo
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default UploadBreadcrumb;
