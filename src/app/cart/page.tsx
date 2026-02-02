'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/providers/AuthProvider';
import { apiClient } from '@/lib/api';
import { Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import Swal from 'sweetalert2';
import dynamic from 'next/dynamic';

const AddressForm = dynamic(() => import('@/components/AddressForm'), { 
  ssr: false,
  loading: () => <div className="p-4 text-center text-gray-500">Loading address form...</div>
});

export default function CartPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { items, removeItem, updateQuantity, clearCart, totalPrice, totalItems } = useCart();
  const { user, isLoading } = useAuth();
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    phone: '',
    address: '',
    subdistrict: '',
    district: '',
    province: '',
    postalCode: ''
  });

  // Pre-fill name if user loads
  React.useEffect(() => {
    if (user?.fullName) {
      setShippingInfo(prev => ({ ...prev, name: user.fullName }));
    }
  }, [user]);

  const { mutate: createOrder, isPending: isCreating } = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('User not found');
      if (items.length === 0) throw new Error('Cart is empty');

      const orderItems = items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
      }));

      // Combine address parts
      const fullAddress = [
        shippingInfo.address,
        shippingInfo.subdistrict ? `ต.${shippingInfo.subdistrict}` : '',
        shippingInfo.district ? `อ.${shippingInfo.district}` : '',
      ].filter(Boolean).join(' ');

      const response = await apiClient.createOrder({
        items: orderItems,
        shippingAddress: {
          name: shippingInfo.name,
          phone: shippingInfo.phone,
          address: fullAddress,
          province: shippingInfo.province,
          postalCode: shippingInfo.postalCode
        }
      });

      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to create order');
      }

      return response.data;
    },
    onSuccess: () => {
      clearCart();
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['products'] }); // Refresh products to show updated stock
      Swal.fire({
        title: 'Order Created!',
        text: 'Your order has been placed successfully.',
        icon: 'success',
        confirmButtonText: 'OK',
      }).then(() => {
        router.push('/order');
      });
    },
    onError: (error: any) => {
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'OK',
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-lg text-gray-600 mb-4">Please log in to view your cart</p>
          <button
            onClick={() => router.push('/login')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 text-lg mb-4">Your cart is empty</p>
            <button
              onClick={() => router.push('/products')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="divide-y">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 flex flex-col sm:flex-row gap-4 hover:bg-gray-50 transition-colors"
                    >
                      {/* Image & Main Info Group for Mobile */}
                      <div className="flex gap-4 flex-1">
                        {/* Image */}
                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <span className="text-2xl">📦</span>
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            ฿{Number(item.price).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} each
                          </p>

                          {/* Quantity Control - Mobile Visible inside flex */}
                          <div className="flex items-center gap-2 mt-3">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 hover:bg-gray-200 rounded"
                              disabled={item.quantity <= 1}
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-8 text-center font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 hover:bg-gray-200 rounded"
                              disabled={item.quantity >= item.stock}
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Total & Remove - Re-aligned for responsive */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-between border-t sm:border-t-0 pt-4 sm:pt-0 mt-2 sm:mt-0">
                        <div className="text-lg font-bold text-blue-600">
                          ฿{(Number(item.price) * item.quantity).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded"
                          title="Remove Item"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Checkout Panel */}
            <div className="bg-white rounded-lg shadow p-6 h-fit sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

              {/* Totals */}
              <div className="space-y-2 mb-6 pb-6 border-b">
                <div className="flex justify-between text-gray-700">
                  <span>Items ({totalItems})</span>
                  <span>฿{Number(totalPrice).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span>฿0.00</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2">
                  <span>Total</span>
                  <span className="text-blue-600">฿{Number(totalPrice).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>

              {/* Checkout Form - Changed to div to prevent accidental form submission/reload */}
              <div className="space-y-4">
                {/* Receiver Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Receiver Name
                  </label>
                  <input
                    type="text"
                    value={shippingInfo.name}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, name: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="John Doe"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={shippingInfo.phone}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="0812345678"
                  />
                </div>

                {/* Address Selection */}
                <AddressForm shippingInfo={shippingInfo} setShippingInfo={setShippingInfo} />


                {/* Buttons */}
                <div className="space-y-2 pt-4">
                  <button
                    type="button"
                    onClick={() => createOrder()}
                    disabled={isCreating || items.length === 0}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2 rounded-lg font-medium transition-colors"
                  >
                    {isCreating ? 'Creating Order...' : 'Place Order'}
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push('/products')}
                    className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 rounded-lg font-medium transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>

              {/* Clear Cart */}
              <button
                onClick={() => {
                  Swal.fire({
                    title: 'Clear Cart?',
                    text: 'Are you sure you want to remove all items?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: 'Yes, clear it!'
                  }).then((result) => {
                    if (result.isConfirmed) {
                      clearCart();
                      Swal.fire(
                        'Cleared!',
                        'Your cart has been cleared.',
                        'success'
                      );
                    }
                  });
                }}
                className="w-full mt-4 text-red-600 hover:text-red-700 hover:bg-red-50 py-2 rounded-lg font-medium transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
