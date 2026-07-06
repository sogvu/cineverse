'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { CharacterState } from '@/types';
import { useUIStore } from '@/store/uiStore';
import ChibiCharacter from './ChibiCharacter';

/* ── Random lines the characters say ─────────────────────────────── */
const BUBBLE_LINES = [
  'Hôm nay xem phim gì thế? 🍿',
  'Phim này hay lắm nè! ⭐',
  'Đừng quên mua bắp rang nhé!',
  'Có phim mới ra rồi đó! 🎬',
  'Xem xong nhớ rate phim nha~',
  'Bộ phim này mình xem 3 lần rồi!',
  'Shh... đang xem phim hay lắm!',
  'Tắt đèn đi xem cho có không khí!',
  'Plot twist kinh dị lắm đó! 😱',
  'Nhân vật chính siêu ngầu nha~',
  'Hồi hộp quá, tim mình đập loạn!',
  'Cảnh quay đẹp xuất sắc luôn! 😍',
  'Soundtrack hay đến chảy nước mắt!',
  'Cuối phim bật khóc nha, cảnh báo!',
  'Mình ngồi đây để xem phim cùng!',
];

const ACTIONS: CharacterState['action'][] = ['idle', 'walking', 'eating', 'waving', 'sleeping'];

/* ── Initial character configs ───────────────────────────────────── */
const INITIAL_CHARS: CharacterState[] = [
  {
    id: 'char-1',
    x: 8,
    y: 75,
    action: 'idle',
    direction: 'right',
    isHovered: false,
    showBubble: false,
    bubbleText: '',
    skinColor: '#FFCD94',
    hairColor: '#2D2D2D',
    clothColor: '#4F46E5',
  },
  {
    id: 'char-2',
    x: 85,
    y: 70,
    action: 'eating',
    direction: 'left',
    isHovered: false,
    showBubble: false,
    bubbleText: '',
    skinColor: '#F5C5A3',
    hairColor: '#8B4513',
    clothColor: '#e11d48',
  },
  {
    id: 'char-3',
    x: 50,
    y: 88,
    action: 'waving',
    direction: 'right',
    isHovered: false,
    showBubble: false,
    bubbleText: '',
    skinColor: '#FDDBB5',
    hairColor: '#1a1a2e',
    clothColor: '#0d9488',
  },
];

export default function CharacterManager() {
  const [chars, setChars] = useState<CharacterState[]>(INITIAL_CHARS);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const isPlayerMode = useUIStore(s => s.isPlayerMode);
  const deviceTier   = useUIStore(s => s.deviceTier);

  // Don't render on low-end devices
  if (deviceTier === 'low') return null;
  const visibleCount = deviceTier === 'high' ? 3 : 2;

  /* ── Random action picker ── */
  const pickRandomAction = useCallback((charId: string) => {
    const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
    const direction = Math.random() > 0.5 ? 'right' : 'left';

    setChars(prev =>
      prev.map(c => c.id === charId ? { ...c, action, direction } : c)
    );

    // Restore idle after 3-5s
    const t = setTimeout(() => {
      setChars(prev =>
        prev.map(c => c.id === charId ? { ...c, action: 'idle' } : c)
      );
    }, 3000 + Math.random() * 2000);
    timersRef.current.push(t);
  }, []);

  /* ── Walking movement ── */
  const walkCharacter = useCallback((charId: string) => {
    setChars(prev =>
      prev.map(c => {
        if (c.id !== charId) return c;
        const dx = (Math.random() - 0.5) * 20;
        let newX = c.x + dx;
        // Keep in safe bounds
        newX = Math.max(5, Math.min(90, newX));
        return { ...c, x: newX, action: 'walking', direction: dx > 0 ? 'right' : 'left' };
      })
    );
  }, []);

  /* ── Schedule random events ── */
  useEffect(() => {
    if (isPlayerMode) return;

    INITIAL_CHARS.slice(0, visibleCount).forEach((char, i) => {
      const scheduleNext = () => {
        const delay = 5000 + Math.random() * 10000; // 5-15s
        const t = setTimeout(() => {
          const roll = Math.random();
          if (roll < 0.4) {
            walkCharacter(char.id);
          } else {
            pickRandomAction(char.id);
          }
          scheduleNext();
        }, delay);
        timersRef.current.push(t);
      };
      // Stagger startup
      const t = setTimeout(scheduleNext, i * 2000 + 1000);
      timersRef.current.push(t);
    });

    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, [isPlayerMode, visibleCount, walkCharacter, pickRandomAction]);

  /* ── Hover handlers ── */
  const handleHover = useCallback((id: string, hovered: boolean) => {
    const line = BUBBLE_LINES[Math.floor(Math.random() * BUBBLE_LINES.length)];
    setChars(prev =>
      prev.map(c =>
        c.id === id
          ? {
              ...c,
              isHovered: hovered,
              showBubble: hovered,
              bubbleText: hovered ? line : c.bubbleText,
              action: hovered ? 'surprised' : 'idle',
            }
          : c
      )
    );

    // Auto-hide bubble after 3s
    if (hovered) {
      const t = setTimeout(() => {
        setChars(prev =>
          prev.map(c => c.id === id ? { ...c, showBubble: false } : c)
        );
      }, 3000);
      timersRef.current.push(t);
    }
  }, []);

  return (
    <div className="character-layer" aria-hidden="true">
      {chars.slice(0, visibleCount).map(char => (
        <ChibiCharacter
          key={char.id}
          character={char}
          onHover={handleHover}
        />
      ))}
    </div>
  );
}
