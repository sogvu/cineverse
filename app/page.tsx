'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import HeroCarousel from '@/components/home/HeroCarousel';
import MovieRow from '@/components/home/MovieRow';
import {
  getFeaturedMovies, getHotMovies, getNewMovies,
  getSeriesMovies, getSingleMovies, getAnimationMovies,
  getKoreanMovies, mockMovies,
} from '@/data/mockMovies';
import { useUIStore } from '@/store/uiStore';
import { DeviceTier } from '@/types';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.12, duration: 0.5 },
  }),
};

export default function HomePage() {
  const setDeviceTier = useUIStore(s => s.setDeviceTier);

  // Detect device performance on mount
  useEffect(() => {
    const gl = document.createElement('canvas').getContext('webgl');
    if (!gl) { setDeviceTier('low'); return; }
    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : '';
    const r = renderer.toLowerCase();
    const tier: DeviceTier =
      r.includes('intel') || r.includes('apple') ? 'medium' :
      r.includes('llvm') || r.includes('swiftshader') ? 'low' : 'high';
    setDeviceTier(tier);
  }, [setDeviceTier]);

  const rows = [
    { title: 'Mới Cập Nhật', emoji: '✨', movies: getNewMovies(), href: '/search?filter=new' },
    { title: 'Đang Thịnh Hành', emoji: '🔥', movies: getHotMovies(), href: '/search?filter=hot' },
    { title: 'Phim Lẻ', emoji: '🎬', movies: getSingleMovies(), href: '/category/phim-le' },
    { title: 'Phim Bộ', emoji: '📺', movies: getSeriesMovies(), href: '/category/phim-bo' },
    { title: 'Phim Hoạt Hình', emoji: '🌸', movies: getAnimationMovies(), href: '/category/hoat-hinh' },
    { title: 'Phim Hàn Quốc', emoji: '🇰🇷', movies: getKoreanMovies(), href: '/category/han-quoc' },
    { title: 'Tất Cả Phim', emoji: '🍿', movies: mockMovies, href: '/search' },
  ];

  return (
    <div className="page-enter">
      {/* ── Hero Carousel ── */}
      <HeroCarousel movies={getFeaturedMovies()} />

      {/* ── Stats bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{
          background: 'linear-gradient(90deg, rgba(0,212,255,0.08), rgba(124,58,237,0.08), rgba(255,0,110,0.08))',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 16,
          padding: '20px 32px',
          margin: '0 clamp(16px, 4vw, 80px) 48px',
          display: 'flex',
          justifyContent: 'space-around',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        {[
          { label: 'Phim & Series', value: '10,000+', icon: '🎬' },
          { label: 'Thành viên', value: '2.5M+', icon: '👥' },
          { label: 'Chất lượng', value: '4K UHD', icon: '🖥️' },
          { label: 'Lượt xem / ngày', value: '500K+', icon: '👁️' },
        ].map(s => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>{s.icon}</div>
            <div style={{
              fontSize: 'clamp(1.1rem, 2.5vw, 1.6rem)',
              fontWeight: 800,
              background: 'var(--gradient-neon)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>{s.value}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>{s.label}</div>
          </div>
        ))}
      </motion.div>

      {/* ── Movie Rows ── */}
      <div className="container-cv">
        {rows.map((row, i) => (
          <motion.div
            key={row.title}
            custom={i}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            <MovieRow
              title={row.title}
              emoji={row.emoji}
              movies={row.movies}
              seeAllHref={row.href}
            />
          </motion.div>
        ))}
      </div>


    </div>
  );
}
