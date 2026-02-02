'use client';

import { Suspense } from 'react';
import { useOrders } from '@/hooks/useOrder';
import { useFilters } from '@/hooks/useFilters';
import { OrderCard } from '@/components/OrderCard';
import { Pagination } from '@/components/Pagination';
import { OrderCardSkeleton } from '@/components/Skeleton';
import Link from 'next/link';
import { ShoppingCart, AlertCircle, Package, ShoppingBag } from 'lucide-react';

function OrdersContent() {
  const { data, isLoading, error } = useOrders();
  const { page } = useFilters();

  if (error) {
    return (
      <div className="text-center py-16 px-6 bg-red-50 rounded-2xl border border-red-200">
        <div className="flex justify-center mb-4">
          <AlertCircle size={64} className="text-red-500" />
        </div>
        <div className="text-2xl font-bold text-red-600 mb-2">Error Loading Orders</div>
        <p className="text-red-600">{(error as any)?.message || 'Please try again later'}</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col space-y-4">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <OrderCardSkeleton key={i} />
            ))
          : data?.data?.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
      </div>

      {!isLoading && (!data?.data || data.data.length === 0) && (
        <div className="text-center py-16 px-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
          <div className="flex justify-center mb-4">
            <Package size={64} className="text-blue-500 animate-pulse" />
          </div>
          <p className="text-gray-700 text-xl font-bold mb-2">No Orders Yet</p>
          <p className="text-gray-600 mb-6">Browse products and create your first order!</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <ShoppingCart size={20} />
            Start Shopping
          </Link>
        </div>
      )}

      {data && data.total > 0 && (
        <div className="mt-8">
          <Pagination
            total={data.total}
            pageSize={data.pageSize}
            currentPage={page}
          />
        </div>
      )}
    </>
  );
}

export default function OrderPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-10 animate-fade-in">
          <h1 className="flex items-center gap-3 text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-800 mb-3">
            <ShoppingBag className="w-10 h-10 text-blue-600 shrink-0" />
            Order History
          </h1>
          <p className="text-gray-600 text-lg">View and track your past orders</p>
        </div>

        {/* Main Content */}
        <section>
          <Suspense fallback={<OrderCardSkeleton />}>
            <OrdersContent />
          </Suspense>
        </section>
      </div>
    </main>
  );
}
