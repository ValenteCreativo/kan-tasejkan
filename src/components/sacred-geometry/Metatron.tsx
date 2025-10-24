'use client';

import { motion } from 'framer-motion';

interface MetatronProps {
  size?: number;
  className?: string;
}

export default function Metatron({ size = 300, className = '' }: MetatronProps) {
  const points = [
    { x: 50, y: 10 }, { x: 75, y: 25 }, { x: 85, y: 50 }, { x: 75, y: 75 },
    { x: 50, y: 90 }, { x: 25, y: 75 }, { x: 15, y: 50 }, { x: 25, y: 25 },
    { x: 50, y: 40 }, { x: 50, y: 60 }, { x: 35, y: 50 }, { x: 65, y: 50 }, { x: 50, y: 50 },
  ];

  const connections = [
    [0, 4], [1, 5], [2, 6], [3, 7], [0, 2], [2, 4], [4, 6], [6, 0],
    [1, 3], [3, 5], [5, 7], [7, 1], [0, 12], [1, 12], [2, 12], [3, 12],
    [4, 12], [5, 12], [6, 12], [7, 12], [8, 9], [10, 11], [8, 10], [9, 11],
  ];

  return (
    <motion.svg width={size} height={size} viewBox="0 0 100 100" className={className}
      initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }}
      transition={{ duration: 2, ease: 'easeOut' }}>
      <defs>
        <linearGradient id="metatronLine" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B0000" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#DC143C" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.4" />
        </linearGradient>
        <filter id="metatronGlow">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
          <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <g className="animate-rotate-sacred origin-center">
        {connections.map((connection, index) => {
          const [start, end] = connection;
          return (
            <motion.line key={index} x1={points[start].x} y1={points[start].y}
              x2={points[end].x} y2={points[end].y} stroke="url(#metatronLine)"
              strokeWidth="0.3" filter="url(#metatronGlow)"
              initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.05, ease: 'easeInOut' }} />
          );
        })}
        {points.map((point, index) => (
          <motion.circle key={index} cx={point.x} cy={point.y} r="1.5" fill="#DC143C"
            filter="url(#metatronGlow)" initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 1 + index * 0.05, ease: 'easeOut' }} />
        ))}
      </g>
      <motion.circle cx="50" cy="50" r="45" fill="none" stroke="#8B0000" strokeWidth="0.2"
        opacity="0.3" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 0.3 }}
        transition={{ duration: 1.5, delay: 1.5 }} />
    </motion.svg>
  );
}
