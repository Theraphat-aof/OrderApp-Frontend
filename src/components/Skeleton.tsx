'use client';

import React from 'react';

interface LoadingSkeletonProps {
  count?: number;
  className?: string;
}

export function LoadingSkeleton({ count = 1, className = '' }: LoadingSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`bg-gray-200 rounded-lg animate-pulse ${className}`}
        />
      ))}
    </>
  );
}

export function OrderCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <LoadingSkeleton className="h-48 w-full mb-4" />
      <LoadingSkeleton className="h-4 w-3/4 mb-3" />
      <LoadingSkeleton className="h-4 w-1/2 mb-4" />
      <div className="flex gap-2">
        <LoadingSkeleton className="h-6 flex-1" />
        <LoadingSkeleton className="h-6 flex-1" />
      </div>
    </div>
  );
}
