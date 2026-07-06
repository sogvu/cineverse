'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { CharacterState } from '@/types';
import { useUIStore } from '@/store/uiStore';
import SpeechBubble from './SpeechBubble';

/* ── Shared SVG Chibi character ──────────────────────────────────── */
function ChibiSVG({
  state,
  skinColor = '#FFCD94',
  hairColor = '#2D2D2D',
  clothColor = '#4F46E5',
  id,
}: {
  state: CharacterState['action'];
  skinColor?: string;
  hairColor?: string;
  clothColor?: string;
  id?: string;
}) {
  const eyeColor = '#1A1A2E';
  const cheekColor = '#FFB6C1';
  const pantColor = '#1e293b';

  const isSleeping = state === 'sleeping';
  const isSurprised = state === 'surprised';
  const isEating = state === 'eating';
  const isWaving = state === 'waving';

  // ─── CHARACTER 1: ANIME CAT-EAR GIRL (char-1) ───
  if (id === 'char-1') {
    return (
      <svg width="85" height="105" viewBox="0 0 85 105" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Cat-ear Anime Girl">
        {/* Shadow */}
        <ellipse cx="42.5" cy="101" rx="20" ry="4.5" fill="rgba(0,0,0,0.25)" />

        {/* Shoes & Legs */}
        <ellipse cx="32" cy="95" rx="8" ry="4" fill="#2d3748" />
        <ellipse cx="53" cy="95" rx="8" ry="4" fill="#2d3748" />
        <rect x="28" y="80" width="8" height="15" fill={skinColor} />
        <rect x="49" y="80" width="8" height="15" fill={skinColor} />

        {/* Skirt (Schoolgirl Uniform) */}
        <path d="M22 68 L63 68 L67 82 L18 82 Z" fill="#312e81" />
        <path d="M28 68 L32 82 M38 68 L39 82 M47 68 L46 82 M55 68 L53 82" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />

        {/* Body & Uniform Shirt */}
        <rect x="24" y="48" width="37" height="22" rx="4" fill="#f8fafc" />
        <path d="M24 48 L42.5 60 L61 48 Z" fill="#312e81" /> {/* Sailor collar */}
        {/* Red ribbon bowtie */}
        <path d="M37 56 L42.5 50 L48 56 L42.5 58 Z" fill="#e11d48" />
        <path d="M37 56 L33 64 L41 60 Z" fill="#be123c" />
        <path d="M48 56 L52 64 L44 60 Z" fill="#be123c" />

        {/* Left Arm */}
        <rect
          x="12" y="49" width="13" height="8" rx="4" fill="#f8fafc"
          style={{
            transformOrigin: '21px 53px',
            transform: isWaving ? 'rotate(-45deg)' : isEating ? 'rotate(-25deg)' : 'rotate(12deg)',
            transition: 'transform 0.4s ease',
          }}
        />
        <circle cx="12" cy="53" r="4.5" fill={skinColor}
          style={{
            transformOrigin: '12px 53px',
            transform: isWaving ? 'rotate(-45deg) translate(-7px, -7px)' : '',
            transition: 'transform 0.4s ease',
          }}
        />

        {/* Right Arm */}
        <rect
          x="60" y="49" width="13" height="8" rx="4" fill="#f8fafc"
          style={{
            transformOrigin: '64px 53px',
            transform: isWaving ? 'rotate(45deg)' : 'rotate(-12deg)',
            transition: 'transform 0.4s ease',
          }}
        />
        <circle cx="73" cy="53" r="4.5" fill={skinColor} />

        {/* Neck */}
        <rect x="37" y="42" width="11" height="8" fill={skinColor} />
        <rect x="37" y="44" width="11" height="2.5" fill="#e11d48" /> {/* Choker */}

        {/* Head */}
        <ellipse cx="42.5" cy="28" rx="22" ry="20" fill={skinColor} />

        {/* Ears (Cat Ears / Nekomimi) */}
        <path d="M 23 15 L 15 2 L 28 8 Z" fill={hairColor} />
        <path d="M 21 13 L 17 5 L 25 9 Z" fill="#fda4af" /> {/* Inner left ear */}
        <path d="M 62 15 L 70 2 L 57 8 Z" fill={hairColor} />
        <path d="M 64 13 L 68 5 L 60 9 Z" fill="#fda4af" /> {/* Inner right ear */}

        {/* Hair (Long anime hair with spiky bangs) */}
        <ellipse cx="42.5" cy="11" rx="21" ry="8" fill={hairColor} />
        <path d="M19 12 C16 28 14 45 15 58 C16 64 21 64 22 55 C23 45 22 28 22 12 Z" fill={hairColor} /> {/* Left long side locks */}
        <path d="M66 12 C69 28 71 45 70 58 C69 64 64 64 63 55 C62 45 63 28 63 12 Z" fill={hairColor} /> {/* Right long side locks */}
        {/* Bangs */}
        <path d="M 23 12 L 28 27 L 33 12 L 39 29 L 44 12 L 48 29 L 53 12 L 57 26 L 62 12 Z" fill={hairColor} />

        {/* Cheeks blush */}
        <ellipse cx="29" cy="32" rx="5" ry="3" fill={cheekColor} opacity="0.6" />
        <ellipse cx="56" cy="32" rx="5" ry="3" fill={cheekColor} opacity="0.6" />

        {/* Eyes (Large Anime Purple Eyes) */}
        {isSleeping ? (
          <>
            <path d="M 27 28 Q 32 32 37 28" stroke="#3b0764" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M 48 28 Q 53 32 58 28" stroke="#3b0764" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <text x="63" y="12" fontSize="9" fill="#a78bfa" fontWeight="bold">z</text>
            <text x="69" y="7" fontSize="7" fill="#a78bfa" fontWeight="bold">z</text>
          </>
        ) : isSurprised ? (
          <>
            <circle cx="32" cy="27" r="5.5" fill="#6b21a8" />
            <circle cx="53" cy="27" r="5.5" fill="#6b21a8" />
            <circle cx="32" cy="27" r="3.5" fill={eyeColor} />
            <circle cx="53" cy="27" r="3.5" fill={eyeColor} />
            <circle cx="34.5" cy="25" r="1.5" fill="white" />
            <circle cx="55.5" cy="25" r="1.5" fill="white" />
          </>
        ) : (
          <>
            {/* Standard Anime Eyes */}
            <ellipse cx="32" cy="28" rx="5" ry="7" fill="#701a75" />
            <ellipse cx="53" cy="28" rx="5" ry="7" fill="#701a75" />
            <ellipse cx="32" cy="28" rx="3.5" ry="5.5" fill={eyeColor} />
            <ellipse cx="53" cy="28" rx="3.5" ry="5.5" fill={eyeColor} />
            <circle cx="33.5" cy="25" r="1.8" fill="white" />
            <circle cx="54.5" cy="25" r="1.8" fill="white" />
            <circle cx="30.5" cy="30" r="1" fill="white" opacity="0.8" />
            <circle cx="51.5" cy="30" r="1" fill="white" opacity="0.8" />
            {/* Eyelashes */}
            <path d="M 26 23 C 29 21 35 21 38 23" stroke={eyeColor} strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M 47 23 C 50 21 56 21 59 23" stroke={eyeColor} strokeWidth="2" strokeLinecap="round" fill="none" />
          </>
        )}

        {/* Mouth */}
        {isSurprised ? (
          <circle cx="42.5" cy="37" r="3.5" fill={eyeColor} />
        ) : isEating ? (
          <>
            <path d="M 38 37 Q 42.5 41 47 37" stroke={eyeColor} strokeWidth="2" strokeLinecap="round" fill="none" />
            {/* Popcorn */}
            <rect x="54" y="58" width="15" height="17" rx="2" fill="#ef4444" />
            <rect x="54" y="58" width="15" height="5" rx="1" fill="#fcfcfc" />
            <text x="56" y="68" fontSize="7" fill="white">🍿</text>
          </>
        ) : (
          <path d="M 38 37 Q 42.5 41 47 37" stroke={eyeColor} strokeWidth="2" strokeLinecap="round" fill="none" />
        )}

        {/* 3D Glasses Overlay in Idle */}
        {state === 'idle' && (
          <>
            <rect x="22" y="23" width="14" height="9" rx="3" fill="none" stroke="#00d4ff" strokeWidth="1.8" />
            <rect x="49" y="23" width="14" height="9" rx="3" fill="none" stroke="#ff006e" strokeWidth="1.8" />
            <line x1="36" y1="27" x2="49" y2="27" stroke="#2D2D2D" strokeWidth="1.8" />
          </>
        )}
      </svg>
    );
  }

  // ─── CHARACTER 2: ANIME HOODIE BOY (char-2) ───
  if (id === 'char-2') {
    return (
      <svg width="85" height="105" viewBox="0 0 85 105" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Hoodie Anime Boy">
        {/* Shadow */}
        <ellipse cx="42.5" cy="101" rx="20" ry="4.5" fill="rgba(0,0,0,0.25)" />

        {/* Shoes & Legs */}
        <ellipse cx="31" cy="95" rx="9" ry="4.5" fill="#111827" />
        <ellipse cx="54" cy="95" rx="9" ry="4.5" fill="#111827" />
        <rect x="27" y="78" width="9" height="17" fill={pantColor} />
        <rect x="49" y="78" width="9" height="17" fill={pantColor} />

        {/* Body & Hoodie */}
        <rect x="22" y="48" width="41" height="32" rx="8" fill={clothColor} />
        {/* Hoodie zipper */}
        <line x1="42.5" y1="48" x2="42.5" y2="80" stroke="#f1f5f9" strokeWidth="1.5" strokeDasharray="3 2" />
        <rect x="32" y="66" width="21" height="8" rx="2" fill="rgba(0,0,0,0.15)" /> {/* Pocket */}

        {/* Left Arm */}
        <rect
          x="10" y="50" width="14" height="9" rx="4" fill={clothColor}
          style={{
            transformOrigin: '21px 54px',
            transform: isWaving ? 'rotate(-40deg)' : isEating ? 'rotate(-25deg)' : 'rotate(10deg)',
            transition: 'transform 0.4s ease',
          }}
        />
        <circle cx="10" cy="54.5" r="4.5" fill={skinColor}
          style={{
            transformOrigin: '10px 54.5px',
            transform: isWaving ? 'rotate(-40deg) translate(-7px, -7px)' : '',
            transition: 'transform 0.4s ease',
          }}
        />

        {/* Right Arm */}
        <rect
          x="61" y="50" width="14" height="9" rx="4" fill={clothColor}
          style={{
            transformOrigin: '64px 54px',
            transform: isWaving ? 'rotate(40deg)' : 'rotate(-10deg)',
            transition: 'transform 0.4s ease',
          }}
        />
        <circle cx="75" cy="54.5" r="4.5" fill={skinColor} />

        {/* Head & Neck */}
        <rect x="36" y="42" width="13" height="8" fill={skinColor} />
        <ellipse cx="42.5" cy="27" rx="22" ry="20" fill={skinColor} />

        {/* Hair (Cool spiky anime boy hair) */}
        <path d="M 19 24 L 16 12 L 25 15 L 26 5 L 36 10 L 41 2 L 48 8 L 56 3 L 60 12 L 67 9 L 66 23 L 69 19 L 66 31 Z" fill={hairColor} />
        {/* Forehead hair spikes */}
        <path d="M 23 15 L 28 26 L 31 16 L 37 28 L 42 16 L 47 27 L 51 16 L 56 25 L 61 15 Z" fill={hairColor} />

        {/* Headset on head */}
        <path d="M 21 24 C 21 10 64 10 64 24" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" fill="none" />
        <rect x="17" y="20" width="6" height="11" rx="2" fill="#f43f5e" />
        <rect x="62" y="20" width="6" height="11" rx="2" fill="#f43f5e" />

        {/* Cheeks */}
        <ellipse cx="29" cy="32" rx="4.5" ry="2.5" fill={cheekColor} opacity="0.4" />
        <ellipse cx="56" cy="32" rx="4.5" ry="2.5" fill={cheekColor} opacity="0.4" />

        {/* Eyes (Cool Blue Anime Eyes) */}
        {isSleeping ? (
          <>
            <path d="M 27 28 L 36 28" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 49 28 L 58 28" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
            <text x="64" y="12" fontSize="9" fill="#3b82f6" fontWeight="bold">z</text>
            <text x="70" y="7" fontSize="7" fill="#3b82f6" fontWeight="bold">z</text>
          </>
        ) : isSurprised ? (
          <>
            <circle cx="31" cy="27" r="5" fill="#0284c7" />
            <circle cx="54" cy="27" r="5" fill="#0284c7" />
            <circle cx="31" cy="27" r="3" fill={eyeColor} />
            <circle cx="54" cy="27" r="3" fill={eyeColor} />
            <circle cx="32.5" cy="25.5" r="1.2" fill="white" />
            <circle cx="55.5" cy="25.5" r="1.2" fill="white" />
          </>
        ) : (
          <>
            {/* Cool determined eyes */}
            <path d="M 25 24 L 37 25.5" stroke={eyeColor} strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 60 24 L 48 25.5" stroke={eyeColor} strokeWidth="2.5" strokeLinecap="round" />
            <ellipse cx="31" cy="29" rx="4" ry="5.5" fill="#0ea5e9" />
            <ellipse cx="54" cy="29" rx="4" ry="5.5" fill="#0ea5e9" />
            <circle cx="32" cy="27" r="1.5" fill="white" />
            <circle cx="55" cy="27" r="1.5" fill="white" />
          </>
        )}

        {/* Mouth */}
        {isSurprised ? (
          <ellipse cx="42.5" cy="37" rx="3" ry="4" fill={eyeColor} />
        ) : isEating ? (
          <>
            <path d="M 39 36 L 46 37" stroke={eyeColor} strokeWidth="2" strokeLinecap="round" />
            {/* Popcorn box */}
            <rect x="54" y="58" width="15" height="17" rx="2" fill="#0284c7" />
            <rect x="54" y="58" width="15" height="5" rx="1" fill="#fcd34d" />
            <text x="56" y="68" fontSize="7" fill="white">🍿</text>
          </>
        ) : (
          <path d="M 39 36 Q 43 38 46 36.5" stroke={eyeColor} strokeWidth="2" strokeLinecap="round" fill="none" />
        )}

        {/* 3D Glasses Overlay in Idle */}
        {state === 'idle' && (
          <>
            <rect x="22" y="23" width="14" height="9" rx="3" fill="none" stroke="#00d4ff" strokeWidth="1.8" />
            <rect x="49" y="23" width="14" height="9" rx="3" fill="none" stroke="#ff006e" strokeWidth="1.8" />
            <line x1="36" y1="27" x2="49" y2="27" stroke="#2D2D2D" strokeWidth="1.8" />
          </>
        )}
      </svg>
    );
  }

  // ─── CHARACTER 3: ANIME MAID / MAGICAL GIRL (char-3) ───
  return (
    <svg width="85" height="105" viewBox="0 0 85 105" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Maid Anime Girl">
      {/* Shadow */}
      <ellipse cx="42.5" cy="101" rx="20" ry="4.5" fill="rgba(0,0,0,0.25)" />

      {/* Shoes & White stockings */}
      <ellipse cx="32" cy="95" rx="7.5" ry="3.5" fill="#111827" />
      <ellipse cx="53" cy="95" rx="7.5" ry="3.5" fill="#111827" />
      <rect x="28" y="78" width="8" height="17" fill="#f8fafc" />
      <rect x="49" y="78" width="8" height="17" fill="#f8fafc" />

      {/* Dress & Apron (Maid Dress) */}
      <path d="M20 66 L65 66 L69 82 L16 82 Z" fill="#0f172a" /> {/* Black outer skirt */}
      <path d="M29 66 L56 66 L58 82 L27 82 Z" fill="#f8fafc" /> {/* White inner apron */}

      {/* Body & Apron Bib */}
      <rect x="25" y="48" width="35" height="20" rx="3" fill="#0f172a" />
      <path d="M30 48 L55 48 L51 66 L34 66 Z" fill="#f8fafc" /> {/* White Bib */}
      <circle cx="42.5" cy="56" r="3" fill="#ef4444" /> {/* Red chest gem/ribbon */}

      {/* Left Arm */}
      <rect
        x="13" y="49" width="12" height="8" rx="4" fill="#0f172a"
        style={{
          transformOrigin: '21px 53px',
          transform: isWaving ? 'rotate(-45deg)' : isEating ? 'rotate(-25deg)' : 'rotate(12deg)',
          transition: 'transform 0.4s ease',
        }}
      />
      <circle cx="13" cy="53" r="4.5" fill={skinColor}
        style={{
          transformOrigin: '13px 53px',
          transform: isWaving ? 'rotate(-45deg) translate(-7px, -7px)' : '',
          transition: 'transform 0.4s ease',
        }}
      />

      {/* Right Arm */}
      <rect
        x="60" y="49" width="12" height="8" rx="4" fill="#0f172a"
        style={{
          transformOrigin: '63px 53px',
          transform: isWaving ? 'rotate(45deg)' : 'rotate(-12deg)',
          transition: 'transform 0.4s ease',
        }}
      />
      <circle cx="72" cy="53" r="4.5" fill={skinColor} />

      {/* Head & Neck */}
      <rect x="37" y="42" width="11" height="8" fill={skinColor} />
      <ellipse cx="42.5" cy="27" rx="22" ry="20" fill={skinColor} />

      {/* Maid Frilly Headband */}
      <path d="M 23 20 Q 42.5 13 62 20" stroke="#f8fafc" strokeWidth="5.5" strokeLinecap="round" fill="none" />
      <path d="M 24 20 Q 42.5 14 61 20" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      {/* Hair (Maid Twintails) */}
      <ellipse cx="42.5" cy="11" rx="21" ry="8" fill={hairColor} />
      {/* Twin tails flowing down */}
      <path d="M 12 22 Q 3 35 11 52 Q 17 38 17 22 Z" fill={hairColor} /> {/* Left Twintail */}
      <path d="M 73 22 Q 82 35 74 52 Q 68 38 68 22 Z" fill={hairColor} /> {/* Right Twintail */}
      {/* Front bangs */}
      <path d="M 23 12 L 28 26 L 32 12 L 38 27 L 43 12 L 47 27 L 52 12 L 57 26 L 62 12 Z" fill={hairColor} />

      {/* Cheeks */}
      <ellipse cx="29" cy="32" rx="5" ry="3" fill={cheekColor} opacity="0.6" />
      <ellipse cx="56" cy="32" rx="5" ry="3" fill={cheekColor} opacity="0.6" />

      {/* Eyes (Large Green Anime Eyes) */}
      {isSleeping ? (
        <>
          <path d="M 27 28 Q 32 32 37 28" stroke="#14532d" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M 48 28 Q 53 32 58 28" stroke="#14532d" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <text x="64" y="12" fontSize="9" fill="#10b981" fontWeight="bold">z</text>
          <text x="70" y="7" fontSize="6" fill="#10b981" fontWeight="bold">z</text>
        </>
      ) : isSurprised ? (
          <>
            <circle cx="32" cy="27" r="5.5" fill="#047857" />
            <circle cx="53" cy="27" r="5.5" fill="#047857" />
            <circle cx="32" cy="27" r="3.5" fill={eyeColor} />
            <circle cx="53" cy="27" r="3.5" fill={eyeColor} />
            <circle cx="34" cy="25" r="1.5" fill="white" />
            <circle cx="55" cy="25" r="1.5" fill="white" />
          </>
      ) : (
        <>
          {/* Beautiful Shiny Emerald Eyes */}
          <ellipse cx="32" cy="28" rx="5.2" ry="7" fill="#059669" />
          <ellipse cx="53" cy="28" rx="5.2" ry="7" fill="#059669" />
          <ellipse cx="32" cy="28" rx="3.5" ry="5.5" fill={eyeColor} />
          <ellipse cx="53" cy="28" rx="3.5" ry="5.5" fill={eyeColor} />
          <circle cx="33.5" cy="25" r="1.8" fill="white" />
          <circle cx="54.5" cy="25" r="1.8" fill="white" />
          <circle cx="30.5" cy="30" r="1" fill="white" opacity="0.8" />
          <circle cx="51.5" cy="30" r="1" fill="white" opacity="0.8" />
          {/* Upper lid lashes */}
          <path d="M 26 23 C 29 21 35 21 38 23" stroke={eyeColor} strokeWidth="2.2" strokeLinecap="round" fill="none" />
          <path d="M 47 23 C 50 21 56 21 59 23" stroke={eyeColor} strokeWidth="2.2" strokeLinecap="round" fill="none" />
        </>
      )}

      {/* Mouth */}
      {isSurprised ? (
        <circle cx="42.5" cy="37" r="3.5" fill={eyeColor} />
      ) : isEating ? (
        <>
          <path d="M 38 37 Q 42.5 41 47 37" stroke={eyeColor} strokeWidth="2" strokeLinecap="round" fill="none" />
          {/* Popcorn box */}
          <rect x="54" y="58" width="15" height="17" rx="2" fill="#0f172a" />
          <rect x="54" y="58" width="15" height="5" rx="1" fill="#f8fafc" />
          <text x="56" y="68" fontSize="7" fill="white">🍿</text>
        </>
      ) : (
        <path d="M 38 37 Q 42.5 41 47 37" stroke={eyeColor} strokeWidth="2" strokeLinecap="round" fill="none" />
      )}

      {/* 3D Glasses Overlay in Idle */}
      {state === 'idle' && (
        <>
          <rect x="22" y="23" width="14" height="9" rx="3" fill="none" stroke="#00d4ff" strokeWidth="1.8" />
          <rect x="49" y="23" width="14" height="9" rx="3" fill="none" stroke="#ff006e" strokeWidth="1.8" />
          <line x1="36" y1="27" x2="49" y2="27" stroke="#2D2D2D" strokeWidth="1.8" />
        </>
      )}
    </svg>
  );
}

/* ── Single Character Component ─────────────────────────────────── */
interface ChibiCharacterProps {
  character: CharacterState;
  onHover: (id: string, hovered: boolean) => void;
}

export default function ChibiCharacter({ character, onHover }: ChibiCharacterProps) {
  const isPlayerMode = useUIStore(s => s.isPlayerMode);

  const animStyle: React.CSSProperties = {
    animation:
      character.action === 'idle'    ? 'character-bob 2s ease-in-out infinite' :
      character.action === 'walking' ? 'character-bob 0.5s ease-in-out infinite' :
      character.action === 'waving'  ? 'character-bob 1s ease-in-out infinite' :
      'none',
    transform: character.direction === 'left' ? 'scaleX(-1)' : 'scaleX(1)',
    transition: 'transform 0.3s ease',
  };

  return (
    <div
      className="character-wrapper"
      style={{
        left: `${character.x}%`,
        top: `${character.y}%`,
        transform: 'translate(-50%, -50%)',
        opacity: isPlayerMode ? 0 : 1,
        scale: isPlayerMode ? '0' : '1',
        transition: 'opacity 0.5s ease, scale 0.5s ease',
        zIndex: 40,
        filter: character.isHovered
          ? 'drop-shadow(0 0 12px rgba(0, 212, 255, 0.8))'
          : 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))',
      }}
      onMouseEnter={() => onHover(character.id, true)}
      onMouseLeave={() => onHover(character.id, false)}
    >
      {/* Speech bubble */}
      {character.showBubble && (
        <SpeechBubble text={character.bubbleText} />
      )}

      {/* Character SVG */}
      <div style={animStyle}>
        <ChibiSVG
          state={character.action}
          skinColor={character.skinColor}
          hairColor={character.hairColor}
          clothColor={character.clothColor}
          id={character.id}
        />
      </div>
    </div>
  );
}
