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
    // The '300vw' hardcode depends on how many sections we have, 
    // but usually we want dynamic calculation or a flexible constraint.
    // For 'Grimoire' style, if we have 4 panels (Digital, Tattoo, Journal, Footer),
    // we effectively want to slide through them.
    // If the container is 400vw wide (4 sections), we move -300vw (to show the last one).

    const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);

    return (
        <section ref={targetRef} className={`relative h-[400vh] bg-background ${className}`}>
            <div className="sticky top-0 flex h-screen items-center overflow-hidden">
                <motion.div
                    style={{ x }}
                    className="flex h-screen items-center w-[400vw]" /* 4 sections = 400vw */
                >
                    {children}
                </motion.div>
            </div>
        </section>
    );
}
