// components/LoadingOverlay.tsx
import React from 'react';
import Image from 'next/image';

interface LoadingOverlayProps {
  loadingText: string | null
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ loadingText }) => {
  if (!loadingText) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="flex items-center p-4 bg-white border-2 border-corgi rounded-xl w-96 h-48 p-8">
        <Image src="/corgi-logo.png" alt="Corgi Logo" width={100} height={100} />
        <span className="ml-8 text-corgi font-semibold">{loadingText}</span>
      </div>
    </div>
  );
};
