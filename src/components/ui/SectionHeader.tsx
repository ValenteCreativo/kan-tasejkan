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
        <div className={`relative w-full overflow-hidden my-16 ${className}`}>
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className={`relative z-10 px-4 mb-4 ${
                    align === "center" ? "text-center" :
                    align === "right"  ? "text-right"  : "text-left"
                }`}
            >
                {/* subtitle → eyebrow above */}
                {subtitle && (
                    <p className="eyebrow mb-2">{subtitle}</p>
                )}
                <h2
                    className="font-light tracking-[0.2em] uppercase text-white"
                    style={{
                        fontFamily: 'var(--font-heading), serif',
                        fontSize: 'clamp(1.25rem, 2.5vw, 1.875rem)',
                    }}
                >
                    {title}
                </h2>
            </motion.div>

            {/* dashed accent thread */}
            <div className="relative h-[2px] w-full">
                <svg className="w-full h-full absolute top-0 left-0" preserveAspectRatio="none">
                    <line
                        x1="0" y1="50%" x2="100%" y2="50%"
                        stroke="var(--accent)"
                        strokeWidth="0.8"
                        strokeDasharray="4 14"
                        opacity="0.6"
                    />
                </svg>
            </div>
        </div>
    );
};

export default SectionHeader;
