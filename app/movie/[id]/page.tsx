'use client';

import { use, useState } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getMovieById, mockMovies } from '@/data/mockMovies';
import { useUserStore } from '@/store/userStore';
import { useUIStore } from '@/store/uiStore';
import MovieCard from '@/components/movie/MovieCard';

interface Props { params: Promise<{ id: string }> }

export default function MovieDetailPage({ params }: Props) {
  const { id } = use(params);
  const movie = getMovieById(id);
  if (!movie) notFound();

  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([
    { id: '1', name: 'Nguyễn Văn A', text: 'Phim hay quá! Recommend mạnh 💯', rating: 5, date: '2 ngày trước' },
    { id: '2', name: 'Trần Thị B', text: 'Cảnh quay đẹp, nhạc nền tuyệt vời. Xem đi các bạn!', rating: 4, date: '5 ngày trước' },
    { id: '3', name: 'Lê Văn C', text: 'Kết thúc hơi hụt hẫng nhưng tổng thể vẫn rất tốt.', rating: 4, date: '1 tuần trước' },
  ]);

  const { isInWatchlist, toggleWatchlist, isLoggedIn } = useUserStore();
  const { openTrailer } = useUIStore();
  const inWL = isInWatchlist(movie.id);

  const relatedMovies = mockMovies
    .filter(m => m.id !== movie.id && m.genres.some(g => movie.genres.includes(g)))
    .slice(0, 8);

  const submitComment = () => {
    if (!comment.trim() || !isLoggedIn) return;
    setComments(prev => [{
      id: Date.now().toString(),
      name: 'Bạn',
      text: comment,
      rating: userRating,
      date: 'Vừa xong',
    }, ...prev]);
    setComment('');
  };

  return (
    <div className="page-enter">
      {/* ── Backdrop Hero ── */}
      <div style={{ position: 'relative', height: 480, overflow: 'hidden' }}>
        <img
          src={movie.backdrop}
          alt={movie.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(5,8,16,0.3) 0%, rgba(5,8,16,0.7) 60%, var(--color-bg-primary) 100%)',
        }} />
      </div>

      {/* ── Main Content ── */}
      <div className="container-cv" style={{ marginTop: -200, position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
          {/* Poster */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ flexShrink: 0 }}
          >
            <div style={{
              width: 220, height: 330, borderRadius: 16, overflow: 'hidden',
              boxShadow: '0 24px 60px rgba(0,0,0,0.6), 0 0 40px rgba(0,212,255,0.15)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <img src={movie.poster} alt={movie.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            {/* Action buttons below poster */}
            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link href={`/watch/${movie.id}`}>
                <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  <span>▶ Xem Ngay</span>
                </button>
              </Link>
              {movie.trailer && (
                <button className="btn-ghost" style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => openTrailer(movie.trailer!)}>
                  🎬 Trailer
                </button>
              )}
              <button
                className="btn-ghost"
                style={{ width: '100%', justifyContent: 'center', borderColor: inWL ? 'rgba(0,212,255,0.5)' : undefined }}
                onClick={() => { if (!isLoggedIn) { window.location.href = '/auth'; return; } toggleWatchlist(movie.id); }}
              >
                {inWL ? '💙 Đã lưu' : '🤍 Yêu thích'}
              </button>
            </div>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            style={{ flex: 1, minWidth: 280, paddingTop: 120 }}
          >
            {/* Badges */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
              {movie.isNew && <span className="badge badge-new">MỚI</span>}
              {movie.isHot && <span className="badge badge-hot">HOT</span>}
              {movie.quality.map(q => <span key={q} className="badge badge-hd">{q}</span>)}
            </div>

            <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.8rem)', fontWeight: 900, marginBottom: 6, lineHeight: 1.15 }}>
              {movie.title}
            </h1>

            {movie.originalTitle && movie.originalTitle !== movie.title && (
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: 16, fontSize: '1rem', fontStyle: 'italic' }}>
                {movie.originalTitle}
              </p>
            )}

            {/* Ratings row */}
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 20 }}>
              {movie.imdbRating && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fbbf24' }}>
                    ⭐ {movie.imdbRating}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>IMDb</div>
                </div>
              )}
              {movie.rottenRating && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f97316' }}>
                    🍅 {movie.rottenRating}%
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Rotten Tomatoes</div>
                </div>
              )}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#00d4ff' }}>
                  {movie.cvRating.toFixed(1)}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>CineVerse</div>
              </div>
            </div>

            {/* Meta info grid */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr',
              gap: '12px 32px', marginBottom: 20,
              padding: '16px 20px',
              background: 'rgba(255,255,255,0.04)',
              borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)',
            }}>
              {[
                ['Năm', movie.year],
                ['Quốc gia', movie.country],
                ['Thể loại', movie.genres.join(', ')],
                movie.type === 'series'
                  ? ['Số tập', `${movie.totalEpisodes} tập`]
                  : ['Thời lượng', `${movie.duration} phút`],
                movie.director ? ['Đạo diễn', movie.director] : null,
                ['Phụ đề', movie.subtitles.join(', ')],
              ].filter((item): item is (string | number)[] => item !== null).map(([label, value]) => (
                <div key={String(label)}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {label}
                  </span>
                  <p style={{ fontWeight: 600, fontSize: '0.88rem', marginTop: 2 }}>{String(value)}</p>
                </div>
              ))}
            </div>

            {/* Genres */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
              {movie.genres.map(g => (
                <Link key={g} href={`/search?genre=${encodeURIComponent(g)}`}>
                  <span style={{
                    padding: '4px 14px', borderRadius: 20,
                    border: '1px solid rgba(0,212,255,0.3)',
                    fontSize: '0.78rem', color: 'var(--color-neon-blue)',
                    cursor: 'pointer', fontWeight: 500,
                    textDecoration: 'none',
                  }}>{g}</span>
                </Link>
              ))}
            </div>

            {/* Description */}
            <p style={{ lineHeight: 1.75, color: 'var(--color-text-secondary)', fontSize: '0.93rem', marginBottom: 20 }}>
              {movie.description}
            </p>

            {/* Cast */}
            <div>
              <h3 style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
                Diễn Viên
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {movie.cast.map(actor => (
                  <span key={actor} style={{
                    padding: '5px 12px', borderRadius: 8,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    fontSize: '0.8rem', fontWeight: 500,
                  }}>{actor}</span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Rating & Comments ── */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginTop: 60 }}
        >
          <h2 className="section-title" style={{ marginBottom: 24 }}>Đánh Giá & Bình Luận</h2>

          {/* Rating input */}
          <div style={{
            background: 'rgba(255,255,255,0.03)', borderRadius: 16,
            border: '1px solid rgba(255,255,255,0.07)', padding: '24px',
            marginBottom: 24,
          }}>
            <p style={{ marginBottom: 12, fontWeight: 600 }}>Đánh giá của bạn:</p>
            <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
              {[1,2,3,4,5].map(star => (
                <button
                  key={star}
                  className={`star-btn ${(hoverRating || userRating) >= star ? 'active' : ''}`}
                  onClick={() => setUserRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  style={{ fontSize: '2rem', color: (hoverRating || userRating) >= star ? '#fbbf24' : 'var(--color-text-muted)' }}
                >★</button>
              ))}
              {userRating > 0 && (
                <span style={{ marginLeft: 8, alignSelf: 'center', color: '#fbbf24', fontWeight: 700 }}>
                  {userRating}/5
                </span>
              )}
            </div>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder={isLoggedIn ? 'Chia sẻ cảm nhận của bạn về bộ phim...' : 'Đăng nhập để bình luận...'}
              disabled={!isLoggedIn}
              style={{
                width: '100%', minHeight: 100,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 10, padding: '12px 16px',
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-primary)',
                fontSize: '0.9rem', resize: 'vertical',
                outline: 'none', marginBottom: 12,
              }}
            />
            <button
              className="btn-primary"
              onClick={submitComment}
              disabled={!comment.trim() || !isLoggedIn}
              style={{ opacity: (!comment.trim() || !isLoggedIn) ? 0.5 : 1 }}
            >
              <span>Gửi bình luận</span>
            </button>
            {!isLoggedIn && (
              <Link href="/auth" style={{ marginLeft: 12, color: 'var(--color-neon-blue)', fontSize: '0.85rem' }}>
                Đăng nhập ngay →
              </Link>
            )}
          </div>

          {/* Comments list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {comments.map(c => (
              <div key={c.id} style={{
                background: 'rgba(255,255,255,0.03)', borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.06)', padding: '16px 20px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: '0.85rem', color: 'white',
                    }}>
                      {c.name[0]}
                    </div>
                    <span style={{ fontWeight: 600 }}>{c.name}</span>
                    {c.rating > 0 && (
                      <span style={{ color: '#fbbf24', fontSize: '0.85rem' }}>
                        {'★'.repeat(c.rating)}
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{c.date}</span>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                  {c.text}
                </p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── Related Movies ── */}
        {relatedMovies.length > 0 && (
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{ marginTop: 60, marginBottom: 60 }}
          >
            <h2 className="section-title" style={{ marginBottom: 20 }}>Phim Tương Tự</h2>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {relatedMovies.map((m, i) => (
                <MovieCard key={m.id} movie={m} size="sm" index={i} />
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}
