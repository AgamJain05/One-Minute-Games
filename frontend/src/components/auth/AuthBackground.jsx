import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// Animated code streams component
const CodeStream = ({ delay = 0, left }) => {
  const codeSnippets = [
    'const app = express();',
    'npm install --save',
    'git commit -m "feat"',
    'docker build -t app',
    'async function main()',
    'return await fetch()',
    'export default App',
    'import React from',
    'console.log(data)',
    'mongoose.connect()',
    'jwt.verify(token)',
    'bcrypt.hash(pwd)',
  ];
  
  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: '100vh', opacity: [0, 1, 1, 0] }}
      transition={{
        duration: 8 + Math.random() * 4,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
      className="absolute text-xs font-mono text-violet-500/30 whitespace-nowrap"
      style={{ left: `${left}%` }}
    >
      {codeSnippets[Math.floor(Math.random() * codeSnippets.length)]}
    </motion.div>
  );
};

// Floating particles
const Particle = ({ delay = 0 }) => {
  const size = 2 + Math.random() * 4;
  const initialX = Math.random() * 100;
  const initialY = Math.random() * 100;
  
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        left: `${initialX}%`,
        top: `${initialY}%`,
        background: `radial-gradient(circle, ${
          Math.random() > 0.5 ? 'rgba(139, 92, 246, 0.6)' : 'rgba(6, 182, 212, 0.6)'
        }, transparent)`,
      }}
      animate={{
        y: [0, -30, 0],
        x: [0, Math.random() * 20 - 10, 0],
        opacity: [0.3, 0.8, 0.3],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 3 + Math.random() * 2,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
};

// Grid lines
const GridLines = () => (
  <div className="absolute inset-0 overflow-hidden opacity-20">
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(139, 92, 246, 0.1) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }}
    />
  </div>
);

export default function AuthBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Main gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a1a] via-[#1a0a2e] to-[#0a1628]" />
      
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
          top: '-10%',
          right: '-10%',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, transparent 70%)',
          bottom: '-10%',
          left: '-10%',
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      />
      
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />
      
      {/* Grid pattern */}
      <GridLines />
      
      {/* Code streams */}
      {[...Array(12)].map((_, i) => (
        <CodeStream key={i} delay={i * 0.8} left={5 + i * 8} />
      ))}
      
      {/* Floating particles */}
      {[...Array(30)].map((_, i) => (
        <Particle key={i} delay={i * 0.2} />
      ))}
      
      {/* Vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)',
        }}
      />
      
      {/* Scanline effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
        }}
      />
    </div>
  );
}
