'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
}

export default function Tabs({ tabs, defaultTab }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || '');

  const activeContent = tabs.find((t) => t.id === activeTab)?.content;

  return (
    <div>
      {/* Tab buttons */}
      <div className="flex flex-wrap gap-2 justify-center mb-10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative px-5 py-2.5 rounded-full text-sm font-[500] tracking-wide transition-all duration-300 cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#1B4332] text-white shadow-md'
                : 'bg-[#F5F0E8] text-[#4A4A4A] hover:bg-[#1B4332]/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeContent}
      </motion.div>
    </div>
  );
}
