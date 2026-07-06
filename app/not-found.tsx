'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div style={{
      minHeight: 'calc(100vh - var(--navbar-height))',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      textAlign: 'center',
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          maxWidth: 500,
          background: 'rgba(255,255,255,0.02)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 24,
          padding: '60px 40px',
          boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
        }}
      >
        {/* Animated Icon */}
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{ fontSize: '6rem', marginBottom: 20 }}
        >
          🛸
        </motion.div>

        <h1 style={{
          fontSize: '4.5rem',
          fontWeight: 900,
          background: 'var(--gradient-neon)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          lineHeight: 1.1,
          marginBottom: 16,
        }}>
          404
        </h1>

        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 12 }}>
          Lạc vào vũ trụ song song rồi!
        </h3>
        
        <p style={{
          color: 'var(--color-text-secondary)',
          fontSize: '0.9rem',
          lineHeight: 1.6,
          marginBottom: 32,
        }}>
          Trang bạn tìm kiếm không tồn tại hoặc đã được chuyển dịch sang một hệ sinh thái phim ảnh khác.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/">
            <button className="btn-primary" style={{ padding: '10px 24px', fontSize: '0.88rem' }}>
              <span>Quay Lại Trang Chủ</span>
            </button>
          </Link>
          <Link href="/search">
            <button className="btn-ghost" style={{ padding: '10px 24px', fontSize: '0.88rem' }}>
              Tìm Kiếm Phim
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
