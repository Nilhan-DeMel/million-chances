"use client";

import Image from "next/image";
import { useState } from "react";

interface SmartImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  sizes?: string;
  className?: string;
  onLoad?: () => void;
}

export function SmartImage({ 
  src, 
  alt, 
  fill, 
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw",
  className, 
  onLoad 
}: SmartImageProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="relative w-full h-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={src} 
          alt={alt} 
          className={`${className} ${fill ? 'absolute inset-0 w-full h-full object-cover' : ''}`}
          onLoad={() => onLoad?.()}
        />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <Image
        src={src}
        alt={alt}
        fill={fill}
        sizes={fill ? sizes : undefined}
        className={className}
        onError={() => {
          console.warn(`SmartImage: Next/Image failed for ${src}. Falling back to <img>.`);
          setError(true);
        }}
        onLoad={() => onLoad?.()}
      />
    </div>
  );
}
