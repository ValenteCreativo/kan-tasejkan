'use client';

import { useState, useRef, MouseEvent } from 'react';
import Image from 'next/image';

interface ImageMagnifierProps {
    src: string;
    alt: string;
    className?: string;
    magnifierHeight?: number;
    magnifierWidth?: number;
    zoomLevel?: number;
}

export default function ImageMagnifier({
    src,
    alt,
    className = '',
    magnifierHeight = 200,
    magnifierWidth = 200,
    zoomLevel = 2.5
}: ImageMagnifierProps) {
    const [showMagnifier, setShowMagnifier] = useState(false);
    const [[x, y], setXY] = useState([0, 0]);
    const [[imgWidth, imgHeight], setSize] = useState([0, 0]);
    const imgRef = useRef<HTMLDivElement>(null);

    const handleMouseEnter = (e: MouseEvent) => {
        const elem = e.currentTarget;
        const { width, height } = elem.getBoundingClientRect();
        setSize([width, height]);
        setShowMagnifier(true);
    };

    const handleMouseMove = (e: MouseEvent) => {
        const elem = e.currentTarget;
        const { top, left } = elem.getBoundingClientRect();

        // Calculate cursor position relative to the image
        const x = e.pageX - left - window.scrollX;
        const y = e.pageY - top - window.scrollY;
        setXY([x, y]);
    };

    const handleMouseLeave = () => {
        setShowMagnifier(false);
    };

    return (
        <div
            ref={imgRef}
            className={`relative inline-block w-full h-full ${className}`}
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <Image
                src={src}
                alt={alt}
                fill
                className="object-cover"
                priority
            />

            {showMagnifier && (
                <div
                    style={{
                        display: 'block',
                        position: 'absolute',
                        pointerEvents: 'none',
                        height: `${magnifierHeight}px`,
                        width: `${magnifierWidth}px`,
                        top: `${y - magnifierHeight / 2}px`,
                        left: `${x - magnifierWidth / 2}px`,
                        opacity: '1',
                        border: '1px solid #8a1c1c',
                        backgroundColor: 'black',
                        backgroundImage: `url('${src}')`,
                        backgroundRepeat: 'no-repeat',
                        // Calculate zoomed image size based on original image dimensions
                        backgroundSize: `${imgWidth * zoomLevel}px ${imgHeight * zoomLevel}px`,
                        // Calculate background position to match cursor
                        backgroundPositionX: `${-x * zoomLevel + magnifierWidth / 2}px`,
                        backgroundPositionY: `${-y * zoomLevel + magnifierHeight / 2}px`,
                        borderRadius: '50%',
                        zIndex: 100,
                        boxShadow: '0 0 10px rgba(0,0,0,0.5), inset 0 0 20px rgba(0,0,0,0.5)'
                    }}
                />
            )}
        </div>
    );
}
