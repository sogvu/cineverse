'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface SpeechBubbleProps {
  text: string;
}

export default function SpeechBubble({ text }: SpeechBubbleProps) {
  return (
    <AnimatePresence>
      <motion.div
        key={text}
        initial={{ scale: 0, y: 10, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0, y: 10, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        style={{
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: '8px',
          background: 'rgba(10, 13, 26, 0.95)',
          border: '1.5px solid rgba(0, 212, 255, 0.4)',
          borderRadius: '16px',
          padding: '8px 14px',
          fontSize: '0.72rem',
          fontWeight: '600',
          color: '#f0f4ff',
          whiteSpace: 'nowrap',
          maxWidth: '200px',
          textAlign: 'center',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 0 20px rgba(0, 212, 255, 0.25), 0 4px 16px rgba(0,0,0,0.4)',
          zIndex: 50,
          lineHeight: 1.4,
          fontFamily: 'Outfit, sans-serif',
          pointerEvents: 'none',
        }}
      >
        {text}
        {/* Tail */}
        <span
          style={{
            position: 'absolute',
            bottom: '-9px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderTop: '9px solid rgba(0, 212, 255, 0.4)',
          }}
        />
        <span
          style={{
            position: 'absolute',
            bottom: '-7px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '7px solid transparent',
            borderRight: '7px solid transparent',
            borderTop: '8px solid rgba(10, 13, 26, 0.95)',
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
}
