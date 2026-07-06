'use client';

import { use, useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getMovieById } from '@/data/mockMovies';
import { useUIStore } from '@/store/uiStore';
import { useUserStore } from '@/store/userStore';
import { notFound } from 'next/navigation';

interface Props { params: Promise<{ id: string }> }


export default function WatchPage({ params }: Props) {
  const { id } = use(params);
  const movie = getMovieById(id);
  if (!movie) notFound();

  const videoRef   = useRef<HTMLVideoElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying]     = useState(false);
  const [muted,   setMuted]       = useState(false);
  const [volume,  setVolume]      = useState(1);
  const [current, setCurrent]     = useState(0);
  const [duration, setDuration]   = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [speed, setSpeed]         = useState(1);
  const [quality, setQuality]     = useState(movie.quality[0]);
  const [subtitle, setSubtitle]   = useState(movie.subtitles[0]);
  const hideTimer = useRef<any>(null);

  const { setPlayerMode } = useUIStore();
  const { updateProgress, getProgress } = useUserStore();

  // RoPhim & OPhim Integration states
  const [server, setServer] = useState<'rophims' | 'cineverse'>('rophims');
  const [ophimData, setOphimData] = useState<any>(null);
  const [selectedEp, setSelectedEp] = useState<string>('Full');
  const [embedUrl, setEmbedUrl] = useState<string>('');

  // Enter player mode (hide characters)
  useEffect(() => {
    setPlayerMode(true);
    return () => setPlayerMode(false);
  }, [setPlayerMode]);

  // Load data from OPhim/RoPhim API
  useEffect(() => {
    const slug = movie.slug;
    if (!slug) {
      setServer('cineverse');
      return;
    }

    fetch(`https://ophim1.com/phim/${slug}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.movie && data.episodes) {
          setOphimData(data);
          const firstServer = data.episodes[0];
          if (firstServer && firstServer.server_data && firstServer.server_data.length > 0) {
            const firstEp = firstServer.server_data[0];
            setSelectedEp(firstEp.name);
            setEmbedUrl(firstEp.link_embed);
            setServer('rophims');
          }
        } else {
          setServer('cineverse');
        }
      })
      .catch(err => {
        console.error("Failed to fetch OPhim movie data:", err);
        setServer('cineverse');
      });
  }, [id]);

  // Restore saved progress
  useEffect(() => {
    const saved = getProgress(id);
    if (saved > 0 && videoRef.current) {
      videoRef.current.currentTime = saved;
    }
  }, [id, getProgress]);

  // Auto-hide controls
  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setShowControls(false), 3000);
  }, []);

  useEffect(() => {
    resetHideTimer();
    return () => clearTimeout(hideTimer.current);
  }, [resetHideTimer]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (playing) { v.pause(); } else { v.play(); }
    setPlaying(!playing);
  };

  const seek = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.min(Math.max(0, videoRef.current.currentTime + seconds), duration);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const pct = duration ? (current / duration) * 100 : 0;

  const handleSeekClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = ratio * duration;
  };

  const handleFullscreen = () => {
    if (!wrapperRef.current) return;
    if (!document.fullscreenElement) {
      wrapperRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const saveProgress = () => {
    if (videoRef.current && duration > 0) {
      updateProgress(id, videoRef.current.currentTime, duration);
    }
  };

  return (
    <div className="page-enter" style={{ minHeight: '100vh', background: '#000' }}>
      {/* Back button */}
      <div style={{
        position: 'fixed', top: 80, left: 20, zIndex: 50,
      }}>
        <Link href={`/movie/${id}`}>
          <button style={{
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 8, padding: '8px 16px',
            color: 'white', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
          }}>
            ← Quay lại
          </button>
        </Link>
      </div>

      {/* Player */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 0 40px' }}>
        {/* Movie title */}
        <div style={{ width: '100%', maxWidth: 1100, padding: '16px 24px 0' }}>
          <h1 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', opacity: 0.9 }}>
            {movie.title} {server === 'rophims' && ` - Tập ${selectedEp}`}
          </h1>
        </div>

        {/* Video wrapper */}
        <div
          ref={wrapperRef}
          className="cv-player-wrapper"
          onMouseMove={server === 'cineverse' ? resetHideTimer : undefined}
          onClick={server === 'cineverse' ? togglePlay : undefined}
          style={{
            width: '100%', maxWidth: 1100,
            margin: '12px 0 0',
            aspectRatio: '16/9',
            position: 'relative',
            cursor: (server === 'cineverse' && !showControls) ? 'none' : 'default',
            background: '#000',
            borderRadius: 12,
            overflow: 'hidden',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)',
          }}
        >
          {server === 'rophims' && embedUrl ? (
            <iframe
              src={embedUrl}
              style={{ width: '100%', height: '100%', border: 'none' }}
              allowFullScreen
              scrolling="no"
              allow="autoplay; encrypted-media; picture-in-picture"
            />
          ) : (
            <>
              <video
                ref={videoRef}
                src={movie.videoUrl}
                style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                onTimeUpdate={e => { setCurrent(e.currentTarget.currentTime); saveProgress(); }}
                onDurationChange={e => setDuration(e.currentTarget.duration)}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onVolumeChange={e => { setVolume(e.currentTarget.volume); setMuted(e.currentTarget.muted); }}
              />

              {/* Center play/pause */}
              {!playing && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(0,0,0,0.3)',
                  }}
                >
                  <div style={{
                    width: 72, height: 72, borderRadius: '50%',
                    background: 'rgba(0,212,255,0.2)', backdropFilter: 'blur(8px)',
                    border: '2px solid rgba(0,212,255,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '2rem',
                  }}>▶</div>
                </motion.div>
              )}

              {/* Controls overlay */}
              <motion.div
                animate={{ opacity: showControls ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                onClick={e => e.stopPropagation()}
                style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
                  padding: '40px 20px 16px',
                  pointerEvents: showControls ? 'auto' : 'none',
                }}
              >
                {/* Progress bar */}
                <div
                  onClick={handleSeekClick}
                  style={{
                    height: 4, background: 'rgba(255,255,255,0.2)',
                    borderRadius: 2, cursor: 'pointer', marginBottom: 12,
                    position: 'relative',
                  }}
                >
                  <div style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0,
                    width: `${pct}%`,
                    background: 'linear-gradient(90deg, #00d4ff, #7c3aed)',
                    borderRadius: 2, transition: 'width 0.1s',
                  }}>
                    <div style={{
                      position: 'absolute', right: -6, top: '50%',
                      transform: 'translateY(-50%)',
                      width: 12, height: 12, borderRadius: '50%',
                      background: '#00d4ff', boxShadow: '0 0 8px #00d4ff',
                    }} />
                  </div>
                </div>

                {/* Controls row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {/* Seek back */}
                  <button onClick={() => seek(-10)} style={ctrlBtn}>⏮ 10s</button>
                  {/* Play/Pause */}
                  <button onClick={togglePlay} style={{ ...ctrlBtn, fontSize: '1.2rem' }}>
                    {playing ? '⏸' : '▶'}
                  </button>
                  {/* Seek forward */}
                  <button onClick={() => seek(10)} style={ctrlBtn}>10s ⏭</button>

                  {/* Volume */}
                  <button onClick={() => {
                    if (!videoRef.current) return;
                    videoRef.current.muted = !muted;
                  }} style={ctrlBtn}>
                    {muted ? '🔇' : volume > 0.5 ? '🔊' : '🔉'}
                  </button>
                  <input
                    type="range" min={0} max={1} step={0.05} value={muted ? 0 : volume}
                    onChange={e => {
                      if (!videoRef.current) return;
                      videoRef.current.volume = parseFloat(e.target.value);
                      videoRef.current.muted = parseFloat(e.target.value) === 0;
                    }}
                    style={{ width: 70, accentColor: '#00d4ff' }}
                  />

                  {/* Time */}
                  <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginLeft: 4 }}>
                    {formatTime(current)} / {formatTime(duration)}
                  </span>

                  <div style={{ flex: 1 }} />

                  {/* Speed */}
                  <select
                    value={speed}
                    onChange={e => {
                      const s = parseFloat(e.target.value);
                      setSpeed(s);
                      if (videoRef.current) videoRef.current.playbackRate = s;
                    }}
                    style={{ ...selectStyle }}
                  >
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map(s => (
                      <option key={s} value={s}>{s}x</option>
                    ))}
                  </select>

                  {/* Quality */}
                  <select value={quality} onChange={e => setQuality(e.target.value as any)} style={selectStyle}>
                    {movie.quality.map(q => <option key={q} value={q}>{q}</option>)}
                  </select>

                  {/* Subtitle */}
                  <select value={subtitle} onChange={e => setSubtitle(e.target.value as any)} style={selectStyle}>
                    {movie.subtitles.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>

                  {/* Fullscreen */}
                  <button onClick={handleFullscreen} style={ctrlBtn}>⛶</button>
                </div>
              </motion.div>
            </>
          )}
        </div>

        {/* Server Selector & External Link */}
        <div style={{
          width: '100%', maxWidth: 1100,
          display: 'flex', flexWrap: 'wrap', gap: 10,
          margin: '16px 0 8px', padding: '0 24px',
          alignItems: 'center', justifyContent: 'center'
        }}>
          <button
            onClick={() => setServer('rophims')}
            disabled={!embedUrl}
            style={{
              background: server === 'rophims' ? 'linear-gradient(135deg, #00d4ff, #7c3aed)' : 'rgba(255,255,255,0.08)',
              border: 'none',
              borderRadius: 8,
              padding: '10px 18px',
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: embedUrl ? 'pointer' : 'not-allowed',
              opacity: embedUrl ? 1 : 0.5,
              boxShadow: server === 'rophims' ? '0 0 15px rgba(0,212,255,0.45)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            🎬 Server Rổ Phim (Vietsub HD)
          </button>

          <button
            onClick={() => setServer('cineverse')}
            style={{
              background: server === 'cineverse' ? 'linear-gradient(135deg, #00d4ff, #7c3aed)' : 'rgba(255,255,255,0.08)',
              border: 'none',
              borderRadius: 8,
              padding: '10px 18px',
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              boxShadow: server === 'cineverse' ? '0 0 15px rgba(0,212,255,0.45)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            🛡️ Server CineVerse (Backup)
          </button>

          {movie.slug && (
            <a
              href={`https://rophims.co.uk/xem-phim/${movie.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover-glow"
              style={{
                background: 'rgba(244, 63, 94, 0.15)',
                border: '1px solid rgba(244, 63, 94, 0.4)',
                borderRadius: 8,
                padding: '9px 18px',
                color: '#f43f5e',
                fontWeight: 600,
                fontSize: '0.85rem',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <span>Xem trực tiếp trên RoPhim ↗</span>
            </a>
          )}
        </div>

        {/* Dynamic Episode list from RoPhim */}
        {server === 'rophims' && ophimData?.episodes?.[0]?.server_data && (
          <div style={{ width: '100%', maxWidth: 1100, marginTop: 16, padding: '0 24px' }}>
            <h3 style={{ marginBottom: 12, fontSize: '0.95rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>
              Danh Sách Tập (RoPhim Server)
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {ophimData.episodes[0].server_data.map((ep: any) => (
                <button
                  key={ep.name}
                  onClick={() => {
                    setSelectedEp(ep.name);
                    setEmbedUrl(ep.link_embed);
                  }}
                  style={{
                    padding: '8px 16px', borderRadius: 8,
                    background: ep.name === selectedEp ? 'linear-gradient(135deg, #00d4ff, #7c3aed)' : 'rgba(255,255,255,0.06)',
                    border: ep.name === selectedEp ? 'none' : '1px solid rgba(255,255,255,0.1)',
                    color: 'white', fontWeight: 600, fontSize: '0.8rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  Tập {ep.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Episode list for CineVerse Backup */}
        {server === 'cineverse' && movie.type === 'series' && movie.totalEpisodes && (
          <div style={{ width: '100%', maxWidth: 1100, marginTop: 16, padding: '0 24px' }}>
            <h3 style={{ marginBottom: 12, fontSize: '0.95rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>
              Danh Sách Tập (Backup Server)
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {Array.from({ length: Math.min(movie.totalEpisodes, 24) }, (_, i) => i + 1).map(ep => (
                <button
                  key={ep}
                  style={{
                    width: 44, height: 44, borderRadius: 8,
                    background: ep === 1 ? 'linear-gradient(135deg, #00d4ff, #7c3aed)' : 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'white', fontWeight: 600, fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  {ep}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const ctrlBtn: React.CSSProperties = {
  background: 'none', border: 'none',
  color: 'rgba(255,255,255,0.85)',
  cursor: 'pointer', padding: '4px 6px',
  fontSize: '0.85rem', borderRadius: 4,
  whiteSpace: 'nowrap',
};

const selectStyle: React.CSSProperties = {
  background: 'rgba(0,0,0,0.6)',
  border: '1px solid rgba(255,255,255,0.2)',
  color: 'white', borderRadius: 6,
  padding: '4px 8px', fontSize: '0.75rem',
  cursor: 'pointer',
};
