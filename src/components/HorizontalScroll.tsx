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

    // 3 Panels (Digital, Tattoo, Journal)
    // Width = 300vw
    // Movement = 0 to -200vw (to show the 3rd panel fully)
    // -200vw / 300vw = -66.666%

    // Adjusted to 400vh to balance "friction" (speed) and "arrival time" (footer access).
    const x = useTransform(scrollYProgress, [0, 1], ["0%", "-66.66%"]);

    return (
        <section ref={targetRef} className={`relative h-[400vh] bg-background ${className}`}>
            <div className="sticky top-0 flex h-screen items-center overflow-hidden">
                <motion.div
                    style={{ x }}
                    className="flex h-screen items-center w-[300vw]"
                >
                    {children}
                </motion.div>
            </div>
        </section>
    );
}
