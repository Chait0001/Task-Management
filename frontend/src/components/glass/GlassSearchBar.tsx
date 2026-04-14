import React from 'react';
import { motion } from 'framer-motion';

interface GlassSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  onSubmit?: () => void;
}

export const GlassSearchBar: React.FC<GlassSearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search projects...',
  className = '',
  onSubmit,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && onSubmit) onSubmit();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`relative group ${className}`}
    >
      {/* Glass search container */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: 'var(--glass-bg)',
          border: '1px solid var(--glass-border)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          boxShadow: 'var(--shadow-glass), var(--shadow-inner)',
          transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      >
        {/* Top rim light */}
        <div
          className="absolute top-0 left-[10%] right-[10%] h-px pointer-events-none z-10"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
          }}
        />

        {/* Search icon */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: 'var(--text-muted)', opacity: 0.6 }}
            className="transition-all duration-300 group-focus-within:opacity-100"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </div>

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="
            !pl-12 !pr-4 !py-3.5
            !rounded-2xl !text-sm !font-medium
            !border-none !bg-transparent
            !shadow-none
            focus:!shadow-none
          "
          style={{
            color: 'var(--text-primary)',
            backdropFilter: 'none',
          }}
        />
      </div>

      {/* Focus glow ring */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity duration-400"
        style={{
          boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.1), 0 0 24px rgba(139, 92, 246, 0.06)',
        }}
      />
    </motion.div>
  );
};
