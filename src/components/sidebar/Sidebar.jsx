"use client";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "../ui/theme-toggle";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

export default function SidebarPage({ children }) {
  const pathname = usePathname();

  const breadcrumbItems = useMemo(() => {
    const pathSegments = pathname.split('/').filter(Boolean);
    
    // Route mappings for better display names
    const routeNames = {
      'dashboard': 'Dashboard',
      'overview': 'Overview',
      'analytics': 'Analytics',
      'reports': 'Reports',
      'inventory': 'Inventory Management',
      'items': 'All Items',
      'categories': 'Categories',
      'stock': 'Stock Levels',
      'suppliers': 'Suppliers',
      'deadstock': 'Deadstock Tracking',
      'expired': 'Expired Items',
      'obsolete': 'Obsolete Equipment',
      'damaged': 'Damaged Goods',
      'writeoffs': 'Write-offs',
      'admin': 'Administration',
      'users': 'User Management',
      'departments': 'Departments',
      'permissions': 'Permissions',
      'settings': 'System Settings',
      'projects': 'Projects',
      'disposal': 'Asset Disposal',
      'cost-analysis': 'Cost Analysis',
      'audit': 'Audit Trail'
    };

    const breadcrumbs = [];
    let currentPath = '';

    // Add Home/Dashboard as the first breadcrumb
    if (pathSegments.length > 0) {
      breadcrumbs.push({
        name: 'Dashboard',
        href: '/dashboard',
        isLast: false
      });
    }

    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;
      
      // Skip dashboard in the loop since we already added it
      if (segment === 'dashboard' && index === 0) return;
      
      breadcrumbs.push({
        name: routeNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
        href: currentPath,
        isLast
      });
    });

    return breadcrumbs;
  }, [pathname]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b">
          <div className="flex items-center gap-2 px-4 w-full">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <div className="flex items-center justify-between w-full">
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbItems.length === 0 ? (
                    <BreadcrumbItem>
                      <BreadcrumbPage>Home</BreadcrumbPage>
                    </BreadcrumbItem>
                  ) : (
                    breadcrumbItems.map((item, index) => (
                      <div key={item.href} className="flex items-center">
                        <BreadcrumbItem>
                          {item.isLast ? (
                            <BreadcrumbPage>{item.name}</BreadcrumbPage>
                          ) : (
                            <BreadcrumbLink href={item.href}>
                              {item.name}
                            </BreadcrumbLink>
                          )}
                        </BreadcrumbItem>
                        {!item.isLast && (
                          <BreadcrumbSeparator />
                        )}
                      </div>
                    ))
                  )}
                </BreadcrumbList>
              </Breadcrumb>

              <ThemeToggle />
            </div>
          </div>
        </header>
        <div className="p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}