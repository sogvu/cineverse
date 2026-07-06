'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Movie } from '@/types';
import { useUIStore } from '@/store/uiStore';

interface HeroCarouselProps {
  movies: Movie[];
}

export default function HeroCarousel({ movies }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const { openTrailer } = useUIStore();

  const go = useCallback((idx: number, dir = 1) => {
    setDirection(dir);
    setCurrent(idx);
  }, []);

  const next = useCallback(() => {
    go((current + 1) % movies.length, 1);
  }, [current, movies.length, go]);

  const prev = useCallback(() => {
    go((current - 1 + movies.length) % movies.length, -1);
  }, [current, movies.length, go]);

  // Auto-advance
  useEffect(() => {
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [next]);

  const movie = movies[current];

  const variants = {
    enter:  (d: number) => ({ x: d > 0 ? '8%' : '-8%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:   (d: number) => ({ x: d > 0 ? '-8%' : '8%', opacity: 0 }),
  };

  return (
    <div
      style={{
        position: 'relative',
        height: 'clamp(480px, 75vh, 720px)',
        overflow: 'hidden',
        borderRadius: 0,
        marginBottom: 48,
      }}
    >
      <AnimatePresence custom={direction} mode="wait">
        <motion.div
          key={movie.id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ position: 'absolute', inset: 0 }}
        >
          {/* Backdrop */}
          <div style={{ position: 'absolute', inset: 0 }}>
            <img
              src={movie.backdrop}
              alt={movie.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Gradients */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to right, rgba(5,8,16,0.97) 35%, rgba(5,8,16,0.5) 65%, rgba(5,8,16,0.2) 100%)',
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(5,8,16,1) 0%, transparent 50%)',
          }} />

          {/* Content */}
          <div
            className="container-cv"
            style={{
              position: 'relative', zIndex: 2,
              height: '100%', display: 'flex',
              flexDirection: 'column', justifyContent: 'flex-end',
              paddingBottom: '72px',
            }}
          >
            {/* Badges */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
              {movie.isHot && <span className="badge badge-hot">🔥 HOT</span>}
              {movie.isNew && <span className="badge badge-new">✨ MỚI</span>}
              {movie.imdbRating && (
                <span className="badge badge-rating">⭐ IMDb {movie.imdbRating}</span>
              )}
              <span className="badge badge-hd">
                {movie.quality[0]}
              </span>
            </div>

            {/* Title */}
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              style={{
                fontSize: 'clamp(1.8rem, 5vw, 3.5rem)',
                fontWeight: 900,
                lineHeight: 1.1,
                marginBottom: 8,
                maxWidth: 620,
                color: '#fff',
              }}
            >
              {movie.title}
            </motion.h1>

            {/* Original title + year + meta */}
            <motion.p
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              style={{
                color: 'var(--color-text-secondary)',
                fontSize: '0.9rem',
                marginBottom: 14,
                fontWeight: 400,
              }}
            >
              {movie.originalTitle && movie.originalTitle !== movie.title && (
                <>{movie.originalTitle} · </>
              )}
              {movie.year}
              {movie.type === 'series' ? ` · ${movie.totalEpisodes} tập` : movie.duration ? ` · ${movie.duration} phút` : ''}
              {' · '}{movie.country}
            </motion.p>

            {/* Genres */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}
            >
              {movie.genres.slice(0, 3).map(g => (
                <span key={g} style={{
                  padding: '3px 12px',
                  borderRadius: 20,
                  border: '1px solid rgba(255,255,255,0.15)',
                  fontSize: '0.75rem',
                  color: 'var(--color-text-secondary)',
                  fontWeight: 500,
                }}>
                  {g}
                </span>
              ))}
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              style={{
                maxWidth: 480,
                fontSize: '0.9rem',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.65,
                marginBottom: 28,
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {movie.description}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}
            >
              <Link href={`/watch/${movie.id}`}>
                <button className="btn-primary" style={{ fontSize: '0.95rem', padding: '12px 32px' }}>
                  <span>▶ Xem Ngay</span>
                </button>
              </Link>
              {movie.trailer && (
                <button
                  className="btn-ghost"
                  onClick={() => openTrailer(movie.trailer!)}
                  style={{ fontSize: '0.95rem' }}
                >
                  🎬 Xem Trailer
                </button>
              )}
              <Link href={`/movie/${movie.id}`}>
                <button className="btn-ghost" style={{ fontSize: '0.95rem' }}>
                  ℹ️ Chi Tiết
                </button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation arrows */}
      <button
        onClick={prev}
        aria-label="Phim trước"
        style={{ ...arrowBtnStyle, left: 20 }}
      >‹</button>
      <button
        onClick={next}
        aria-label="Phim tiếp"
        style={{ ...arrowBtnStyle, right: 20 }}
      >›</button>

      {/* Dot indicators */}
      <div style={{
        position: 'absolute', bottom: 28, left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex', gap: 8, zIndex: 10,
      }}>
        {movies.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i, i > current ? 1 : -1)}
            aria-label={`Slide ${i + 1}`}
            style={{
              width: i === current ? 24 : 8,
              height: 8,
              borderRadius: 4,
              border: 'none',
              cursor: 'pointer',
              background: i === current ? 'var(--color-neon-blue)' : 'rgba(255,255,255,0.3)',
              boxShadow: i === current ? 'var(--glow-blue)' : 'none',
              transition: 'all 0.3s ease',
              padding: 0,
            }}
          />
        ))}
      </div>

      {/* Thumbnail strip */}
      <div style={{
        position: 'absolute', bottom: 0, right: '4%',
        display: 'flex', gap: 10,
        paddingBottom: 12,
        zIndex: 5,
      }}>
        {movies.slice(0, 5).map((m, i) => (
          <button
            key={m.id}
            onClick={() => go(i, i > current ? 1 : -1)}
            style={{
              width: 52, height: 78,
              borderRadius: 6,
              overflow: 'hidden',
              border: i === current
                ? '2px solid var(--color-neon-blue)'
                : '2px solid transparent',
              boxShadow: i === current ? 'var(--glow-blue)' : 'none',
              opacity: i === current ? 1 : 0.5,
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              background: 'none',
              padding: 0,
              flexShrink: 0,
            }}
          >
            <img src={m.poster} alt={m.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </button>
        ))}
      </div>
    </div>
  );
}

const arrowBtnStyle: React.CSSProperties = {
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 10,
  width: 44, height: 44,
  borderRadius: '50%',
  background: 'rgba(0,0,0,0.5)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255,255,255,0.15)',
  color: 'white',
  fontSize: '1.5rem',
  cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  transition: 'all 0.2s ease',
};
