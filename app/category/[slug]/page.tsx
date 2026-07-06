'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import { mockMovies } from '@/data/mockMovies';
import MovieCard from '@/components/movie/MovieCard';

interface Props {
  params: Promise<{ slug: string }>;
}

const CATEGORY_MAP: Record<string, { title: string; filter: (m: typeof mockMovies[0]) => boolean; description: string; emoji: string }> = {
  'phim-le': {
    title: 'Phim Lẻ',
    emoji: '🎬',
    description: 'Tuyển tập phim lẻ chiếu rạp, phim điện ảnh bom tấn chất lượng cao, vietsub & thuyết minh đầy đủ.',
    filter: (m) => m.type === 'movie',
  },
  'phim-bo': {
    title: 'Phim Bộ',
    emoji: '📺',
    description: 'Trọn bộ phim truyền hình hot nhất từ các quốc gia, tập mới cập nhật liên tục mỗi ngày.',
    filter: (m) => m.type === 'series',
  },
  'hoat-hinh': {
    title: 'Hoạt Hình Anime',
    emoji: '🌸',
    description: 'Thế giới hoạt hình nhiều màu sắc, Anime Nhật Bản đỉnh cao cùng các bộ phim hoạt hình 3D hấp dẫn.',
    filter: (m) => m.genres.includes('Hoạt hình'),
  },
  'han-quoc': {
    title: 'Phim Hàn Quốc',
    emoji: '🇰🇷',
    description: 'Tuyển tập phim truyền hình và điện ảnh Hàn Quốc hay nhất, lãng mạn, kịch tính, cảm động.',
    filter: (m) => m.country === 'Hàn Quốc',
  },
};

export default function CategoryPage({ params }: Props) {
  const { slug } = use(params);
  const category = CATEGORY_MAP[slug];

  if (!category) {
    notFound();
  }

  const movies = mockMovies.filter(category.filter);

  return (
    <div className="page-enter container-cv" style={{ paddingTop: 40, paddingBottom: 80 }}>
      {/* Category Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          paddingBottom: 24,
          marginBottom: 40,
        }}
      >
        <h1 style={{
          fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 10,
        }}>
          <span>{category.emoji}</span> {category.title}
        </h1>
        <p style={{
          color: 'var(--color-text-secondary)',
          fontSize: '0.95rem',
          lineHeight: 1.6,
          maxWidth: 600,
        }}>
          {category.description}
        </p>
      </motion.div>

      {/* Movies Grid */}
      {movies.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--color-text-muted)' }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>🎥</div>
          <p>Hiện tại chưa có phim nào trong danh mục này.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: 20,
        }}>
          {movies.map((movie, idx) => (
            <MovieCard key={movie.id} movie={movie} size="sm" index={idx} />
          ))}
        </div>
      )}
    </div>
  );
}
