'use client';

import { useAuth } from '../providers';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { User, LogOut, Settings } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [showDropdown, setShowDropdown] = useState(false);
  
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  // Helper function to determine if a link is active
  const isActive = (path: string) => {
    if (path === '/dashboard' && pathname === '/dashboard') {
      return true;
    }
    if (path === '/dashboard/reservations' && pathname.startsWith('/dashboard/reservations')) {
      return true;
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-white">
      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold">Aiora Reservations</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link 
                  href="/dashboard" 
                  className={`${isActive('/dashboard') 
                    ? 'border-indigo-500 text-gray-900 dark:text-white' 
                    : 'border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white'} 
                    inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/dashboard/reservations" 
                  className={`${isActive('/dashboard/reservations') 
                    ? 'border-indigo-500 text-gray-900 dark:text-white' 
                    : 'border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white'} 
                    inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Reservations
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="mr-4">Welcome, {user.firstName}</span>
              
              {/* Profile dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="bg-white dark:bg-gray-700 p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white focus:outline-none"
                >
                  <User className="h-5 w-5" />
                </button>
                
                {showDropdown && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                    <Link 
                      href="/dashboard/admin" 
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setShowDropdown(false)}
                    >
                      <div className="flex items-center">
                        <Settings className="h-4 w-4 mr-2" />
                        Admin Panel
                      </div>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setShowDropdown(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <div className="flex items-center">
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}