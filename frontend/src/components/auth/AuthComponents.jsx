import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Floating label input component
export function AuthInput({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required,
  minLength,
  maxLength,
  helperText,
  error,
  icon,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const hasValue = value && value.length > 0;

  return (
    <div className="relative group">
      {/* Input container */}
      <div
        className={`
          relative rounded-xl overflow-hidden transition-all duration-300
          ${isFocused ? 'ring-2 ring-violet-500/50' : ''}
          ${error ? 'ring-2 ring-red-500/50' : ''}
        `}
      >
        {/* Glow effect */}
        <div
          className={`
            absolute inset-0 opacity-0 transition-opacity duration-300
            ${isFocused ? 'opacity-100' : ''}
          `}
          style={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(6, 182, 212, 0.1))',
          }}
        />
        
        {/* Glass background */}
        <div
          className="absolute inset-0 backdrop-blur-xl"
          style={{
            background: 'rgba(15, 15, 35, 0.6)',
            boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05), inset 0 -1px 1px rgba(0,0,0,0.2)',
          }}
        />
        
        {/* Border */}
        <div
          className={`
            absolute inset-0 rounded-xl border transition-colors duration-300
            ${isFocused ? 'border-violet-500/50' : 'border-white/10'}
            ${error ? 'border-red-500/50' : ''}
          `}
        />
        
        {/* Input wrapper */}
        <div className="relative flex items-center">
          {/* Icon */}
          {icon && (
            <div
              className={`
                pl-4 transition-colors duration-300
                ${isFocused ? 'text-violet-400' : 'text-gray-500'}
              `}
            >
              {icon}
            </div>
          )}
          
          {/* Input field */}
          <input
            ref={inputRef}
            type={type}
            value={value}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            required={required}
            minLength={minLength}
            maxLength={maxLength}
            className={`
              w-full px-4 py-4 bg-transparent text-white font-mono text-sm
              placeholder-transparent focus:outline-none relative z-10
              ${icon ? 'pl-2' : ''}
            `}
            placeholder={placeholder}
          />
          
          {/* Floating label */}
          <label
            onClick={() => inputRef.current?.focus()}
            className={`
              absolute left-4 transition-all duration-300 pointer-events-none font-medium
              ${icon ? 'left-12' : ''}
              ${isFocused || hasValue
                ? 'top-1 text-xs text-violet-400'
                : 'top-1/2 -translate-y-1/2 text-sm text-gray-400'
              }
            `}
          >
            {label}
          </label>
          
          {/* Cursor highlight effect */}
          {isFocused && (
            <motion.div
              className="absolute right-4 w-0.5 h-5 bg-violet-400"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </div>
      </div>
      
      {/* Helper text / Error */}
      <AnimatePresence>
        {(helperText || error) && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className={`
              text-xs mt-2 ml-1 font-mono
              ${error ? 'text-red-400' : 'text-gray-500'}
            `}
          >
            {error || helperText}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// Primary button with gradient and effects
export function AuthButton({ children, loading, type = 'submit', onClick, variant = 'primary' }) {
  const [isPressed, setIsPressed] = useState(false);
  
  const variants = {
    primary: {
      bg: 'bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600',
      hover: 'hover:from-violet-500 hover:via-purple-500 hover:to-blue-500',
      glow: 'rgba(139, 92, 246, 0.4)',
      text: 'text-white',
    },
    secondary: {
      bg: 'bg-white/5',
      hover: 'hover:bg-white/10',
      glow: 'rgba(255, 255, 255, 0.1)',
      text: 'text-gray-300',
    },
  };
  
  const style = variants[variant];

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={loading}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      className={`
        relative w-full py-4 px-6 rounded-xl font-bold text-sm uppercase tracking-wider
        ${style.bg} ${style.hover} ${style.text}
        transition-all duration-300 overflow-hidden
        disabled:opacity-50 disabled:cursor-not-allowed
        border border-white/10
      `}
      whileHover={{ scale: 1.02, boxShadow: `0 0 30px ${style.glow}` }}
      whileTap={{ scale: 0.98 }}
      style={{
        boxShadow: `0 0 20px ${style.glow}`,
      }}
    >
      {/* Shimmer effect */}
      {loading && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
      )}
      
      {/* Ripple effect container */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading ? (
          <>
            <motion.span
              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <span>Processing...</span>
          </>
        ) : (
          children
        )}
      </span>
      
      {/* Press effect */}
      <AnimatePresence>
        {isPressed && (
          <motion.div
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white rounded-full"
            style={{ transformOrigin: 'center' }}
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// Glass card container
export function AuthCard({ children, title, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative w-full max-w-md mx-auto"
    >
      {/* Outer glow */}
      <div
        className="absolute -inset-1 rounded-3xl opacity-50 blur-xl"
        style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(6, 182, 212, 0.2))',
        }}
      />
      
      {/* Card */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(15, 15, 35, 0.7)',
          backdropFilter: 'blur(20px)',
          boxShadow: `
            0 25px 50px -12px rgba(0, 0, 0, 0.5),
            0 0 0 1px rgba(255, 255, 255, 0.05),
            inset 0 1px 1px rgba(255, 255, 255, 0.05)
          `,
        }}
      >
        {/* Top gradient line */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.5), rgba(6, 182, 212, 0.5), transparent)',
          }}
        />
        
        {/* Content */}
        <div className="p-8 md:p-10">
          {/* Header */}
          {(title || subtitle) && (
            <div className="text-center mb-8">
              {/* Logo/Icon */}
              <motion.div
                className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(6, 182, 212, 0.2))',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                }}
                whileHover={{ scale: 1.05, rotate: 5 }}
              >
                <span className="text-3xl">🧪</span>
              </motion.div>
              
              {title && (
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-3xl font-bold text-white mb-2"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {title}
                </motion.h1>
              )}
              
              {subtitle && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-gray-400 text-sm"
                >
                  {subtitle}
                </motion.p>
              )}
            </div>
          )}
          
          {children}
        </div>
        
        {/* Bottom gradient line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.3), rgba(139, 92, 246, 0.3), transparent)',
          }}
        />
      </div>
    </motion.div>
  );
}

// Divider with text
export function AuthDivider({ text = 'or' }) {
  return (
    <div className="flex items-center gap-4 my-6">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <span className="text-xs text-gray-500 uppercase tracking-wider font-mono">{text}</span>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
}

// Link style
export function AuthLink({ to, children }) {
  return (
    <motion.a
      href={to}
      className="text-violet-400 hover:text-violet-300 transition-colors font-medium relative inline-block"
      whileHover={{ scale: 1.02 }}
    >
      {children}
      <motion.span
        className="absolute bottom-0 left-0 w-full h-px bg-violet-400"
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.2 }}
      />
    </motion.a>
  );
}
