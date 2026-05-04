import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassButton } from './glass/GlassButton';

interface FocusModeOverlayProps {
    taskTitle: string;
    isActive: boolean;
    isPaused: boolean;
    timeFormatted: string;
    progress: number; // 0 to 1
    onPause: () => void;
    onResume: () => void;
    onAbandon: () => void;
}

export const FocusModeOverlay: React.FC<FocusModeOverlayProps> = ({
    taskTitle,
    isActive,
    isPaused,
    timeFormatted,
    progress,
    onPause,
    onResume,
    onAbandon
}) => {
    if (!isActive) return null;

    const radius = 120;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - progress * circumference;

    return (
        <AnimatePresence>
            {isActive && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
                    style={{
                        background: 'rgba(20, 18, 16, 0.9)',
                        backdropFilter: 'blur(40px)',
                        WebkitBackdropFilter: 'blur(40px)'
                    }}
                >
                    <h2 className="text-3xl font-bold mb-8 text-center px-6" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-serif)' }}>
                        Focusing on: <br/> <span style={{ color: 'var(--accent-purple)' }}>{taskTitle}</span>
                    </h2>

                    <div className="relative flex items-center justify-center mb-12">
                        {/* SVG Progress Ring */}
                        <svg width="300" height="300" className="transform -rotate-90">
                            <circle
                                cx="150" cy="150" r={radius}
                                fill="transparent"
                                stroke="rgba(255,255,255,0.1)"
                                strokeWidth="8"
                            />
                            <motion.circle
                                cx="150" cy="150" r={radius}
                                fill="transparent"
                                stroke="var(--accent-purple)"
                                strokeWidth="8"
                                strokeLinecap="round"
                                strokeDasharray={circumference}
                                animate={{ strokeDashoffset }}
                                transition={{ ease: "linear", duration: 0.1 }}
                            />
                        </svg>
                        
                        <div className="absolute text-5xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                            {timeFormatted}
                        </div>
                    </div>

                    <div className="flex gap-4">
                        {isPaused ? (
                            <GlassButton variant="primary" size="lg" onClick={onResume}>
                                Resume Focus
                            </GlassButton>
                        ) : (
                            <GlassButton variant="secondary" size="lg" onClick={onPause}>
                                Pause
                            </GlassButton>
                        )}
                        
                        <div onClick={onAbandon} className="px-6 py-3 rounded-xl font-bold cursor-pointer" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5' }}>
                            Abandon
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
