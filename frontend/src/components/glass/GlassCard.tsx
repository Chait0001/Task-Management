import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface GlassCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: React.ReactNode;
  blur?: number;
  noHover?: boolean;
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  blur,
  noHover = false,
  className = '',
  ...motionProps
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={noHover ? undefined : {
        scale: 1.008,
        y: -2,
        transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
      }}
      className={`glass-panel rounded-3xl p-7 ${className}`}
      style={{
        backdropFilter: blur ? `blur(${blur}px)` : undefined,
        WebkitBackdropFilter: blur ? `blur(${blur}px)` : undefined,
      }}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
};
