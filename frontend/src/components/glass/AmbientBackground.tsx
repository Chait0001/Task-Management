import React from 'react';
import { motion } from 'framer-motion';

/**
 * Ambient glow background with floating gradient blobs.
 * Creates the soft-lit atmosphere for the liquid glass UI.
 */
export const AmbientBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(160deg, var(--bg-main-from) 0%, var(--bg-main-via) 40%, var(--bg-main-to) 100%)',
        }}
      />

      {/* Purple blob – top left */}
      <motion.div
        animate={{
          x: [0, 30, -20, 10, 0],
          y: [0, -20, 15, -10, 0],
          scale: [1, 1.05, 0.95, 1.02, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="ambient-blob ambient-blob--purple"
        style={{ top: '-5%', left: '5%' }}
      />

      {/* Cyan blob – center right */}
      <motion.div
        animate={{
          x: [0, -25, 20, -15, 0],
          y: [0, 15, -25, 10, 0],
          scale: [1, 0.96, 1.06, 0.98, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
        className="ambient-blob ambient-blob--cyan"
        style={{ top: '30%', right: '-5%' }}
      />

      {/* Pink blob – bottom left */}
      <motion.div
        animate={{
          x: [0, 20, -30, 15, 0],
          y: [0, -15, 10, -20, 0],
          scale: [1, 1.04, 0.94, 1.03, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 4,
        }}
        className="ambient-blob ambient-blob--pink"
        style={{ bottom: '5%', left: '15%' }}
      />

      {/* Extra faint purple blob – bottom right */}
      <motion.div
        animate={{
          x: [0, -15, 25, -10, 0],
          y: [0, 20, -10, 15, 0],
          scale: [1, 1.03, 0.97, 1.01, 1],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 6,
        }}
        className="ambient-blob ambient-blob--purple"
        style={{ bottom: '-10%', right: '10%', opacity: 0.25, width: '350px', height: '350px' }}
      />

      {/* Noise texture overlay for depth */}
      <div
        className="absolute inset-0"
        style={{
          background: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
          opacity: 0.02,
          mixBlendMode: 'overlay',
        }}
      />
    </div>
  );
};
