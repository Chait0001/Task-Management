import React from 'react';
import { motion } from 'framer-motion';

interface GlassIconButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  ariaLabel?: string;
}

const sizeMap = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
};

export const GlassIconButton: React.FC<GlassIconButtonProps> = ({
  children,
  onClick,
  size = 'md',
  className = '',
  ariaLabel,
}) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{
        scale: 1.1,
        transition: { duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] },
      }}
      whileTap={{
        scale: 0.9,
        transition: { duration: 0.1 },
      }}
      className={`glass-icon-btn ${sizeMap[size]} ${className}`}
      aria-label={ariaLabel}
    >
      {children}
    </motion.button>
  );
};
