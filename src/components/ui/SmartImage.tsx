"use client";

import Image from "next/image";
import { useState } from "react";

interface SmartImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  onLoadingComplete?: () => void;
}

export function SmartImage({ src, alt, fill, className, onLoadingComplete }: SmartImageProps) {
  const [error, setError] = useState(false);
  const isDev = process.env.NODE_ENV === "development";

  if (error) {
    return (
      <div className="relative w-full h-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={src} 
          alt={alt} 
          className={`${className} ${fill ? 'absolute inset-0 w-full h-full object-cover' : ''}`}
          onLoad={() => onLoadingComplete?.()}
        />
        {isDev && (
          <div className="absolute top-1 left-1 bg-yellow-500 text-[8px] text-white px-1 rounded font-bold shadow-sm z-10">
            IMG FALLBACK
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <Image
        src={src}
        alt={alt}
        fill={fill}
        className={className}
        onError={() => {
          console.warn(`SmartImage: Next/Image failed for ${src}. Falling back to <img>.`);
          setError(true);
        }}
        onLoadingComplete={() => onLoadingComplete?.()}
      />
      {isDev && (
        <div className="absolute top-1 left-1 bg-green-500 text-[8px] text-white px-1 rounded font-bold shadow-sm z-10">
          NEXT/IMAGE
        </div>
      )}
    </div>
  );
}
