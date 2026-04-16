import React, { useState } from 'react';
import { motion } from 'framer-motion';
import BorderGlow from './BorderGlow';
import { GlassCard } from './glass/GlassCard';
import { WebcamPixelGrid } from '@/components/ui/webcam-pixel-grid';

interface AuthPageProps {
  onLoginSuccess: () => void;
}

const ConditionItem: React.FC<{ label: string; satisfied: boolean }> = ({ label, satisfied }) => (
  <li className="flex items-center gap-2.5 transition-all duration-300">
    <div 
      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${satisfied ? 'bg-emerald-400' : 'bg-white/20'}`}
      style={{ boxShadow: satisfied ? '0 0 8px rgba(52, 211, 153, 0.5)' : 'none' }}
    />
    <span 
      className={`text-xs font-medium transition-all duration-300 ${satisfied ? 'text-emerald-400' : 'text-white/40'}`}
    >
      {label}
    </span>
  </li>
);

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password validation logic
  const validations = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    match: password !== '' && password === confirmPassword,
    notCommon: !['123456', 'password', 'qwerty', '12345678'].includes(password.toLowerCase())
  };

  const isSignupValid = !isLogin && 
    validations.length && 
    validations.uppercase && 
    validations.lowercase && 
    validations.number && 
    validations.special && 
    validations.match && 
    validations.notCommon;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLogin && !isSignupValid) return;
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
                <div className="relative group/input">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pr-12 rounded-xl outline-none transition-all duration-300"
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
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-white/10 transition-colors"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {showPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-10-7-10-7a22.28 22.28 0 0 1 2.18-3.26M10.12 10.12a3 3 0 0 0 4.24 4.24"/><path d="M1 1l22 22"/><path d="M9.88 9.88A3 3 0 1 0 14.12 14.12"/><path d="M17.36 17.36l-1.36-1.36"/><path d="M2.18 3.26A22.28 22.28 0 0 1 12 4c7 0 10 7 10 7 a22.28 22.28 0 0 1-2.18 3.26"/></svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                    )}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-bold ml-1" style={{ color: 'var(--text-primary)' }}>Confirm Password</label>
                    <div className="relative group/input">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 pr-12 rounded-xl outline-none transition-all duration-300"
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
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-white/10 transition-colors"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {showConfirmPassword ? (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-10-7-10-7a22.28 22.28 0 0 1 2.18-3.26M10.12 10.12a3 3 0 0 0 4.24 4.24"/><path d="M1 1l22 22"/><path d="M9.88 9.88A3 3 0 1 0 14.12 14.12"/><path d="M17.36 17.36l-1.36-1.36"/><path d="M2.18 3.26A22.28 22.28 0 0 1 12 4c7 0 10 7 10 7 a22.28 22.28 0 0 1-2.18 3.26"/></svg>
                        ) : (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                        )}
                      </button>
                    </div>
                  </div>

                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="flex flex-col gap-2 p-4 rounded-2xl overflow-hidden mt-1"
                    style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--glass-border-subtle)' }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">🔐</span>
                      <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Basic Password Conditions</h3>
                    </div>
                    <ul className="flex flex-col gap-1.5">
                      <ConditionItem label="Minimum 8 characters long" satisfied={validations.length} />
                      <ConditionItem label="At least 1 uppercase letter (A-Z)" satisfied={validations.uppercase} />
                      <ConditionItem label="At least 1 lowercase letter (a-z)" satisfied={validations.lowercase} />
                      <ConditionItem label="At least 1 number (0-9)" satisfied={validations.number} />
                      <ConditionItem label="At least 1 special symbol (!@#$%^&*)" satisfied={validations.special} />
                      <ConditionItem label="No common passwords (like 123456)" satisfied={validations.notCommon} />
                      <ConditionItem label="Password must match confirm password" satisfied={validations.match} />
                    </ul>
                  </motion.div>
                </>
              )}

              <motion.button
                whileHover={{ scale: isLogin || isSignupValid ? 1.02 : 1, translateY: isLogin || isSignupValid ? -2 : 0 }}
                whileTap={{ scale: isLogin || isSignupValid ? 0.98 : 1 }}
                type="submit"
                disabled={!isLogin && !isSignupValid}
                className={`w-full py-3.5 mt-2 rounded-xl font-bold text-white transition-all duration-300 relative overflow-hidden group ${(!isLogin && !isSignupValid) ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                style={{
                  background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                  boxShadow: (isLogin || isSignupValid) ? '0 8px 20px rgba(139, 92, 246, 0.3)' : 'none',
                }}
              >
                <span className="relative z-10">{isLogin ? 'Sign In' : 'Sign Up'}</span>
                {(isLogin || isSignupValid) && <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />}
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
