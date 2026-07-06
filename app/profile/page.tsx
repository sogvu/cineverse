'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useUserStore } from '@/store/userStore';
import { mockMovies } from '@/data/mockMovies';
import MovieCard from '@/components/movie/MovieCard';
import Link from 'next/link';

export default function ProfilePage() {
  const router = useRouter();
  const { isLoggedIn, user, watchlist, watchHistory, logout } = useUserStore();

  if (!isLoggedIn || !user) {
    return (
      <div style={{
        minHeight: 'calc(100vh - var(--navbar-height))',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        textAlign: 'center',
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            background: 'rgba(255,255,255,0.03)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 24,
            padding: '48px 32px',
            maxWidth: 400,
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          }}
        >
          <div style={{ fontSize: '4rem', marginBottom: 20 }}>🔒</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 12 }}>Bạn chưa đăng nhập</h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.88rem', marginBottom: 24, lineHeight: 1.5 }}>
            Vui lòng đăng nhập hoặc đăng ký tài khoản để xem watchlist, lịch sử xem phim và đồng bộ tiến độ.
          </p>
          <Link href="/auth">
            <button className="btn-primary" style={{ padding: '10px 24px', fontSize: '0.9rem' }}>
              <span>Đăng nhập ngay</span>
            </button>
          </Link>
        </motion.div>
      </div>
    );
  }

  // Load movies details in watchlist and history
  const watchlistMovies = mockMovies.filter(m => watchlist.includes(m.id));
  
  // Format watch history
  const historyItems = watchHistory
    .map(hist => {
      const movie = mockMovies.find(m => m.id === hist.movieId);
      if (!movie) return null;
      return {
        ...hist,
        movie,
      };
    })
    .filter(Boolean) as any[];

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Math stats
  const totalWatched = watchHistory.length;
  const likedCount = watchlist.length;
  const historyProgress = watchHistory.length > 0
    ? Math.round(watchHistory.reduce((acc, h) => acc + (h.progress / (h.duration || 1) * 100), 0) / watchHistory.length)
    : 0;

  return (
    <div className="page-enter container-cv" style={{ paddingTop: 40, paddingBottom: 80 }}>
      {/* ── Profile Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'linear-gradient(135deg, rgba(0,212,255,0.06), rgba(124,58,237,0.06))',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 24,
          padding: '32px clamp(16px, 4vw, 40px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 24,
          marginBottom: 48,
          boxShadow: '0 12px 30px rgba(0,0,0,0.3)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
            boxShadow: '0 0 20px rgba(0,212,255,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', fontWeight: 800, color: 'white',
          }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 4 }}>{user.name}</h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>{user.email}</p>
            <span style={{
              display: 'inline-block',
              marginTop: 8,
              padding: '3px 8px',
              borderRadius: 6,
              background: 'rgba(255,255,255,0.05)',
              fontSize: '0.72rem',
              color: 'var(--color-text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              fontWeight: 600,
            }}>
              Đăng nhập qua {(user as { provider?: string }).provider ?? 'email'}
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="btn-ghost"
          style={{
            borderColor: 'rgba(239, 68, 68, 0.4)',
            color: '#f87171',
            padding: '10px 20px',
            fontSize: '0.85rem',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
        >
          Đăng Xuất
        </button>
      </motion.div>

      {/* ── Stats Row ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 16,
        marginBottom: 48,
      }}>
        {[
          { label: 'Phim yêu thích', value: likedCount, icon: '💙', color: '#00d4ff' },
          { label: 'Đã xem', value: totalWatched, icon: '👁️', color: '#10b981' },
          { label: 'Hoàn thành trung bình', value: `${historyProgress}%`, icon: '📊', color: '#7c3aed' },
        ].map((s, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: 16,
              padding: 20,
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '1.8rem', marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color, marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* ── Watchlist Section ── */}
      <section style={{ marginBottom: 50 }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
          💙 Phim Yêu Thích <span>({watchlistMovies.length})</span>
        </h2>
        {watchlistMovies.length === 0 ? (
          <div style={{
            background: 'rgba(255,255,255,0.01)',
            border: '1px dashed rgba(255,255,255,0.1)',
            borderRadius: 16,
            padding: '40px 0',
            textAlign: 'center',
            color: 'var(--color-text-muted)',
          }}>
            Bạn chưa thêm phim nào vào danh sách yêu thích.
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: 16,
          }}>
            {watchlistMovies.map((movie, idx) => (
              <MovieCard key={movie.id} movie={movie} size="sm" index={idx} />
            ))}
          </div>
        )}
      </section>

      {/* ── Watch History Section ── */}
      <section>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
          ⏱️ Lịch Sử Xem Phim <span>({historyItems.length})</span>
        </h2>
        {historyItems.length === 0 ? (
          <div style={{
            background: 'rgba(255,255,255,0.01)',
            border: '1px dashed rgba(255,255,255,0.1)',
            borderRadius: 16,
            padding: '40px 0',
            textAlign: 'center',
            color: 'var(--color-text-muted)',
          }}>
            Lịch sử xem phim trống.
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 16,
          }}>
            {historyItems.map((item, idx) => {
              const pct = Math.round((item.progress / (item.duration || 1)) * 100);
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: 12,
                    padding: 12,
                    display: 'flex',
                    gap: 12,
                    alignItems: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <Link href={`/movie/${item.movie.id}`} style={{ flexShrink: 0, textDecoration: 'none' }}>
                    <div style={{ width: 60, height: 90, borderRadius: 6, overflow: 'hidden' }}>
                      <img src={item.movie.poster} alt={item.movie.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  </Link>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Link href={`/movie/${item.movie.id}`} style={{ textDecoration: 'none', color: 'white' }}>
                      <h4 style={{
                        fontSize: '0.88rem',
                        fontWeight: 700,
                        marginBottom: 4,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }} className="hover-neon">
                        {item.movie.title}
                      </h4>
                    </Link>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: 10 }}>
                      Tiến độ: {pct}%
                    </p>
                    {/* Progress Bar */}
                    <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, position: 'relative' }}>
                      <div style={{
                        position: 'absolute', left: 0, top: 0, bottom: 0,
                        width: `${pct}%`,
                        background: 'linear-gradient(90deg, #00d4ff, #7c3aed)',
                        borderRadius: 2,
                      }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, alignItems: 'center' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                        {new Date(item.watchedAt).toLocaleDateString('vi-VN')}
                      </span>
                      <Link href={`/watch/${item.movie.id}`} style={{ textDecoration: 'none' }}>
                        <span style={{ fontSize: '0.75rem', color: '#00d4ff', fontWeight: 700 }} className="hover-neon">
                          Xem tiếp →
                        </span>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
