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
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editStatus, setEditStatus] = useState(order.status || 'pending');

  const { mutate: updateOrder, isPending: isUpdating } = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.updateOrder(order.id, data);
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to update order');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      setIsEditOpen(false);
    },
    onError: (error: any) => {
      alert(`Error: ${error.message}`);
    },
  });

  const { mutate: deleteOrder, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      const response = await apiClient.deleteOrder(order.id);
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to delete order');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (error: any) => {
      alert(`Error: ${error.message}`);
    },
  });

  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    updateOrder({ status: editStatus });
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this order?')) {
      deleteOrder();
    }
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const items = Array.isArray(order.items) ? order.items : [];
  const totalItems = items.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm opacity-90">Order ID</p>
            <p className="font-mono text-lg font-bold truncate">{order.id?.substring(0, 12)}...</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[order.status as keyof typeof statusColors] || statusColors.pending}`}>
            {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Items */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Items ({totalItems})</h3>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {items.map((item: any, idx: number) => (
              <div key={idx} className="text-sm bg-gray-50 p-2 rounded flex justify-between">
                <span className="text-gray-700">{item.productId}</span>
                <span className="text-gray-600">x{item.quantity} @ ${item.price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium">${order.subtotal?.toFixed(2) || '0.00'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping:</span>
            <span className="font-medium">${order.shippingFee?.toFixed(2) || '0.00'}</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-blue-600 pt-2 border-t">
            <span>Total:</span>
            <span>${order.total?.toFixed(2) || '0.00'}</span>
          </div>
        </div>

        {/* Shipping Address */}
        {order.shippingAddress && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-xs font-semibold text-gray-700 mb-2">SHIPPING TO</p>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-medium text-gray-900">{order.shippingAddress.name}</p>
              <p>{order.shippingAddress.address}</p>
              <p>{order.shippingAddress.province} {order.shippingAddress.postalCode}</p>
              <p>{order.shippingAddress.phone}</p>
            </div>
          </div>
        )}

        {/* Notes */}
        {order.note && (
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
            <p className="text-xs font-semibold text-blue-700 mb-1">NOTE</p>
            <p className="text-sm text-blue-900">{order.note}</p>
          </div>
        )}

        {/* Date */}
        <div className="text-xs text-gray-500">
          Created: {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()}
        </div>

        {/* Edit Modal */}
        {isEditOpen && (
          <form onSubmit={handleUpdateStatus} className="border-t pt-4 space-y-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Update Status</label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isUpdating}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
              >
                {isUpdating ? 'Saving...' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditOpen(false);
                  setEditStatus(order.status || 'pending');
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Action Buttons */}
        {!isEditOpen && (
          <div className="flex gap-2 pt-4 border-t">
            <button
              onClick={() => setIsEditOpen(true)}
              className="flex-1 bg-blue-100 text-blue-700 py-2 rounded-lg hover:bg-blue-200 font-medium transition-colors"
            >
              ✏️ Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 bg-red-100 text-red-700 py-2 rounded-lg hover:bg-red-200 font-medium disabled:opacity-50 transition-colors"
            >
              {isDeleting ? 'Deleting...' : '🗑️ Delete'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
