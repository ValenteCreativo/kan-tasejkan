'use client';

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface HorizontalScrollProps {
    children: React.ReactNode;
    className?: string;
}

export default function HorizontalScroll({ children, className = "" }: HorizontalScrollProps) {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    // Transform vertical scroll to horizontal movement
    // We scroll 100% of the container width to the left
    // 3 Panels (Digital, Tattoo, Journal) + 1 partial initial view = ~300vw movement needed
    // We map 0-1 vertical progress to 0% to -75% horizontal translation to show all panels.

    // Increased height to 500vh to add "friction" (make it slower) as requested.
    const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);

    return (
        <section ref={targetRef} className={`relative h-[500vh] bg-background ${className}`}>
            <div className="sticky top-0 flex h-screen items-center overflow-hidden">
                <motion.div
                    style={{ x }}
                    className="flex h-screen items-center w-[400vw]" /* 4 sections width */
                >
                    {children}
                </motion.div>
            </div>
        </section>
    );
}
