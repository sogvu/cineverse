'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '@/store/uiStore';
import { useUserStore } from '@/store/userStore';
import { useMovieStore } from '@/store/movieStore';
import { useRouter } from 'next/navigation';

const NAV_LINKS = [
  { href: '/',          label: 'Trang Chủ' },
  { href: '/category/phim-le',  label: 'Phim Lẻ' },
  { href: '/category/phim-bo',  label: 'Phim Bộ' },
  { href: '/category/hoat-hinh', label: 'Hoạt Hình' },
  { href: '/search',    label: 'Khám Phá' },
];

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router   = useRouter();

  const { theme, toggleTheme, searchOpen, setSearchOpen } = useUIStore();
  const { isLoggedIn, user, logout } = useUserStore();
  const { setSearchQuery } = useMovieStore();

  // Detect scroll for glassmorphism effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Focus search on open
  useEffect(() => {
    if (searchOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchVal.trim()) return;
    setSearchQuery(searchVal);
    router.push(`/search?q=${encodeURIComponent(searchVal)}`);
    setSearchOpen(false);
  };

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          height: 'var(--navbar-height)',
          transition: 'background 0.3s ease, box-shadow 0.3s ease',
          background: scrolled
            ? 'rgba(5, 8, 16, 0.92)'
            : 'linear-gradient(to bottom, rgba(5,8,16,0.8), transparent)',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(0, 212, 255, 0.1)' : 'none',
        }}
      >
        <div
          className="container-cv"
          style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
          }}
        >
          {/* ── Logo ── */}
          <Link
            href="/"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.5rem',
              fontWeight: 900,
              letterSpacing: '0.05em',
              textDecoration: 'none',
              background: 'var(--gradient-neon)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              flexShrink: 0,
            }}
          >
            CINE<span style={{ WebkitTextFillColor: 'white', color: 'white' }}>VERSE</span>
          </Link>

          {/* ── Nav links (desktop) ── */}
          <div
            style={{
              display: 'flex',
              gap: '4px',
              alignItems: 'center',
            }}
            className="nav-links-desktop"
          >
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  color: 'var(--color-text-secondary)',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => {
                  (e.target as HTMLAnchorElement).style.color = '#fff';
                  (e.target as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.07)';
                }}
                onMouseLeave={e => {
                  (e.target as HTMLAnchorElement).style.color = 'var(--color-text-secondary)';
                  (e.target as HTMLAnchorElement).style.background = 'transparent';
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* ── Right Actions ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
            {/* Search toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Tìm kiếm"
              style={{
                width: 38, height: 38,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'var(--color-text-primary)',
                cursor: 'pointer',
                fontSize: '1rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => { (e.currentTarget).style.borderColor = 'var(--color-neon-blue)'; }}
              onMouseLeave={e => { (e.currentTarget).style.borderColor = 'rgba(255,255,255,0.1)'; }}
            >
              🔍
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Đổi theme"
              style={{
                width: 38, height: 38,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'var(--color-text-primary)',
                cursor: 'pointer',
                fontSize: '1rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>

            {/* Auth */}
            {isLoggedIn && user ? (
              <div style={{ position: 'relative' }}>
                <Link href="/profile" style={{ textDecoration: 'none' }}>
                  <div
                    style={{
                      width: 36, height: 36,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.85rem', fontWeight: 700, color: 'white',
                      cursor: 'pointer',
                    }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </Link>
              </div>
            ) : (
              <Link href="/auth">
                <button className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
                  <span>Đăng nhập</span>
                </button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* ── Fullscreen Search Bar ── */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'fixed',
              top: 'var(--navbar-height)',
              left: 0, right: 0,
              zIndex: 99,
              padding: '20px',
              background: 'rgba(5, 8, 16, 0.97)',
              backdropFilter: 'blur(24px)',
              borderBottom: '1px solid rgba(0, 212, 255, 0.15)',
            }}
          >
            <form onSubmit={handleSearch} style={{ maxWidth: 640, margin: '0 auto', position: 'relative' }}>
              <span style={{
                position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)',
                fontSize: '1.1rem', pointerEvents: 'none',
              }}>🔍</span>
              <input
                ref={inputRef}
                className="search-input"
                type="text"
                placeholder="Tìm phim, diễn viên, thể loại..."
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
              />
              {searchVal && (
                <button
                  type="button"
                  onClick={() => setSearchVal('')}
                  style={{
                    position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: 'var(--color-text-secondary)',
                    cursor: 'pointer', fontSize: '1rem',
                  }}
                >✕</button>
              )}
            </form>
            <div style={{ textAlign: 'center', marginTop: 12 }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                Gợi ý: Dune, Attack on Titan, Ký Sinh Trùng, Spider-Man
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay to close search */}
      {searchOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 98,
            background: 'rgba(0,0,0,0.5)',
          }}
          onClick={() => setSearchOpen(false)}
        />
      )}

      {/* Mobile nav padding */}
      <style>{`
        @media (max-width: 768px) {
          .nav-links-desktop { display: none !important; }
        }
      `}</style>
    </>
  );
}
