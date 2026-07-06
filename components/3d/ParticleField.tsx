'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useUIStore } from '@/store/uiStore';

/**
 * Draws a cinematic particle field on a Canvas element.
 * No Three.js dependency — works on all devices.
 */
export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef   = useRef<number>(0);
  const deviceTier = useUIStore(s => s.deviceTier);

  const count = deviceTier === 'high' ? 80 : deviceTier === 'medium' ? 40 : 15;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize to fill window
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    type Particle = {
      x: number; y: number; vx: number; vy: number;
      size: number; opacity: number; color: string; pulse: number;
    };

    const colors = ['#00d4ff', '#7c3aed', '#ff006e', '#fbbf24', '#10b981'];
    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.6 + 0.1,
      color: colors[Math.floor(Math.random() * colors.length)],
      pulse: Math.random() * Math.PI * 2,
    }));

    let t = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.016;

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.02;

        // Wrap around edges
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        const alpha = p.opacity * (0.7 + 0.3 * Math.sin(p.pulse));
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;

        // Draw as glowing dot
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        grad.addColorStop(0, p.color);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(animate);
    };

    animate();
  }, [count]);

  useEffect(() => {
    draw();
    const handleResize = () => { cancelAnimationFrame(animRef.current); draw(); };
    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className="particles-canvas"
      aria-hidden="true"
    />
  );
}
