'use client';

import { motion } from 'framer-motion';

interface FlowerOfLifeProps {
  size?: number;
  className?: string;
  animate?: boolean;
}

export default function FlowerOfLife({ size = 200, className = '', animate = true }: FlowerOfLifeProps) {
  const circles = [
    { cx: 50, cy: 50 },
    { cx: 50, cy: 30 },
    { cx: 67.32, cy: 40 },
    { cx: 67.32, cy: 60 },
    { cx: 50, cy: 70 },
    { cx: 32.68, cy: 60 },
    { cx: 32.68, cy: 40 },
  ];

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      initial={animate ? { opacity: 0, scale: 0.8, rotate: -180 } : {}}
      animate={animate ? { opacity: 1, scale: 1, rotate: 0 } : {}}
      transition={{ duration: 1.5, ease: 'easeOut' }}
    >
      <defs>
        <radialGradient id="flowerGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#DC143C" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#8B0000" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#660000" stopOpacity="0.3" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {circles.map((circle, index) => (
        <motion.circle
          key={index}
          cx={circle.cx}
          cy={circle.cy}
          r="20"
          fill="none"
          stroke="url(#flowerGradient)"
          strokeWidth="0.5"
          filter="url(#glow)"
          initial={animate ? { scale: 0, opacity: 0 } : {}}
          animate={animate ? { scale: 1, opacity: 1 } : {}}
          transition={{
            duration: 0.8,
            delay: index * 0.1,
            ease: 'easeOut',
          }}
        />
      ))}

      <motion.circle
        cx="50"
        cy="50"
        r="40"
        fill="none"
        stroke="#D4AF37"
        strokeWidth="0.3"
        opacity="0.4"
        initial={animate ? { scale: 0, opacity: 0 } : {}}
        animate={animate ? { scale: 1, opacity: 0.4 } : {}}
        transition={{ duration: 1.2, delay: 0.5 }}
      />
    </motion.svg>
  );
}
