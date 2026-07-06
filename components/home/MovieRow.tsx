'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { Movie } from '@/types';
import MovieCard from '@/components/movie/MovieCard';

interface MovieRowProps {
  title: string;
  emoji?: string;
  movies: Movie[];
  seeAllHref?: string;
  cardSize?: 'sm' | 'md' | 'lg';
}

export default function MovieRow({
  title,
  emoji,
  movies,
  seeAllHref,
  cardSize = 'md',
}: MovieRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'right' ? 360 : -360, behavior: 'smooth' });
  };

  if (!movies.length) return null;

  return (
    <section style={{ marginBottom: 40, position: 'relative' }}>
      {/* Header */}
      <div className="section-header">
        <h2 className="section-title">
          {emoji && <span>{emoji}</span>}
          {title}
        </h2>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {seeAllHref && (
            <Link
              href={seeAllHref}
              style={{
                fontSize: '0.82rem',
                color: 'var(--color-neon-blue)',
                textDecoration: 'none',
                fontWeight: 600,
                opacity: 0.8,
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => { (e.target as HTMLElement).style.opacity = '1'; }}
              onMouseLeave={e => { (e.target as HTMLElement).style.opacity = '0.8'; }}
            >
              Xem tất cả →
            </Link>
          )}
          {/* Scroll buttons */}
          <button
            onClick={() => scroll('left')}
            aria-label="Cuộn trái"
            style={scrollBtnStyle}
          >◀</button>
          <button
            onClick={() => scroll('right')}
            aria-label="Cuộn phải"
            style={scrollBtnStyle}
          >▶</button>
        </div>
      </div>

      {/* Scroll container */}
      <div
        ref={scrollRef}
        className="movie-row-scroll"
        style={{ paddingBottom: 16 }}
      >
        {movies.map((movie, i) => (
          <MovieCard key={movie.id} movie={movie} size={cardSize} index={i} />
        ))}
      </div>
    </section>
  );
}

const scrollBtnStyle: React.CSSProperties = {
  width: 32, height: 32,
  borderRadius: '50%',
  background: 'rgba(255,255,255,0.07)',
  border: '1px solid rgba(255,255,255,0.12)',
  color: 'var(--color-text-secondary)',
  cursor: 'pointer',
  fontSize: '0.65rem',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  transition: 'all 0.2s ease',
};
