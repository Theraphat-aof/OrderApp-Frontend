'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useFilterStore } from '@/lib/store';

export function useFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const {
    category,
    minPrice,
    maxPrice,
    sortBy,
    page,
    search,
    setCategory,
    setPriceRange,
    setSortBy,
    setPage,
    setSearch,
  } = useFilterStore();

  // Sync URL to store on initial load
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const minPriceParam = searchParams.get('minPrice');
    const maxPriceParam = searchParams.get('maxPrice');
    const sortParam = searchParams.get('sort');
    const pageParam = searchParams.get('page');
    const searchParam = searchParams.get('search');

    if (categoryParam) setCategory(categoryParam);
    if (minPriceParam || maxPriceParam) {
      setPriceRange(
        minPriceParam ? parseInt(minPriceParam) : null,
        maxPriceParam ? parseInt(maxPriceParam) : null
      );
    }
    if (sortParam) setSortBy(sortParam);
    if (pageParam) setPage(parseInt(pageParam));
    if (searchParam) setSearch(searchParam);
  }, []);

  // Sync store to URL
  useEffect(() => {
    const params = new URLSearchParams();

    if (category) params.set('category', category);
    if (minPrice !== null) params.set('minPrice', minPrice.toString());
    if (maxPrice !== null) params.set('maxPrice', maxPrice.toString());
    if (sortBy && sortBy !== 'newest') params.set('sort', sortBy);
    if (page > 1) params.set('page', page.toString());
    if (search) params.set('search', search);

    const queryString = params.toString();
    const href = queryString ? `${pathname}?${queryString}` : pathname;
    router.push(href);
  }, [category, minPrice, maxPrice, sortBy, page, search, router, pathname]);

  return {
    category,
    minPrice,
    maxPrice,
    sortBy,
    page,
    search,
    setCategory,
    setPriceRange,
    setSortBy,
    setPage,
    setSearch,
  };
}
