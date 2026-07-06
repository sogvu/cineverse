'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{
      marginTop: 80,
      background: 'rgba(5, 8, 16, 0.5)',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
      padding: '60px clamp(16px, 6vw, 80px) 30px',
      color: 'var(--color-text-secondary)',
      fontSize: '0.85rem',
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '40px',
        marginBottom: 50,
      }}>
        {/* About Cineverse */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.4rem',
            fontWeight: 900,
            background: 'var(--gradient-neon)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            CINEVERSE
          </div>
          <p style={{ lineHeight: 1.6, color: 'var(--color-text-muted)' }}>
            Nền tảng xem phim trực tuyến 3D tiên phong tại Việt Nam. Trải nghiệm rạp chiếu phim ảo, thế giới số tương tác 3D cùng nhiều nhân vật chibi đáng yêu.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            {['🌐', '📘', '🐦', '📸'].map((emoji, idx) => (
              <span
                key={idx}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  border: '1px solid rgba(255,255,255,0.08)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(0, 212, 255, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.4)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                }}
              >
                {emoji}
              </span>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div>
          <h4 style={{ color: 'white', fontWeight: 700, marginBottom: 16, fontSize: '0.9rem', letterSpacing: '0.05em' }}>
            DANH MỤC
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <li><Link href="/category/phim-le" className="footer-link">Phim Lẻ Mới Nhất</Link></li>
            <li><Link href="/category/phim-bo" className="footer-link">Phim Bộ Đặc Sắc</Link></li>
            <li><Link href="/category/hoat-hinh" className="footer-link">Phim Hoạt Hình</Link></li>
            <li><Link href="/category/han-quoc" className="footer-link">Phim Hàn Quốc</Link></li>
            <li><Link href="/search" className="footer-link">Khám Phá Toàn Bộ</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 style={{ color: 'white', fontWeight: 700, marginBottom: 16, fontSize: '0.9rem', letterSpacing: '0.05em' }}>
            HỖ TRỢ
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <li><a href="#" className="footer-link">Trung Tâm Trợ Giúp</a></li>
            <li><a href="#" className="footer-link">Điều Khoản Sử Dụng</a></li>
            <li><a href="#" className="footer-link">Chính Sách Bảo Mật</a></li>
            <li><a href="#" className="footer-link">Liên Hệ QC / Bản Quyền</a></li>
            <li><a href="#" className="footer-link">Báo Cáo Sự Cố</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 style={{ color: 'white', fontWeight: 700, marginBottom: 16, fontSize: '0.9rem', letterSpacing: '0.05em' }}>
            ĐĂNG KÝ NHẬN TIN
          </h4>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.5, marginBottom: 16 }}>
            Nhận thông báo khi có các bộ phim bom tấn hoặc cập nhật tính năng mới nhất từ chúng tôi.
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="email"
              placeholder="Email của bạn..."
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: 8,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'white',
                fontSize: '0.8rem',
                outline: 'none',
              }}
            />
            <button style={{
              background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
              border: 'none',
              borderRadius: 8,
              padding: '0 16px',
              color: 'white',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.8rem',
            }}>
              Gửi
            </button>
          </div>
        </div>
      </div>

      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.05)',
        paddingTop: 30,
        textAlign: 'center',
        color: 'var(--color-text-muted)',
      }}>
        <p>© 2026 CineVerse. Nền tảng xem phim trực tuyến 3D.</p>
        <p style={{ marginTop: 6, fontSize: '0.78rem' }}>
          Dữ liệu phim chỉ mang tính minh họa · Không phục vụ mục đích thương mại
        </p>
      </div>

      {/* Styled Links */}
      <style>{`
        .footer-link {
          color: var(--color-text-secondary);
          text-decoration: none;
          transition: color 0.2s;
        }
        .footer-link:hover {
          color: #00d4ff !important;
        }
      `}</style>
    </footer>
  );
}
