'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

interface HorizontalScrollProps {
    children: React.ReactNode;
    className?: string;
}

export default function HorizontalScroll({ children, className = "" }: HorizontalScrollProps) {
    const targetRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    // Movement: 0% to -66.66% (3 panels)
    const x = useTransform(scrollYProgress, [0, 1], ["0%", "-66.66%"]);

    // Tactile Feedback States
    const [isLocked, setIsLocked] = useState(false);
    const [isReleased, setIsReleased] = useState(false);
    const [hasSnapped, setHasSnapped] = useState(false);
    const [showClickIndicator, setShowClickIndicator] = useState(false);

    // Haptic feedback for mobile devices
    const triggerHaptic = useCallback(() => {
        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
            navigator.vibrate(10); // Short 10ms vibration
        }
    }, []);

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        // SNAP EFFECT: Prominent "click" at the exact moment horizontal scroll begins
        // Triggers at 0.5-1.5% progress - the exact moment the user enters the horizontal section
        if (latest > 0.005 && latest < 0.02 && !hasSnapped) {
            setHasSnapped(true);
            setShowClickIndicator(true);
            triggerHaptic();

            // Brief flash of the click indicator
            setTimeout(() => {
                setShowClickIndicator(false);
            }, 300);
        }

        // Reset snap state when user scrolls back up
        if (latest < 0.003) {
            setHasSnapped(false);
        }

        // Entry Lock: Visual feedback at 1-10% progress
        if (latest > 0.01 && latest < 0.1) {
            if (!isLocked) setIsLocked(true);
        } else {
            if (isLocked) setIsLocked(false);
        }

        // Exit Click: Flash briefly at 95-99% progress
        if (latest > 0.95 && latest < 0.999) {
            if (!isReleased) {
                setIsReleased(true);
                triggerHaptic();
            }
        } else {
            if (isReleased) setIsReleased(false);
        }
    });

    return (
        <section ref={targetRef} className={`relative h-[350vh] bg-background ${className}`}>
            <div className="sticky top-0 flex h-screen items-center overflow-hidden">

                {/* SNAP INDICATOR - The "Click" moment */}
                <div
                    className={`
                        absolute inset-0 z-40 pointer-events-none
                        transition-all duration-150 ease-out
                        ${showClickIndicator
                            ? 'bg-[#8a1c1c]/5 border-2 border-[#8a1c1c]/30'
                            : 'bg-transparent border-transparent'
                        }
                    `}
                />

                {/* MECHANICAL ENTRY GATE - Enhanced with glow */}
                <div
                    className={`
                        absolute top-0 left-0 right-0 h-1 bg-[#8a1c1c] z-50
                        transition-all duration-200 origin-left
                        ${isLocked ? 'scale-x-100 opacity-80' : 'scale-x-0 opacity-0'}
                        ${hasSnapped && isLocked ? 'shadow-[0_0_20px_rgba(138,28,28,0.5)]' : ''}
                    `}
                />

                {/* Side indicators showing scroll is now horizontal */}
                <div
                    className={`
                        absolute left-0 top-1/2 -translate-y-1/2 w-1 h-20
                        bg-gradient-to-b from-transparent via-[#8a1c1c] to-transparent
                        z-50 transition-all duration-300
                        ${hasSnapped && isLocked ? 'opacity-40' : 'opacity-0'}
                    `}
                />
                <div
                    className={`
                        absolute right-0 top-1/2 -translate-y-1/2 w-1 h-20
                        bg-gradient-to-b from-transparent via-[#8a1c1c] to-transparent
                        z-50 transition-all duration-300
                        ${hasSnapped && isLocked ? 'opacity-40' : 'opacity-0'}
                    `}
                />

                <motion.div
                    ref={contentRef}
                    style={{ x }}
                    className={`
                        flex h-screen items-center w-[300vw]
                        transition-transform duration-75
                        ${showClickIndicator ? 'scale-[1.002]' : 'scale-100'}
                    `}
                >
                    {children}
                </motion.div>

                {/* MECHANICAL EXIT GATE - Enhanced */}
                <div
                    className={`
                        absolute bottom-0 left-0 right-0 h-1 bg-[#8a1c1c] z-50
                        transition-all duration-200 origin-right
                        ${isReleased ? 'scale-x-100 opacity-80 shadow-[0_0_20px_rgba(138,28,28,0.5)]' : 'scale-x-0 opacity-0'}
                    `}
                />

            </div>
        </section>
    );
}
