import React from 'react';
import { motion } from 'framer-motion';
import { GlassButton } from './GlassButton';

interface GlassFeatureCardProps {
  title: string;
  subtitle: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
  className?: string;
}

export const GlassFeatureCard: React.FC<GlassFeatureCardProps> = ({
  title,
  subtitle,
  ctaLabel = '+ Upgrade plan',
  onCtaClick,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{
        scale: 1.015,
        y: -3,
        transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
      }}
      className={`gradient-feature-card p-6 ${className}`}
    >
      {/* Decorative glass toggle */}
      <div className="flex justify-end mb-5">
        <div
          className="w-10 h-5 rounded-full relative"
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(8px)',
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
          }}
        >
          <div
            className="absolute top-[2px] left-[2px] w-4 h-4 rounded-full"
            style={{
              background: 'rgba(255, 255, 255, 0.45)',
              boxShadow: '0 1px 6px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.4)',
            }}
          />
        </div>
      </div>

      <h3 className="text-lg font-bold mb-1" style={{ color: '#ffffff' }}>
        {title}
      </h3>
      <p className="text-sm mb-5" style={{ color: 'rgba(255, 255, 255, 0.65)' }}>
        {subtitle}
      </p>

      <GlassButton
        variant="ghost"
        size="sm"
        onClick={onCtaClick}
        icon={
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        }
      >
        {ctaLabel}
      </GlassButton>
    </motion.div>
  );
};
