import React from "react";
import { motion } from "framer-motion";

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    className?: string;
    align?: "left" | "center" | "right";
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
    title,
    subtitle,
    className = "",
    align = "center"
}) => {
    return (
        <div className={`relative w-full overflow-hidden my-20 ${className}`}>

            {/* The Text Block */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className={`relative z-10 px-4 mb-4 ${align === "center" ? "text-center" :
                    align === "right" ? "text-right" : "text-left"
                    }`}
            >
                <h2 className="text-2xl md:text-3xl font-light tracking-[0.2em] uppercase text-white mb-2">
                    {title}
                </h2>
                {subtitle && (
                    <p className="text-xs md:text-sm text-[#8b7d7b] tracking-[0.3em] uppercase opacity-70 font-mono">
                        {subtitle}
                    </p>
                )}
            </motion.div>

            {/* The Thread (Stitch) */}
            <div className="relative h-[2px] w-full">
                {/* Thread Line */}
                <svg
                    className="w-full h-full absolute top-0 left-0"
                    preserveAspectRatio="none"
                >
                    <line
                        x1="0"
                        y1="50%"
                        x2="100%"
                        y2="50%"
                        stroke="var(--accent)"
                        strokeWidth="1"
                        strokeDasharray="4 12"
                        opacity="0.8"
                    />
                </svg>
            </div>
        </div>
    );
};

export default SectionHeader;
