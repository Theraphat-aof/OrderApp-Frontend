'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';
import { useLogout } from '@/hooks/useAuth';

export function Navbar() {
  const { user, isAuthenticated } = useAuth();
  const { mutate: logout, isPending } = useLogout();

  return (
    <nav className="sticky top-0 z-50 bg-white backdrop-blur-md bg-opacity-95 shadow-card border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 transition-all"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center text-white font-bold">
              OA
            </div>
            OrderApp
          </Link>

          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <>
                {/* Navigation Links */}
                <div className="flex items-center gap-6 pr-4 border-r border-gray-300">
                  <Link
                    href="/products"
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                  >
                    🛍️ Products
                  </Link>
                  <Link
                    href="/order"
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                  >
                    📦 Orders
                  </Link>
                </div>

                <div className="flex items-center gap-3 px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
                    {user.fullName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {user.fullName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => logout()}
                  disabled={isPending}
                  className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 disabled:opacity-50 transition-all font-medium shadow-md hover:shadow-lg"
                >
                  {isPending ? 'Logging out...' : 'Logout'}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg font-medium transition-all"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 font-medium transition-all shadow-md hover:shadow-lg"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
