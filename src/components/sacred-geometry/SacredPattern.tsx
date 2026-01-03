'use client';



export default function SacredPattern({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="sacredGrid" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <circle cx="50" cy="50" r="2" fill="#8B0000" opacity="0.3" />
            <circle cx="50" cy="50" r="20" fill="none" stroke="#DC143C" strokeWidth="0.5" opacity="0.2" />
            <circle cx="50" cy="50" r="40" fill="none" stroke="#8B0000" strokeWidth="0.3" opacity="0.15" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="#660000" strokeWidth="0.2" opacity="0.1" />
            <line x1="50" y1="0" x2="50" y2="100" stroke="#660000" strokeWidth="0.2" opacity="0.1" />
            <line x1="15" y1="15" x2="85" y2="85" stroke="#660000" strokeWidth="0.2" opacity="0.1" />
            <line x1="85" y1="15" x2="15" y2="85" stroke="#660000" strokeWidth="0.2" opacity="0.1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#sacredGrid)" />
      </svg>
    </div>
  );
}
