'use client';

import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/providers/AuthProvider';

const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1, 'Product ID required'),
        quantity: z.number().min(1, 'Quantity must be at least 1'),
        price: z.number().min(0, 'Price cannot be negative'),
      })
    )
    .min(1, 'At least one item required'),
  shippingAddress: z.object({
    name: z.string().min(1, 'Name required'),
    phone: z.string().min(1, 'Phone required'),
    address: z.string().min(1, 'Address required'),
    province: z.string().min(1, 'Province required'),
    postalCode: z.string().min(1, 'Postal code required'),
  }),
  note: z.string().optional(),
});

type CreateOrderFormData = z.infer<typeof createOrderSchema>;

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateOrderModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateOrderModalProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateOrderFormData>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      items: [{ productId: '', quantity: 1, price: 0 }],
      shippingAddress: {
        name: '',
        phone: '',
        address: '',
        province: '',
        postalCode: '',
      },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const onSubmit = async (data: CreateOrderFormData) => {
    if (!user) {
      setError('User not authenticated');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
          body: JSON.stringify({
            customerId: user.id,
            items: data.items,
            shippingAddress: data.shippingAddress,
            note: data.note,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create order');
      }

      reset();
      onClose();
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to create order');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Create Order</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              {error}
            </div>
          )}

          {/* Items Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Items</h3>
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="border rounded-lg p-4 space-y-3 bg-gray-50"
              >
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product ID
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., PROD-001"
                      {...register(`items.${index}.productId`)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    {errors.items?.[index]?.productId && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.items[index]?.productId?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      min="1"
                      {...register(`items.${index}.quantity`, {
                        valueAsNumber: true,
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    {errors.items?.[index]?.quantity && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.items[index]?.quantity?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      {...register(`items.${index}.price`, {
                        valueAsNumber: true,
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    {errors.items?.[index]?.price && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.items[index]?.price?.message}
                      </p>
                    )}
                  </div>

                  <div className="flex items-end">
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="w-full px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                append({ productId: '', quantity: 1, price: 0 })
              }
              className="w-full px-4 py-2 border-2 border-dashed border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 font-medium"
            >
              + Add Item
            </button>
          </div>

          {/* Shipping Address Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Shipping Address
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  {...register('shippingAddress.name')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                {errors.shippingAddress?.name && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.shippingAddress.name.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    {...register('shippingAddress.phone')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  {errors.shippingAddress?.phone && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.shippingAddress.phone.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Province
                  </label>
                  <input
                    type="text"
                    {...register('shippingAddress.province')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  {errors.shippingAddress?.province && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.shippingAddress.province.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  {...register('shippingAddress.address')}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                {errors.shippingAddress?.address && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.shippingAddress.address.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  {...register('shippingAddress.postalCode')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                {errors.shippingAddress?.postalCode && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.shippingAddress.postalCode.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Note Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Note (Optional)
            </label>
            <textarea
              {...register('note')}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Any special instructions..."
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-end pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
            >
              {isSubmitting ? 'Creating...' : 'Create Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
