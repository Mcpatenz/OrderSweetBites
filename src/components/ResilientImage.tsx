import React, { useState } from 'react';
import { CakeSlice } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  className = '',
  fallbackLabel,
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#2B1D17] via-[#3A261E] to-[#1B120E] text-[#F5EBE1] p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <CakeSlice className="w-8 h-8 text-[#C69C53] mb-2 opacity-80" />
        <span className="font-serif-display text-sm tracking-wide text-[#F5EBE1]/90">
          {fallbackLabel || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
      loading="lazy"
    />
  );
};
