import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { useFilterStore } from '@/lib/store';
import { OrderListResponse } from '@/lib/types';

export function useOrders() {
  const { sortBy, page, search } = useFilterStore();

  return useQuery({
    queryKey: ['orders', { sortBy, page, search }],
    queryFn: async () => {
      // Backend expects: status, customerId, startDate, endDate, cursor, limit, sortBy, sortOrder
      const response = await apiClient.getOrders({
        limit: 12,
        sortBy: sortBy === 'newest' ? 'createdAt' : 'total',
        sortOrder: 'desc',
        // search param ไม่ support ใน backend ยัง - ใช้ customerId แทนถ้าต้อง
      });
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to fetch orders');
      }
      return response.data as OrderListResponse;
    },
  });
}

export function useOrderById(id: string) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const response = await apiClient.getOrderById(id);
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to fetch order');
      }
      return response.data;
    },
    enabled: !!id,
  });
}
