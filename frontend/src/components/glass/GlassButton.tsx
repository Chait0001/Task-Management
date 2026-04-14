import React from 'react';
import { motion } from 'framer-motion';

interface GlassButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

const sizeClasses = {
  sm: 'py-2.5 px-6 text-xs',
  md: 'py-3 px-7 text-sm',
  lg: 'py-4 px-8 text-base',
};

export const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  fullWidth = false,
  icon,
}) => {
  const baseClasses = `glass-btn glass-btn--${variant} ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''} ${className}`;

  if (variant === 'ghost') {
    return (
      <motion.button
        type={type}
        onClick={onClick}
        disabled={disabled}
        whileHover={{
          scale: 1.04,
          y: -1,
          transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
        }}
        whileTap={{ scale: 0.97, y: 0 }}
        className={`
          flex items-center justify-center gap-2
          rounded-full font-semibold
          ${sizeClasses[size]}
          ${fullWidth ? 'w-full' : ''}
          cursor-pointer
          disabled:opacity-40 disabled:cursor-not-allowed
          ${className}
        `}
        style={{
          background: 'var(--glass-bg)',
          border: '1px solid var(--glass-border)',
          color: 'var(--text-primary)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: 'var(--shadow-glass), inset 0 1px 0 rgba(255, 255, 255, 0.25)',
          transition: 'background 0.3s, border-color 0.3s, box-shadow 0.3s, filter 0.3s',
        }}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {children}
      </motion.button>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{
        scale: 1.04,
        y: -1,
        transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
      }}
      whileTap={{ scale: 0.97, y: 0 }}
      className={`
        flex items-center justify-center gap-2
        ${baseClasses}
        disabled:opacity-40 disabled:cursor-not-allowed
      `}
    >
      {icon && <span className="flex-shrink-0 relative z-10">{icon}</span>}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};
