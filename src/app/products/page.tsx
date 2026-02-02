'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/providers/AuthProvider';
import { apiClient } from '@/lib/api';

export default function ProductsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [limit, setLimit] = useState(20);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data: productsData, isLoading, error } = useQuery({
    queryKey: ['products', selectedCategory, searchTerm, limit],
    queryFn: async () => {
      const response = await apiClient.getProducts({
        category: selectedCategory || undefined,
        search: searchTerm || undefined,
        limit,
      });
      if (!response.success) throw new Error(response.error?.message);
      console.log('📦 Products response:', response.data);
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // productsData = { data: [...], pagination: {...} }
  const products = productsData?.data || [];
  const pagination = productsData?.pagination || {};

  const { mutate: deleteProduct, isPending: isDeleting } = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.deleteProduct(id);
      if (!response.success) throw new Error(response.error?.message);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      alert('Product deleted successfully');
    },
    onError: (error: any) => {
      alert(`Error: ${error.message}`);
    },
  });

  const { mutate: createProduct, isPending: isCreating } = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.createProduct(data);
      if (!response.success) throw new Error(response.error?.message);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setIsCreateOpen(false);
      alert('Product created successfully');
    },
    onError: (error: any) => {
      alert(`Error: ${error.message}`);
    },
  });

  const handleDelete = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct(productId);
    }
  };

  const isAdmin = (user as any)?.role === 'admin' || (user as any)?.email === 'admin@example.com';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Products Catalog</h1>
          <p className="text-gray-600">Browse our selection of products</p>
        </div>

        {/* Admin Actions */}
        {isAdmin && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <button
              onClick={() => setIsCreateOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              ➕ Add New Product
            </button>
          </div>
        )}

        {/* Create Product Modal */}
        {isCreateOpen && (
          <CreateProductModal
            onClose={() => setIsCreateOpen(false)}
            onSubmit={createProduct}
            isLoading={isCreating}
          />
        )}

        {/* Search & Filter */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Accessories">Accessories</option>
              <option value="Software">Software</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            Error loading products: {(error as Error).message}
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && products.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {products.map((product: any) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isAdmin={isAdmin}
                  onDelete={handleDelete}
                  isDeleting={isDeleting}
                />
              ))}
            </div>

            {/* Pagination Info */}
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Showing {products.length} of {pagination.total} products
              </p>
              {pagination.pages > 1 && (
                <select
                  value={limit}
                  onChange={(e) => setLimit(Number(e.target.value))}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value={10}>10 per page</option>
                  <option value={20}>20 per page</option>
                  <option value={50}>50 per page</option>
                </select>
              )}
            </div>
          </>
        )}

        {/* Empty State */}
        {!isLoading && products.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
}

interface ProductCardProps {
  product: any;
  isAdmin: boolean;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

function ProductCard({ product, isAdmin, onDelete, isDeleting }: ProductCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState({
    name: product.name,
    price: product.price,
    stock: product.stock,
    active: product.active,
  });

  const { mutate: updateProduct, isPending: isUpdating } = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.updateProduct(product.id, data);
      if (!response.success) throw new Error(response.error?.message);
      return response.data;
    },
    onSuccess: () => {
      setIsEditOpen(false);
      alert('Product updated successfully');
    },
    onError: (error: any) => {
      alert(`Error: ${error.message}`);
    },
  });

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateProduct(editData);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      {/* Image */}
      <div className="w-full h-40 bg-gray-200 flex items-center justify-center overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform"
          />
        ) : (
          <div className="text-4xl">📦</div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-2">
          <h3 className="font-bold text-gray-900 line-clamp-2">{product.name}</h3>
          {product.category && (
            <p className="text-sm text-gray-500">{product.category}</p>
          )}
        </div>

        {product.description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{product.description}</p>
        )}

        <div className="flex justify-between items-center mb-4 border-t pt-3">
          <span className="text-2xl font-bold text-blue-600">
            ฿{Number(product.price).toFixed(2)}
          </span>
          <span className={`text-xs px-2 py-1 rounded font-semibold ${
            product.stock > 0
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            Stock: {product.stock}
          </span>
        </div>

        {/* Edit Form */}
        {isEditOpen && isAdmin && (
          <form onSubmit={handleUpdate} className="space-y-3 mb-4 border-t pt-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Price</label>
                <input
                  type="number"
                  value={editData.price}
                  onChange={(e) => setEditData({ ...editData, price: parseFloat(e.target.value) })}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Stock</label>
                <input
                  type="number"
                  value={editData.stock}
                  onChange={(e) => setEditData({ ...editData, stock: parseInt(e.target.value) })}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isUpdating}
                className="flex-1 bg-green-600 text-white py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-1 rounded text-sm hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Admin Actions */}
        {isAdmin && !isEditOpen && (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditOpen(true)}
              className="flex-1 bg-blue-100 text-blue-700 py-2 rounded text-sm hover:bg-blue-200 font-medium"
            >
              ✏️ Edit
            </button>
            <button
              onClick={() => onDelete(product.id)}
              disabled={isDeleting}
              className="flex-1 bg-red-100 text-red-700 py-2 rounded text-sm hover:bg-red-200 font-medium disabled:opacity-50"
            >
              🗑️ Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

interface CreateProductModalProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

function CreateProductModal({ onClose, onSubmit, isLoading }: CreateProductModalProps) {
  const [formData, setFormData] = React.useState({
    name: '',
    description: '',
    price: 0,
    category: 'Electronics',
    stock: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || formData.price <= 0 || formData.stock < 0) {
      alert('Please fill in all required fields');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Add New Product</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Product Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter product name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter product description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Price (฿) *</label>
              <input
                type="number"
                required
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Stock *</label>
              <input
                type="number"
                required
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="Electronics">Electronics</option>
              <option value="Accessories">Accessories</option>
              <option value="Software">Software</option>
            </select>
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
            >
              {isLoading ? 'Creating...' : 'Create Product'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
