'use client';

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { Order } from '@/lib/types';

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  const { mutate: createOrder, isPending } = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.createOrder(data);
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to create order');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      setShowForm(false);
      setQuantity(1);
      setNotes('');
      alert('Order created successfully!');
    },
    onError: (error: any) => {
      alert(`Error: ${error.message}`);
    },
  });

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    createOrder({
      productId: order.id,
      quantity,
      notes: notes || undefined,
    });
  };

  return (
    <div className="group bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all overflow-hidden border border-gray-100 hover:border-blue-200">
      {/* Product Image */}
      <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-100 flex items-center justify-center overflow-hidden relative group">
        {order.image ? (
          <img
            src={order.image}
            alt={order.productName}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="text-gray-400 text-center">
            <div className="text-5xl mb-2 group-hover:scale-110 transition-transform">📦</div>
            <p className="text-sm font-medium">No image available</p>
          </div>
        )}
        {order.status && (
          <div className="absolute top-3 right-3">
            <span
              className={`text-xs px-3 py-1 rounded-full font-bold shadow-md backdrop-blur-sm ${
                order.status === 'completed'
                  ? 'bg-green-500 text-white'
                  : order.status === 'pending'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-red-500 text-white'
              }`}
            >
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
        )}
      </div>

      <div className="p-5">
        {/* Product Info */}
        <div className="mb-2">
          <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {order.productName}
          </h3>
          <p className="text-sm font-medium text-gray-500">
            {order.category}
          </p>
        </div>

        {order.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {order.description}
          </p>
        )}

        <div className="flex justify-between items-end mb-4 pt-3 border-t border-gray-200">
          <div>
            <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">
              ${order.price.toFixed(2)}
            </span>
          </div>
          <span className="text-xs text-gray-400 font-medium">
            {new Date(order.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: '2-digit'
            })}
          </span>
        </div>

        {/* Form */}
        {showForm ? (
          <form onSubmit={handleCreateOrder} className="space-y-3 mb-4 animate-slide-down">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold transition-colors"
                >
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  max="999"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-center font-semibold"
                />
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold transition-colors"
                >
                  +
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any special requests..."
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm bg-gray-50 hover:bg-white transition-all resize-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isPending}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50 font-bold transition-all shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
              >
                {isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating...
                  </span>
                ) : (
                  '✓ Confirm Order'
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 py-3 rounded-lg font-bold transition-all shadow-md"
              >
                ✕ Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 font-bold transition-all shadow-card hover:shadow-card-hover transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            <span>🛒</span>
            Create Order
          </button>
        )}
      </div>
    </div>
  );
}
