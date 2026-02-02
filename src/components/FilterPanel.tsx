'use client';

import React from 'react';
import { useFilters } from '@/hooks/useFilters';

const CATEGORIES = [
  'Electronics',
  'Clothing',
  'Food',
  'Books',
  'Home',
  'Sports',
  'Toys',
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A-Z' },
  { value: 'name-desc', label: 'Name: Z-A' },
];

export function FilterPanel() {
  const {
    category,
    minPrice,
    maxPrice,
    sortBy,
    search,
    setCategory,
    setPriceRange,
    setSortBy,
    setSearch,
  } = useFilters();

  return (
    <div className="bg-white rounded-2xl shadow-card p-4 lg:p-6 border border-gray-100 sticky top-24 z-10 mb-6 transition-all duration-300">
      <div className="flex flex-col lg:flex-row gap-4 lg:items-end">
        {/* Search */}
        <div className="w-full lg:flex-1">
          <label className="block text-sm font-semibold text-gray-800 mb-1.5">
            Search
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-all text-sm"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          </div>
        </div>

        {/* Category Filter */}
        <div className="w-full lg:w-48">
          <label className="block text-sm font-semibold text-gray-800 mb-1.5">
            Category
          </label>
          <select
            value={category || ''}
            onChange={(e) => setCategory(e.target.value || null)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-all text-sm font-medium"
          >
            <option value="">📦 All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div className="w-full lg:w-72">
          <label className="block text-sm font-semibold text-gray-800 mb-1.5">
            Price Range
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-2.5 text-gray-400 text-xs">$</span>
              <input
                type="number"
                placeholder="Min"
                value={minPrice || ''}
                onChange={(e) =>
                  setPriceRange(
                    e.target.value ? parseInt(e.target.value) : null,
                    maxPrice
                  )
                }
                className="w-full px-3 py-2.5 pl-6 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-all text-sm"
              />
            </div>
            <span className="text-gray-400">-</span>
            <div className="relative flex-1">
              <span className="absolute left-3 top-2.5 text-gray-400 text-xs">$</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice || ''}
                onChange={(e) =>
                  setPriceRange(
                    minPrice,
                    e.target.value ? parseInt(e.target.value) : null
                  )
                }
                className="w-full px-3 py-2.5 pl-6 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-all text-sm"
              />
            </div>
          </div>
        </div>

        {/* Sort Options */}
        <div className="w-full lg:w-48">
          <label className="block text-sm font-semibold text-gray-800 mb-1.5">
            Sort By
          </label>
          <select
            value={sortBy || 'newest'}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-all text-sm font-medium"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      {(category || minPrice || maxPrice || search) && (
        <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap items-center gap-3">
          <p className="text-xs font-semibold text-gray-600">Active Filters:</p>
          <div className="flex flex-wrap gap-2">
            {search && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                🔍 {search}
                <button onClick={() => setSearch('')} className="ml-1.5 text-blue-500 hover:text-blue-700 font-bold">×</button>
              </span>
            )}
            {category && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                📦 {category}
                <button onClick={() => setCategory(null)} className="ml-1.5 text-green-500 hover:text-green-700 font-bold">×</button>
              </span>
            )}
            {(minPrice || maxPrice) && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                💰 ${minPrice || '0'} - ${maxPrice || '∞'}
                <button onClick={() => setPriceRange(null, null)} className="ml-1.5 text-purple-500 hover:text-purple-700 font-bold">×</button>
              </span>
            )}
            <button
               onClick={() => {
                setCategory(null);
                setPriceRange(null, null);
                setSearch('');
               }}
               className="text-xs text-red-500 hover:text-red-700 underline ml-2"
            >
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
