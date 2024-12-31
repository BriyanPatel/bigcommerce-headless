"use client";
import React, { useState, useRef } from 'react';
import Image from 'next/image';

interface ZoomableImageProps {
  src: string;
  alt: string;
}

export const ZoomableImage: React.FC<ZoomableImageProps> = ({ src, alt }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!imageRef.current) return;

    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;

    imageRef.current.style.transformOrigin = `${x * 100}% ${y * 100}%`;
  };

  const zoomSrc = src.replace('{:size}', '2000x2000');

  return (
    <div className="relative overflow-hidden zoom-image cursor-zoom-in">
      <Image
        src={zoomSrc}
        alt={alt}
        layout="responsive"
        width={2000}
        height={2000}
        className={`transition-transform duration-200 ${isZoomed ? 'scale-150' : 'scale-100'}`}
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
        ref={imageRef}
      />
    </div>
  );
};