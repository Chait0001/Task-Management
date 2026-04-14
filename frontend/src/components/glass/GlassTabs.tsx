import React from 'react';
import { motion } from 'framer-motion';

interface Tab {
  id: string;
  label: string;
}

interface GlassTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
  className?: string;
}

export const GlassTabs: React.FC<GlassTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`glass-tabs-container ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <motion.button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            whileHover={!isActive ? {
              scale: 1.03,
              transition: { duration: 0.2 },
            } : undefined}
            whileTap={{ scale: 0.97 }}
            className={`glass-tab ${isActive ? 'glass-tab--active' : ''}`}
            style={{
              color: isActive ? 'var(--accent-purple)' : 'var(--text-muted)',
            }}
          >
            {/* Animated sliding background for active tab */}
            {isActive && (
              <motion.div
                layoutId="activeTabGlow"
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'var(--glass-bg-strong)',
                  border: '1px solid rgba(139, 92, 246, 0.12)',
                  boxShadow: `
                    0 2px 12px rgba(139, 92, 246, 0.1),
                    0 0 20px rgba(139, 92, 246, 0.04),
                    inset 0 1px 0 rgba(255, 255, 255, 0.3)
                  `,
                  zIndex: -1,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </motion.button>
        );
      })}
    </motion.div>
  );
};
