
import React from "react";
import { Navbar } from "@/components/Navbar";
import { TunisiaFooter } from "@/components/TunisiaFooter";
import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";
import { Home, BookOpen, MapPin, MessageSquare, Search, BarChart2, LogOut, User } from "lucide-react";
import { Link, useLocation } from 'react-router-dom';
import ErrorBoundary from "@/components/ErrorBoundary";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const { user, signOut } = useAuth();
  
  const navItems = [
    { icon: <Home size={18} />, label: "Dashboard", href: "/admin", active: location.pathname === "/admin" },
    { icon: <BookOpen size={18} />, label: "Blog", href: "/admin/blog", active: location.pathname === "/admin/blog" },
    { icon: <MapPin size={18} />, label: "Trips", href: "/admin/trip", active: location.pathname === "/admin/trip" },
    { icon: <MessageSquare size={18} />, label: "Contacts", href: "/admin/contacts", active: location.pathname === "/admin/contacts" },
    { icon: <Search size={18} />, label: "SEO", href: "/admin/seo", active: location.pathname === "/admin/seo" },
  ];
  
  const userInitials = user?.email 
    ? user.email.substring(0, 2).toUpperCase() 
    : "AD";
  
  return (
    <div className="flex min-h-screen flex-col bg-[#F9FAFC]">
      <ErrorBoundary>
        <Navbar />
        
        <div className="flex flex-1 pt-16">
          {/* Admin Sidebar with SidebarProvider */}
          <SidebarProvider defaultExpanded={true}>
            <Sidebar className="w-64 border-r border-gray-200 bg-white py-8 hidden md:block">
              <div className="px-6 mb-8">
                <h2 className="text-lg font-semibold text-[#1F1F20] flex items-center gap-2">
                  <BarChart2 size={20} className="text-[#347EFF]" />
                  Admin Panel
                </h2>
              </div>
              
              <div className="px-6 mb-6">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-admin-primary text-white">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="overflow-hidden">
                    <p className="text-sm font-medium truncate">{user?.email}</p>
                    <p className="text-xs text-gray-500">Admin</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={signOut}
                  className="mt-2 w-full justify-start text-gray-600 hover:text-gray-900"
                >
                  <LogOut size={16} className="mr-2" /> Sign out
                </Button>
              </div>
              
              <nav className="space-y-1 px-3">
                {navItems.map((item, idx) => (
                  <Link
                    to={item.href}
                    key={idx}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                      item.active ? 'bg-admin-primary/10 text-admin-primary' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span className={`${item.active ? 'text-admin-primary' : 'text-gray-400'}`}>
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                ))}
              </nav>
            </Sidebar>
          </SidebarProvider>
          
          {/* Main Content */}
          <div className="flex-1 px-6 py-8 md:px-8 lg:px-12">
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </div>
        </div>
        
        <TunisiaFooter />
      </ErrorBoundary>
    </div>
  );
}
