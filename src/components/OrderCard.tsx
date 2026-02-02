'use client';

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { Order } from '@/lib/types';
import { useAuth } from '@/providers/AuthProvider';
import Swal from 'sweetalert2';

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editStatus, setEditStatus] = useState(order.status || 'pending');
  
  const isAdminOrSeller = user?.role === 'admin' || (user?.role as string) === 'seller';
  const canCancel = !isAdminOrSeller && (order.status === 'pending' || !order.status);

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
      Swal.fire({
        title: 'Updated!',
        text: 'Order status has been updated.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    },
    onError: (error: any) => {
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error'
      });
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
      Swal.fire(
        'Deleted!',
        'Order has been deleted.',
        'success'
      );
    },
    onError: (error: any) => {
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error'
      });
    },
  });

  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    updateOrder({ status: editStatus });
  };

  const handleDelete = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteOrder();
      }
    });
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-4 lg:p-6 lg:flex lg:gap-6 lg:items-start">
        {/* Header Info (Mobile: Top, Desktop: Left) - Replaced Order ID with Status/Date */}
        <div className="lg:w-48 lg:flex-shrink-0 flex items-center justify-between lg:block mb-4 lg:mb-0">
          <div>
            <p className="text-xs text-gray-500 mb-1">Status</p>
            <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[order.status as keyof typeof statusColors] || statusColors.pending}`}>
              {(order.status || 'pending')?.charAt(0).toUpperCase() + (order.status || 'pending')?.slice(1)}
            </span>
          </div>
          <div className="lg:mt-4 text-right lg:text-left">
            <p className="text-xs text-gray-500 mb-1 lg:hidden">Date</p>
            <p className="text-sm text-gray-600">
              {order.createdAt ? new Date(order.createdAt).toLocaleString('th-TH', { 
                timeZone: 'Asia/Bangkok',
                year: 'numeric', 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }) : '-'}
            </p>
          </div>
        </div>

        {/* Products (Mobile: Middle, Desktop: Center) */}
        <div className="flex-1 min-w-0 border-t border-b lg:border-0 border-gray-100 py-4 lg:py-0">
           <div className="space-y-3">
            {(order as any).items?.map((item: any, index: number) => {
              // Flexible accessor for product details
              const product = item.product || {};
              const productName = product.name || product.title || item.name || item.productName || 'Unknown Product';
              const productImage = product.image || product.imageUrl || item.image || item.productImage;
              
              return (
                <div key={index} className="flex gap-4 items-center">
                  <div className="w-12 h-12 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                    {productImage ? (
                      <img
                        src={productImage}
                        alt={productName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">Box</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{productName}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity} × ฿{Number(item.price).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </div>
                </div>
              );
            })}
             {(!(order as any).items || (order as any).items.length === 0) && (
               <p className="text-sm text-gray-500 italic">No items details</p>
            )}
           </div>
        </div>

        {/* Totals & Date (Mobile: Bottom, Desktop: Right-Center) */}
        <div className="lg:w-40 lg:flex-shrink-0 lg:text-right flex justify-between items-end lg:block mt-4 lg:mt-0">
            <div>
              <p className="text-xs text-gray-500 mb-1">Total Amount</p>
              <p className="text-lg font-bold text-blue-600">
                ฿{Number(
                  (order as any).totalPrice || 
                  (order as any).total || 
                  (order as any).items?.reduce((sum: number, item: any) => sum + (Number(item.price) * item.quantity), 0) || 
                  0
                ).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="lg:mt-2">
              <p className="text-xs text-gray-400">
                {new Date(order.createdAt).toLocaleDateString('th-TH')}
              </p>
            </div>
        </div>

        {/* Actions (Mobile: Bottom, Desktop: Right) */}
        <div className="mt-4 lg:mt-0 lg:w-32 lg:flex-shrink-0 flex lg:flex-col gap-2">
           {isEditOpen ? (
              <form onSubmit={handleUpdateStatus} className="flex flex-col gap-2 w-full">
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as any)}
                  className="w-full text-xs px-2 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <div className="flex gap-1">
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="flex-1 bg-blue-600 text-white text-xs py-1.5 rounded hover:bg-blue-700"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditOpen(false);
                      setEditStatus(order.status || 'pending');
                    }}
                    className="flex-1 bg-gray-200 text-gray-700 text-xs py-1.5 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
           ) : (
             <>
               {isAdminOrSeller && (
                 <>
                   <button
                     onClick={() => setIsEditOpen(true)}
                     className="flex-1 lg:w-full bg-blue-50 text-blue-600 text-xs py-2 rounded border border-blue-100 hover:bg-blue-100 font-medium transition-colors"
                   >
                     Update Status
                   </button>
                   <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex-1 lg:w-full bg-white text-red-600 text-xs py-2 rounded border border-red-100 hover:bg-red-50 font-medium transition-colors"
                   >
                     {isDeleting ? 'Deleting' : 'Delete'}
                   </button>
                 </>
               )}
               
               {!isAdminOrSeller && canCancel && (
                  <button
                    onClick={() => {
                        Swal.fire({
                          title: 'Cancel Order?',
                          text: "Are you sure you want to cancel this order?",
                          icon: 'warning',
                          showCancelButton: true,
                          confirmButtonColor: '#d33',
                          cancelButtonColor: '#3085d6',
                          confirmButtonText: 'Yes, cancel it!'
                        }).then((result) => {
                          if (result.isConfirmed) {
                            updateOrder({ status: 'cancelled' });
                          }
                        });
                      }}
                      disabled={isUpdating}
                      className="w-full bg-red-50 text-red-600 text-xs py-2 rounded border border-red-100 hover:bg-red-100 font-medium transition-colors"
                  >
                    {isUpdating ? '...' : 'Cancel Order'}
                  </button>
               )}
             </>
           )}
        </div>
      </div>
    </div>
  );
}
