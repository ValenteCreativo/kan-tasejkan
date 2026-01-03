import React from "react";

const SectionDivider: React.FC = () => {
    return (
        <div className="relative w-full overflow-hidden my-12 opacity-80">
            <svg
                className="w-full h-[50px] md:h-[80px]"
                viewBox="0 0 1440 100"
                preserveAspectRatio="none"
            >
                {/* Background matches page background */}
                <path
                    fill="var(--background)"
                    d="M0,0 L1440,0 L1440,100 L0,100 Z"
                />

                {/* Handpoke Stitch Line - Static */}
                <path
                    d="
            M 0 50
            Q 180 48 360 52
            T 720 50
            T 1080 52
            T 1440 50
          "
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth="1.5"
                    strokeDasharray="4 12"
                    strokeLinecap="round"
                    className="opacity-60"
                />
            </svg>
        </div>
    );
};

export default SectionDivider;
