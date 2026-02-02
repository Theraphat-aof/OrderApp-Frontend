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
      });
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to fetch orders');
      }
      
      const rawData = response.data;

      // Handle if response is just an array
      if (Array.isArray(rawData)) {
        return {
          data: rawData,
          total: rawData.length,
          page: page,
          pageSize: 12,
          hasNextPage: false,
        } as OrderListResponse;
      }

      // Map backend response structure to OrderListResponse
      if (rawData.items) {
        return {
          data: rawData.items,
          total: rawData.total || rawData.items.length,
          page: rawData.page || page,
          pageSize: rawData.limit || 12,
          hasNextPage: rawData.hasNextPage || false,
        } as OrderListResponse;
      }

      return rawData as OrderListResponse;
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
