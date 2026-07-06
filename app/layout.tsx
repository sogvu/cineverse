import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CharacterManager from '@/components/characters/CharacterManager';
import TrailerModal from '@/components/movie/TrailerModal';
import ParticleField from '@/components/3d/ParticleField';

export const metadata: Metadata = {
  title: 'CineVerse — Xem Phim Trực Tuyến 3D',
  description: 'Nền tảng xem phim trực tuyến với giao diện 3D rạp chiếu phim ảo, nhân vật hoạt hình tương tác và hàng nghìn bộ phim chất lượng cao.',
  keywords: ['xem phim', 'phim online', 'phim vietsub', 'phim thuyết minh', 'cineverse'],
  openGraph: {
    title: 'CineVerse',
    description: 'Xem phim trực tuyến với trải nghiệm 3D độc đáo',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" data-theme="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body style={{ minHeight: '100vh', background: 'var(--color-bg-primary)' }}>
        {/* Ambient particle field */}
        <ParticleField />

        {/* Navbar */}
        <Navbar />

        {/* Animated chibi characters */}
        <CharacterManager />

        {/* Trailer popup modal */}
        <TrailerModal />

        {/* Page content */}
        <main style={{ paddingTop: 'var(--navbar-height)', position: 'relative', zIndex: 1 }}>
          {children}
        </main>

        {/* Global Footer */}
        <Footer />
      </body>
    </html>
  );
}
