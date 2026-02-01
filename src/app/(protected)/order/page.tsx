'use client';

import { Suspense, useState } from 'react';
import { useOrders } from '@/hooks/useOrder';
import { useFilters } from '@/hooks/useFilters';
import { FilterPanel } from '@/components/FilterPanel';
import { OrderCard } from '@/components/OrderCard';
import { Pagination } from '@/components/Pagination';
import { OrderCardSkeleton } from '@/components/Skeleton';
import { CreateOrderModal } from '@/components/CreateOrderModal';

function OrdersContent() {
  const { data, isLoading, error, refetch } = useOrders();
  const { page } = useFilters();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  if (error) {
    return (
      <div className="text-center py-16 px-6 bg-red-50 rounded-2xl border border-red-200">
        <div className="text-red-600 text-6xl mb-4">⚠️</div>
        <div className="text-2xl font-bold text-red-600 mb-2">Error Loading Orders</div>
        <p className="text-red-600">{(error as any)?.message || 'Please try again later'}</p>
      </div>
    );
  }

  return (
    <>
      {/* Grid of Orders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading
          ? Array.from({ length: 12 }).map((_, i) => (
              <OrderCardSkeleton key={i} />
            ))
          : data?.data?.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
      </div>

      {/* Empty State */}
      {!isLoading && (!data?.data || data.data.length === 0) && (
        <div className="text-center py-16 px-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
          <div className="text-6xl mb-4 animate-pulse">📦</div>
          <p className="text-gray-700 text-xl font-bold mb-2">No Orders Found</p>
          <p className="text-gray-600 mb-6">Start by creating your first order!</p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            + Create Order
          </button>
        </div>
      )}

      {/* Pagination */}
      {data && data.total > 0 && (
        <div className="mt-8">
          <Pagination
            total={data.total}
            pageSize={data.pageSize}
            currentPage={page}
          />
        </div>
      )}

      <CreateOrderModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          setIsCreateModalOpen(false);
          refetch?.();
        }}
      />
    </>
  );
}

export default function OrderPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-10 animate-fade-in">
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-800 mb-3">
            🛍️ Browse & Order
          </h1>
          <p className="text-gray-600 text-lg">Discover amazing products and create orders with advanced filtering options</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1">
            <div className="sticky top-20">
              <FilterPanel />
            </div>
          </aside>

          {/* Main Content */}
          <section className="lg:col-span-3">
            <Suspense fallback={<OrderCardSkeleton />}>
              <OrdersContent />
            </Suspense>
          </section>
        </div>
      </div>
    </main>
  );
}
