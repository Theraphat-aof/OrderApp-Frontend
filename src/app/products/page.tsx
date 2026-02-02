'use client';

import React, { useState, Suspense } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { useProducts } from '@/hooks/useProducts';
import { useFilters } from '@/hooks/useFilters';
import { ProductGrid } from '@/components/ProductGrid';
import { CreateProductModal } from '@/components/CreateProductModal';
import { FilterPanel } from '@/components/FilterPanel';
import { Plus } from 'lucide-react';

function ProductsContent() {
  const { user } = useAuth();
  const { category, search, minPrice, maxPrice, sortBy } = useFilters();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const getSortParams = (sortValue: string) => {
    switch (sortValue) {
      case 'price-asc': return { sortBy: 'price', sortOrder: 'asc' as const };
      case 'price-desc': return { sortBy: 'price', sortOrder: 'desc' as const };
      case 'name-asc': return { sortBy: 'name', sortOrder: 'asc' as const };
      case 'name-desc': return { sortBy: 'name', sortOrder: 'desc' as const };
      case 'newest': default: return { sortBy: 'createdAt', sortOrder: 'desc' as const };
    }
  };

  const { sortBy: sortField, sortOrder } = getSortParams(sortBy);

  const { data: productsData, isLoading, error } = useProducts({
    category: category || undefined,
    search: search || undefined,
    minPrice: minPrice || undefined,
    maxPrice: maxPrice || undefined,
    sortBy: sortField,
    sortOrder,
    limit: 20,
  });

  const products = productsData || [];

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setIsCreateOpen(true);
  };

  const handleCreateOpen = () => {
    setEditingProduct(null);
    setIsCreateOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products Catalog</h1>
          <p className="text-gray-600 mt-1">Manage and view your product inventory</p>
        </div>
        
        {(user as any)?.role === 'admin' && (
          <button
            onClick={handleCreateOpen}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm hover:shadow-md"
          >
            <Plus size={20} />
            Add Product
          </button>
        )}
      </div>

      <div className="flex flex-col gap-6">
        {/* Top Filter Panel */}
        <div className="w-full">
          <FilterPanel />
        </div>

        {/* Product Grid */}
        <div className="w-full">
          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
              <div className="text-red-500 text-5xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold text-red-700 mb-2">Error Loading Products</h3>
              <p className="text-red-600">{(error as any)?.message || 'Something went wrong directly'}</p>
            </div>
          ) : (
            <ProductGrid 
              products={products} 
              isLoading={isLoading} 
              onEdit={handleEditProduct}
            />
          )}

          {!isLoading && products.length === 0 && !error && (
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-12 text-center">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Products Found</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Try adjusting your search or filters to find what you're looking for.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      <CreateProductModal
        isOpen={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false);
          setEditingProduct(null);
        }}
        productToEdit={editingProduct}
      />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
