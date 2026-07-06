'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useUIStore } from '@/store/uiStore';

export default function TrailerModal() {
  const { trailerUrl, closeTrailer } = useUIStore();

  // Convert YouTube watch URL → embed URL
  const embedUrl = trailerUrl
    ? trailerUrl
        .replace('watch?v=', 'embed/')
        .replace('youtu.be/', 'www.youtube.com/embed/')
      + '?autoplay=1&rel=0'
    : null;

  return (
    <AnimatePresence>
      {embedUrl && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={closeTrailer}
          style={{
            position: 'fixed', inset: 0, zIndex: 200,
            background: 'rgba(0,0,0,0.92)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '24px',
            backdropFilter: 'blur(8px)',
          }}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: 920,
              aspectRatio: '16/9',
              borderRadius: 16,
              overflow: 'hidden',
              boxShadow: '0 0 80px rgba(0,212,255,0.3), 0 40px 100px rgba(0,0,0,0.8)',
              border: '1px solid rgba(0,212,255,0.2)',
              position: 'relative',
            }}
          >
            <iframe
              src={embedUrl}
              title="Trailer"
              style={{ width: '100%', height: '100%', border: 'none' }}
              allow="autoplay; fullscreen"
              allowFullScreen
            />
            <button
              onClick={closeTrailer}
              aria-label="Đóng trailer"
              style={{
                position: 'absolute', top: 12, right: 12,
                width: 36, height: 36,
                borderRadius: '50%',
                background: 'rgba(0,0,0,0.7)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'white',
                fontSize: '1rem',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >✕</button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
