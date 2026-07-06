'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Movie } from '@/types';
import { useUserStore } from '@/store/userStore';
import { useUIStore } from '@/store/uiStore';

interface MovieCardProps {
  movie: Movie;
  size?: 'sm' | 'md' | 'lg';
  index?: number;
}

const SIZE_MAP = {
  sm: { width: 140, height: 210, fontSize: '0.75rem' },
  md: { width: 180, height: 270, fontSize: '0.8rem' },
  lg: { width: 220, height: 330, fontSize: '0.85rem' },
};

export default function MovieCard({ movie, size = 'md', index = 0 }: MovieCardProps) {
  const [hovered, setHovered] = useState(false);
  const { width, height, fontSize } = SIZE_MAP[size];
  const { isInWatchlist, toggleWatchlist, isLoggedIn } = useUserStore();
  const { openTrailer } = useUIStore();
  const inWL = isInWatchlist(movie.id);

  const handleWatchlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) { window.location.href = '/auth'; return; }
    toggleWatchlist(movie.id);
  };

  const handleTrailer = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (movie.trailer) openTrailer(movie.trailer);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      style={{ position: 'relative', flexShrink: 0 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={`/movie/${movie.id}`} style={{ textDecoration: 'none', display: 'block' }}>
        <div
          style={{
            width,
            height,
            borderRadius: 12,
            overflow: 'hidden',
            position: 'relative',
            cursor: 'pointer',
            transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s ease',
            transform: hovered ? 'translateY(-10px) scale(1.04)' : 'none',
            boxShadow: hovered
              ? '0 24px 60px rgba(0,0,0,0.6), 0 0 30px rgba(0,212,255,0.25)'
              : '0 8px 24px rgba(0,0,0,0.4)',
          }}
        >
          {/* Poster */}
          <img
            src={movie.poster}
            alt={movie.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            loading="lazy"
          />

          {/* Badges */}
          <div style={{
            position: 'absolute', top: 8, left: 8,
            display: 'flex', flexDirection: 'column', gap: 4,
          }}>
            {movie.isNew && <span className="badge badge-new">MỚI</span>}
            {movie.isHot && <span className="badge badge-hot">HOT</span>}
          </div>

          {/* Rating top-right */}
          <div style={{
            position: 'absolute', top: 8, right: 8,
            background: 'rgba(0,0,0,0.7)',
            borderRadius: 8,
            padding: '3px 8px',
            display: 'flex', alignItems: 'center', gap: 3,
            fontSize: '0.72rem', fontWeight: 700, color: '#fbbf24',
          }}>
            ⭐ {movie.cvRating.toFixed(1)}
          </div>

          {/* Hover overlay */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(5,8,16,0.98) 0%, rgba(5,8,16,0.6) 60%, transparent 100%)',
                  display: 'flex', flexDirection: 'column',
                  justifyContent: 'flex-end', padding: '12px 10px 10px',
                }}
              >
                {/* Title */}
                <p style={{
                  fontSize, fontWeight: 700,
                  color: '#fff', marginBottom: 4,
                  lineHeight: 1.3,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}>
                  {movie.title}
                </p>

                {/* Meta */}
                <p style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)', marginBottom: 10 }}>
                  {movie.year} · {movie.type === 'series' ? `${movie.totalEpisodes} tập` : `${movie.duration} phút`}
                  {' · '}{movie.country}
                </p>

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: 6 }}>
                  <Link
                    href={`/watch/${movie.id}`}
                    style={{
                      flex: 1, padding: '7px 0',
                      background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
                      borderRadius: 8, textAlign: 'center',
                      fontSize: '0.75rem', fontWeight: 700, color: '#fff',
                      textDecoration: 'none',
                    }}
                    onClick={e => e.stopPropagation()}
                  >
                    ▶ Xem
                  </Link>
                  {movie.trailer && (
                    <button
                      onClick={handleTrailer}
                      style={{
                        padding: '7px 10px',
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: 8, cursor: 'pointer',
                        fontSize: '0.75rem', color: '#fff',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      🎬
                    </button>
                  )}
                  <button
                    onClick={handleWatchlist}
                    style={{
                      padding: '7px 10px',
                      background: inWL ? 'rgba(0,212,255,0.2)' : 'rgba(255,255,255,0.1)',
                      border: `1px solid ${inWL ? 'rgba(0,212,255,0.5)' : 'rgba(255,255,255,0.2)'}`,
                      borderRadius: 8, cursor: 'pointer',
                      fontSize: '0.75rem',
                    }}
                  >
                    {inWL ? '💙' : '🤍'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Series episode badge */}
          {movie.type === 'series' && movie.status === 'ongoing' && (
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              background: 'linear-gradient(transparent, rgba(0,0,0,0.9))',
              padding: '16px 8px 8px',
              fontSize: '0.68rem', color: '#10b981', fontWeight: 700,
            }}>
              Tập {movie.currentEpisode}/{movie.totalEpisodes}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
