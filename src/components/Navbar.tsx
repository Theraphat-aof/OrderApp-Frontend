'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';
import { useLogout } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { ShoppingCart, Menu, X } from 'lucide-react';

export function Navbar() {
  const { user, isAuthenticated } = useAuth();
  const { mutate: logout, isPending } = useLogout();
  const { totalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 bg-white backdrop-blur-md bg-opacity-95 shadow-card border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 transition-all"
            onClick={closeMenu}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center text-white font-bold">
              OA
            </div>
            OrderApp
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-3">
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

                {/* Shopping Cart */}
                <Link
                  id="cart-icon-desktop"
                  href="/cart"
                  className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors"
                  title="Shopping Cart"
                >
                  <ShoppingCart size={24} />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Link>

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

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4 lg:hidden">
            {isAuthenticated && (
              <Link
                id="cart-icon-mobile"
                href="/cart"
                className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors"
                onClick={closeMenu}
              >
                <ShoppingCart size={24} />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={toggleMenu}
              className="p-2 text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg absolute w-full left-0 top-16 transition-all duration-300 ease-in-out">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {isAuthenticated && user ? (
              <>
                <div className="flex items-center gap-3 px-4 py-4 mb-2 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
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
                
                <Link
                  href="/products"
                  className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg font-medium transition-colors"
                  onClick={closeMenu}
                >
                  🛍️ Products
                </Link>
                <Link
                  href="/order"
                  className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg font-medium transition-colors"
                  onClick={closeMenu}
                >
                  📦 Orders
                </Link>
                
                <div className="pt-2">
                  <button
                    onClick={() => {
                      logout();
                      closeMenu();
                    }}
                    disabled={isPending}
                    className="w-full text-center px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 disabled:opacity-50 transition-all font-medium"
                  >
                    {isPending ? 'Logging out...' : 'Logout'}
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-3 pt-4">
                 <Link
                  href="/login"
                   className="block w-full text-center px-4 py-3 text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-all border border-blue-100"
                   onClick={closeMenu}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block w-full text-center px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 font-medium transition-all shadow-md"
                  onClick={closeMenu}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
