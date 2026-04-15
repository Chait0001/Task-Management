import React, { useState } from 'react';
import { motion } from 'framer-motion';
import BorderGlow from './BorderGlow';
import { GlassCard } from './glass/GlassCard';
import { WebcamPixelGrid } from '@/components/ui/webcam-pixel-grid';

interface AuthPageProps {
  onLoginSuccess: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app we'd validate and authenticate here.
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-black relative flex items-center justify-center p-6">
      {/* Webcam Pixel Grid Background */}
      <div className="absolute inset-0">
        <WebcamPixelGrid
          gridCols={60}
          gridRows={40}
          maxElevation={50}
          motionSensitivity={0.25}
          elevationSmoothing={0.2}
          colorMode="webcam"
          backgroundColor="#030303"
          mirror={true}
          gapRatio={0.05}
          invertColors={false}
          darken={0.6}
          borderColor="#ffffff"
          borderOpacity={0.06}
          className="w-full h-full"
          onWebcamReady={() => console.log("Webcam ready!")}
          onWebcamError={(err) => console.error("Webcam error:", err)}
        />
      </div>

      {/* Gradient overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60 pointer-events-none" />

      {/* Auth form */}
      <div className="relative z-10">
        <BorderGlow
          className="w-full max-w-md p-1"
          edgeSensitivity={30}
          glowColor="268 100 76"
          backgroundColor="rgba(0, 0, 0, 0.75)"
          borderRadius={32}
          glowRadius={40}
          glowIntensity={1.2}
          coneSpread={25}
          animated={true}
          colors={['#c084fc', '#f472b6', '#38bdf8']}
        >
          <GlassCard blur={40} className="w-full p-8 !border-0 bg-transparent flex flex-col gap-6" style={{ borderRadius: '28px' }}>
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{
                  background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                  boxShadow: '0 4px 16px rgba(139, 92, 246, 0.3)',
                }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2 L20 7 L20 17 L12 22 L4 17 L4 7 Z" />
                  <path d="M12 8 L12 16" />
                  <path d="M8 10 L16 10" />
                </svg>
              </motion.div>
              <h1 className="text-2xl font-extrabold tracking-tight mb-2" style={{ color: 'var(--text-primary)' }}>
                {isLogin ? 'Welcome back' : 'Create an account'}
              </h1>
              <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                {isLogin ? 'Enter your details to access your workspace' : 'Start managing your tasks effectively today'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {!isLogin && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold ml-1" style={{ color: 'var(--text-primary)' }}>Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-300"
                    style={{
                      background: 'var(--glass-bg)',
                      border: '1px solid var(--glass-border)',
                      color: 'var(--text-primary)',
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'var(--accent-purple)';
                      e.currentTarget.style.boxShadow = '0 0 0 4px rgba(139, 92, 246, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'var(--glass-border)';
                      e.currentTarget.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.1)';
                    }}
                  />
                </div>
              )}
              
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold ml-1" style={{ color: 'var(--text-primary)' }}>Email</label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-300"
                  style={{
                    background: 'var(--glass-bg)',
                    border: '1px solid var(--glass-border)',
                    color: 'var(--text-primary)',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent-purple)';
                    e.currentTarget.style.boxShadow = '0 0 0 4px rgba(139, 92, 246, 0.15)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'var(--glass-border)';
                    e.currentTarget.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.1)';
                  }}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold ml-1 flex justify-between" style={{ color: 'var(--text-primary)' }}>
                  Password
                  {isLogin && <a href="#" className="text-xs hover:underline" style={{ color: 'var(--accent-purple)' }}>Forgot?</a>}
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-300"
                  style={{
                    background: 'var(--glass-bg)',
                    border: '1px solid var(--glass-border)',
                    color: 'var(--text-primary)',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent-purple)';
                    e.currentTarget.style.boxShadow = '0 0 0 4px rgba(139, 92, 246, 0.15)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'var(--glass-border)';
                    e.currentTarget.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.1)';
                  }}
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02, translateY: -2 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-3.5 mt-2 rounded-xl font-bold text-white transition-all duration-300 relative overflow-hidden group"
                style={{
                  background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                  boxShadow: '0 8px 20px rgba(139, 92, 246, 0.3)',
                }}
              >
                <span className="relative z-10">{isLogin ? 'Sign In' : 'Sign Up'}</span>
                <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
              </motion.button>

              <div className="text-center mt-4">
                <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="font-bold hover:underline transition-colors focus:outline-none"
                    style={{ color: 'var(--accent-cyan)' }}
                  >
                    {isLogin ? 'Sign up' : 'Sign in'}
                  </button>
                </p>
              </div>
            </form>
          </GlassCard>
        </BorderGlow>
      </div>
    </div>
  );
};
