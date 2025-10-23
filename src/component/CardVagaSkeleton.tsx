import React from 'react';

export function CardVagaSkeleton() {
  return (
    <div className="relative bg-white border border-gray-200 rounded-lg shadow h-full flex flex-col animate-pulse">
      <div className="flex justify-center items-center h-48 bg-gray-200 rounded-t-lg p-4">
        <div className="h-24 w-32 bg-gray-300 rounded"></div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-4">
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-full"></div>
        </div>
        
        <div className="mt-auto">
          <div className="h-10 bg-blue-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}