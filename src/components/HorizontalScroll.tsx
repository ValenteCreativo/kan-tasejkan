'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

interface HorizontalScrollProps {
    children: React.ReactNode;
    className?: string;
}

export default function HorizontalScroll({ children, className = "" }: HorizontalScrollProps) {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    // Movement: 0% to -66.66% (3 panels)
    const x = useTransform(scrollYProgress, [0, 1], ["0%", "-66.66%"]);

    // Tactile Feedback States
    const [isLocked, setIsLocked] = useState(false);
    const [isReleased, setIsReleased] = useState(false);

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        // Entry Click: Flash briefly at 1-10% progress
        if (latest > 0.01 && latest < 0.1) {
            if (!isLocked) setIsLocked(true);
        } else {
            if (isLocked) setIsLocked(false);
        }

        // Exit Click: Flash briefly at 95-99% progress (Just before unpinning)
        // User wants it to "fade out as soon as it starts going up" -> implies it shouldn't persist at 100%
        if (latest > 0.95 && latest < 0.999) {
            if (!isReleased) setIsReleased(true);
        } else {
            if (isReleased) setIsReleased(false);
        }
    });

    return (
        <section ref={targetRef} className={`relative h-[350vh] bg-background ${className}`}>
            <div className="sticky top-0 flex h-screen items-center overflow-hidden">

                {/* MECHANICAL ENTRY GATE (The "Click") - Subtle Opacity (60%) */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-[#8a1c1c] z-50 transition-all duration-200 origin-left ${isLocked ? 'scale-x-100 opacity-60' : 'scale-x-0 opacity-0'}`} />

                <motion.div
                    style={{ x }}
                    className="flex h-screen items-center w-[300vw]"
                >
                    {children}
                </motion.div>

                {/* MECHANICAL EXIT GATE (The "Release") - Subtle Opacity, No Text */}
                {/* Duration 200ms for quick tactile feel. Only appears > 0.95 then disappears at 1.0 */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-[#8a1c1c] z-50 transition-all duration-200 origin-right ${isReleased ? 'scale-x-100 opacity-60' : 'scale-x-0 opacity-0'}`} />

            </div>
        </section>
    );
}
