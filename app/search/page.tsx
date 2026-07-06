'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { mockMovies } from '@/data/mockMovies';
import { useMovieStore } from '@/store/movieStore';
import MovieCard from '@/components/movie/MovieCard';
import { Genre, Country, MovieType } from '@/types';

const GENRES: Genre[] = [
  'Hành động','Tình cảm','Hài hước','Kinh dị','Khoa học viễn tưởng',
  'Hoạt hình','Phiêu lưu','Tâm lý','Tội phạm','Chiến tranh','Gia đình','Âm nhạc',
];
const COUNTRIES: Country[] = ['Mỹ','Hàn Quốc','Nhật Bản','Trung Quốc','Anh','Việt Nam'];
const YEARS = [2024, 2023, 2022, 2021, 2020, 2019, 2018];

function SearchContent() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const qParam       = searchParams.get('q') ?? '';
  const genreParam   = searchParams.get('genre') ?? '';

  const {
    searchResults, searchQuery, filters,
    setSearchQuery, setFilter, resetFilters, runSearch,
  } = useMovieStore();

  const [inputVal, setInputVal] = useState(qParam);

  // Sync URL params → store on mount
  useEffect(() => {
    if (qParam) setSearchQuery(qParam);
    else if (genreParam) {
      setFilter('genres', [genreParam as Genre]);
      runSearch();
    } else {
      runSearch(); // show all
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(inputVal);
    router.push(`/search?q=${encodeURIComponent(inputVal)}`);
  };

  const results = searchResults.length > 0 || searchQuery || filters.genres.length > 0
    ? searchResults
    : mockMovies;

  return (
    <div className="page-enter container-cv" style={{ paddingTop: 32, paddingBottom: 60 }}>
      <h1 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 800, marginBottom: 24 }}>
        🔍 Tìm Kiếm & Khám Phá
      </h1>

      {/* Search bar */}
      <form onSubmit={handleSearch} style={{ position: 'relative', maxWidth: 640, marginBottom: 32 }}>
        <span style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', fontSize: '1.1rem' }}>🔍</span>
        <input
          className="search-input"
          type="text"
          placeholder="Tìm theo tên phim, diễn viên, thể loại..."
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
        />
        {inputVal && (
          <button type="button" onClick={() => { setInputVal(''); resetFilters(); }}
            style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', fontSize: '1rem' }}>
            ✕
          </button>
        )}
      </form>

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        {/* ── Filter Panel ── */}
        <aside style={{
          width: 220, flexShrink: 0,
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 16, padding: 20, height: 'fit-content',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontWeight: 700, fontSize: '0.95rem' }}>Bộ Lọc</h3>
            <button onClick={resetFilters} style={{ fontSize: '0.75rem', color: 'var(--color-neon-blue)', background: 'none', border: 'none', cursor: 'pointer' }}>
              Xoá tất cả
            </button>
          </div>

          {/* Type */}
          <FilterSection title="Loại phim">
            {(['all', 'movie', 'series'] as const).map(t => (
              <FilterChip
                key={t}
                label={t === 'all' ? 'Tất cả' : t === 'movie' ? 'Phim lẻ' : 'Phim bộ'}
                active={filters.type === t}
                onClick={() => setFilter('type', t)}
              />
            ))}
          </FilterSection>

          {/* Genres */}
          <FilterSection title="Thể loại">
            {GENRES.map(g => (
              <FilterChip
                key={g} label={g}
                active={filters.genres.includes(g)}
                onClick={() => setFilter('genres',
                  filters.genres.includes(g)
                    ? filters.genres.filter(x => x !== g)
                    : [...filters.genres, g]
                )}
              />
            ))}
          </FilterSection>

          {/* Countries */}
          <FilterSection title="Quốc gia">
            {COUNTRIES.map(c => (
              <FilterChip
                key={c} label={c}
                active={filters.countries.includes(c)}
                onClick={() => setFilter('countries',
                  filters.countries.includes(c)
                    ? filters.countries.filter(x => x !== c)
                    : [...filters.countries, c]
                )}
              />
            ))}
          </FilterSection>

          {/* Years */}
          <FilterSection title="Năm phát hành">
            {YEARS.map(y => (
              <FilterChip
                key={y} label={String(y)}
                active={filters.years.includes(y)}
                onClick={() => setFilter('years',
                  filters.years.includes(y)
                    ? filters.years.filter(x => x !== y)
                    : [...filters.years, y]
                )}
              />
            ))}
          </FilterSection>

          {/* Sort */}
          <FilterSection title="Sắp xếp">
            {([
              { val: 'newest', label: 'Mới nhất' },
              { val: 'popular', label: 'Phổ biến' },
              { val: 'rating', label: 'Điểm cao' },
            ] as const).map(s => (
              <FilterChip
                key={s.val} label={s.label}
                active={filters.sortBy === s.val}
                onClick={() => setFilter('sortBy', s.val)}
              />
            ))}
          </FilterSection>
        </aside>

        {/* ── Results Grid ── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 20, fontSize: '0.88rem' }}>
            Tìm thấy <strong style={{ color: 'var(--color-neon-blue)' }}>{results.length}</strong> kết quả
            {searchQuery && <> cho "<strong>{searchQuery}</strong>"</>}
          </p>
          {results.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--color-text-muted)' }}>
              <div style={{ fontSize: '4rem', marginBottom: 16 }}>🎬</div>
              <p style={{ fontSize: '1.1rem' }}>Không tìm thấy phim nào phù hợp</p>
              <p style={{ fontSize: '0.85rem', marginTop: 8 }}>Thử tìm với từ khóa khác nhé!</p>
            </div>
          ) : (
            <motion.div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                gap: 16,
              }}
            >
              {results.map((movie, i) => (
                <MovieCard key={movie.id} movie={movie} size="sm" index={i} />
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)', marginBottom: 10 }}>
        {title}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {children}
      </div>
    </div>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '4px 10px', borderRadius: 20,
        background: active ? 'rgba(0,212,255,0.15)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${active ? 'rgba(0,212,255,0.5)' : 'rgba(255,255,255,0.1)'}`,
        color: active ? '#00d4ff' : 'var(--color-text-secondary)',
        fontSize: '0.75rem', fontWeight: active ? 700 : 500,
        cursor: 'pointer', transition: 'all 0.2s ease',
      }}
    >
      {label}
    </button>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{ padding: '100px 0', textAlign: 'center', color: '#888' }}>Đang tải...</div>}>
      <SearchContent />
    </Suspense>
  );
}
