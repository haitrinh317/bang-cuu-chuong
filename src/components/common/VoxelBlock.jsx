import React from 'react';
import { soundService } from '../../services/soundService';

export default function VoxelBlock({
  type = 'grass', // 'grass' | 'wood' | 'emerald' | 'diamond' | 'gold' | 'amethyst' | 'cloud'
  size = 64,
  label = '',
  onClick = null,
  active = false,
  cracked = false,
  className = '',
}) {
  const handleClick = (e) => {
    soundService.playBlockPlace();
    if (onClick) onClick(e);
  };

  const colors = {
    grass: { top: '#86EFAC', left: '#78716C', right: '#57534E', border: '#4ADE80' },
    wood: { top: '#FDE047', left: '#D97706', right: '#B45309', border: '#F59E0B' },
    emerald: { top: '#6EE7B7', left: '#059669', right: '#047857', border: '#10B981' },
    diamond: { top: '#A5F3FC', left: '#0284C7', right: '#0369A1', border: '#38BDF8' },
    gold: { top: '#FEF08A', left: '#EAB308', right: '#CA8A04', border: '#FACC15' },
    amethyst: { top: '#E9D5FF', left: '#9333EA', right: '#7E22CE', border: '#C084FC' },
    cloud: { top: '#F8FAFC', left: '#CBD5E1', right: '#94A3B8', border: '#E2E8F0' },
  }[type] || { top: '#86EFAC', left: '#78716C', right: '#57534E', border: '#4ADE80' };

  return (
    <div
      onClick={handleClick}
      className={`voxel-block-container inline-flex flex-col items-center justify-center cursor-pointer select-none transition-transform duration-200 active:scale-90 hover:-translate-y-1 ${
        active ? 'scale-110 drop-shadow-xl' : ''
      } ${className}`}
      style={{ width: size, height: size * 1.15 }}
    >
      <svg
        viewBox="0 0 100 115"
        width="100%"
        height="100%"
        className={cracked ? 'filter drop-shadow-red' : ''}
      >
        <defs>
          <filter id={`glow-${type}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Isometric Cube Faces */}
        {/* Top Face */}
        <polygon
          points="50,5 90,27 50,50 10,27"
          fill={colors.top}
          stroke={colors.border}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Left Face */}
        <polygon
          points="10,27 50,50 50,95 10,72"
          fill={colors.left}
          stroke={colors.border}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Right Face */}
        <polygon
          points="50,50 90,27 90,72 50,95"
          fill={colors.right}
          stroke={colors.border}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Grass overhang detail for grass block */}
        {type === 'grass' && (
          <path
            d="M 10,27 L 50,50 L 50,60 L 40,55 L 30,62 L 20,53 L 10,60 Z"
            fill="#4ADE80"
            opacity="0.8"
          />
        )}

        {/* Crack pattern if cracked/weak spot */}
        {cracked && (
          <path
            d="M 45,20 L 55,35 L 48,50 L 58,70 L 45,85"
            fill="none"
            stroke="#EF4444"
            strokeWidth="3"
            strokeLinecap="round"
          />
        )}

        {/* Centered label or number */}
        {label && (
          <text
            x="50"
            y="65"
            fill="#FFFFFF"
            fontFamily="Fredoka, sans-serif"
            fontWeight="bold"
            fontSize="26"
            textAnchor="middle"
            stroke="#1E1B4B"
            strokeWidth="3.5"
            paintOrder="stroke fill"
          >
            {label}
          </text>
        )}
      </svg>
    </div>
  );
}
