'use client';

import React from 'react';
import { useFilters } from '@/hooks/useFilters';

const CATEGORIES = [
  'Electronics',
  'Clothing',
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
    <div className="bg-white rounded-2xl shadow-card p-6 space-y-6 sticky top-20 border border-gray-100">
      <div className="pb-4 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <span className="text-xl">🔍</span>
          Filters & Search
        </h3>
      </div>

      {/* Search */}
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-3">
          Search Products
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-all"
          />
          <span className="absolute left-3 top-3 text-gray-400">🔍</span>
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-3">
          Category
        </label>
        <select
          value={category || ''}
          onChange={(e) => setCategory(e.target.value || null)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-all font-medium"
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
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-3">
          Price Range
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-600 font-medium mb-1 block">Min</label>
            <input
              type="number"
              placeholder="$0"
              value={minPrice || ''}
              onChange={(e) =>
                setPriceRange(
                  e.target.value ? parseInt(e.target.value) : null,
                  maxPrice
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-all text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-600 font-medium mb-1 block">Max</label>
            <input
              type="number"
              placeholder="$1000"
              value={maxPrice || ''}
              onChange={(e) =>
                setPriceRange(
                  minPrice,
                  e.target.value ? parseInt(e.target.value) : null
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-all text-sm"
            />
          </div>
        </div>
      </div>

      {/* Sort Options */}
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-3">
          Sort By
        </label>
        <select
          value={sortBy || 'newest'}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-all font-medium"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Active Filters Display */}
      {(category || minPrice || maxPrice || search) && (
        <div className="pt-4 border-t border-gray-200">
          <p className="text-xs font-semibold text-gray-600 mb-2">Active Filters:</p>
          <div className="flex flex-wrap gap-2">
            {search && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                🔍 {search}
              </span>
            )}
            {category && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                {category}
              </span>
            )}
            {(minPrice || maxPrice) && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                ${minPrice || '0'} - ${maxPrice || '∞'}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
