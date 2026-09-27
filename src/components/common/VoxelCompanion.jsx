import React from 'react';

export default function VoxelCompanion({
  pet = 'bunny',
  size = 120,
  mood = 'happy', // 'happy' | 'jumping' | 'thinking' | 'celebrate'
  speech = null,
  hat = null,
  className = '',
}) {
  const isJumping = mood === 'jumping';
  const isCelebrate = mood === 'celebrate';

  return (
    <div
      className={`voxel-companion-wrapper relative flex flex-col items-center select-none w-full ${className}`}
      style={{ minHeight: size }}
    >
      {/* Speech bubble */}
      {speech && (
        <div
          className="companion-speech-bubble mb-2 px-5 py-2.5 bg-white/95 border-3 border-purple-300 rounded-3xl shadow-xl text-base md:text-lg text-purple-950 font-bold text-center animate-fade-in relative z-10 font-display"
          style={{
            width: 'max-content',
            minWidth: '220px',
            maxWidth: 'min(380px, 92vw)',
            lineHeight: 1.5,
            wordBreak: 'normal',
            overflowWrap: 'break-word',
          }}
        >
          {speech}
          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-purple-300" />
        </div>
      )}

      {/* SVG Pet Container */}
      <div
        className={`companion-body transition-transform duration-300 ${
          isJumping ? 'animate-bounce' : isCelebrate ? 'animate-wiggle' : ''
        }`}
        style={{ width: size, height: size, flexShrink: 0 }}
      >
        <svg
          viewBox="0 0 100 100"
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="bunnyBody" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFF1F2" />
              <stop offset="100%" stopColor="#FECDD3" />
            </linearGradient>
            <linearGradient id="kittyBody" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#EDE9FE" />
              <stop offset="100%" stopColor="#DDD6FE" />
            </linearGradient>
            <linearGradient id="corgiBody" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FED7AA" />
              <stop offset="100%" stopColor="#FDBA74" />
            </linearGradient>
            <linearGradient id="unicornBody" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#E0E7FF" />
              <stop offset="100%" stopColor="#C7D2FE" />
            </linearGradient>
            <linearGradient id="rainbowMane" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#F472B6" />
              <stop offset="50%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#60A5FA" />
            </linearGradient>
            <linearGradient id="goldCrown" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="100%" stopColor="#CA8A04" />
            </linearGradient>
            <linearGradient id="wizardHatGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#6B21A8" />
            </linearGradient>
            <linearGradient id="fairyWings" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#A5F3FC" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#F472B6" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Fairy Wings Accessory (Behind) */}
          {hat === 'hat_wings' && (
            <g className="companion-wings animate-pulse">
              <path
                d="M 20,40 Q 5,15 15,45 Q 8,60 25,55 Z"
                fill="url(#fairyWings)"
                stroke="#38BDF8"
                strokeWidth="1.5"
              />
              <path
                d="M 80,40 Q 95,15 85,45 Q 92,60 75,55 Z"
                fill="url(#fairyWings)"
                stroke="#38BDF8"
                strokeWidth="1.5"
              />
            </g>
          )}

          {/* PET: BUNNY */}
          {pet === 'bunny' && (
            <g id="voxel-bunny">
              {/* Ears */}
              <rect x="28" y="10" width="14" height="30" rx="6" fill="#FECDD3" stroke="#F43F5E" strokeWidth="2" />
              <rect x="32" y="16" width="6" height="20" rx="3" fill="#FDA4AF" />
              <rect x="58" y="10" width="14" height="30" rx="6" fill="#FECDD3" stroke="#F43F5E" strokeWidth="2" />
              <rect x="62" y="16" width="6" height="20" rx="3" fill="#FDA4AF" />
              {/* Head / Body Box */}
              <rect x="22" y="32" width="56" height="50" rx="14" fill="url(#bunnyBody)" stroke="#F43F5E" strokeWidth="2.5" />
              {/* Cheeks */}
              <circle cx="30" cy="62" r="5" fill="#FB7185" opacity="0.6" />
              <circle cx="70" cy="62" r="5" fill="#FB7185" opacity="0.6" />
              {/* Eyes */}
              <rect x="34" y="48" width="7" height="10" rx="3.5" fill="#1E293B" />
              <circle cx="36" cy="51" r="2" fill="#FFFFFF" />
              <rect x="59" y="48" width="7" height="10" rx="3.5" fill="#1E293B" />
              <circle cx="61" cy="51" r="2" fill="#FFFFFF" />
              {/* Nose & Mouth */}
              <polygon points="50,60 47,56 53,56" fill="#E11D48" />
              <path d="M 46,63 Q 50,66 54,63" fill="none" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" />
              {/* Paws */}
              <rect x="30" y="78" width="12" height="8" rx="4" fill="#FDA4AF" stroke="#F43F5E" strokeWidth="1.5" />
              <rect x="58" y="78" width="12" height="8" rx="4" fill="#FDA4AF" stroke="#F43F5E" strokeWidth="1.5" />
            </g>
          )}

          {/* PET: KITTY */}
          {pet === 'kitty' && (
            <g id="voxel-kitty">
              {/* Cat Ears */}
              <polygon points="24,36 18,16 38,26" fill="#DDD6FE" stroke="#7C3AED" strokeWidth="2" />
              <polygon points="24,32 20,20 34,26" fill="#F472B6" />
              <polygon points="76,36 82,16 62,26" fill="#DDD6FE" stroke="#7C3AED" strokeWidth="2" />
              <polygon points="76,32 80,20 66,26" fill="#F472B6" />
              {/* Head Box */}
              <rect x="22" y="28" width="56" height="52" rx="14" fill="url(#kittyBody)" stroke="#7C3AED" strokeWidth="2.5" />
              {/* Whiskers */}
              <line x1="16" y1="56" x2="26" y2="58" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" />
              <line x1="16" y1="64" x2="26" y2="62" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" />
              <line x1="84" y1="56" x2="74" y2="58" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" />
              <line x1="84" y1="64" x2="74" y2="62" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" />
              {/* Eyes */}
              <ellipse cx="36" cy="50" rx="5" ry="7" fill="#4C1D95" />
              <circle cx="35" cy="48" r="2" fill="#FFFFFF" />
              <ellipse cx="64" cy="50" rx="5" ry="7" fill="#4C1D95" />
              <circle cx="63" cy="48" r="2" fill="#FFFFFF" />
              {/* Nose & Bow */}
              <polygon points="50,58 47,55 53,55" fill="#EC4899" />
              <path d="M 46,62 Q 50,65 54,62" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" />
              {/* Cute Bow */}
              <polygon points="45,74 50,77 45,80" fill="#F43F5E" />
              <polygon points="55,74 50,77 55,80" fill="#F43F5E" />
              <circle cx="50" cy="77" r="3" fill="#FECDD3" />
            </g>
          )}

          {/* PET: CORGI */}
          {pet === 'corgi' && (
            <g id="voxel-corgi">
              {/* Ears */}
              <polygon points="26,34 16,14 38,22" fill="#FDBA74" stroke="#EA580C" strokeWidth="2" />
              <polygon points="26,30 20,18 34,24" fill="#FED7AA" />
              <polygon points="74,34 84,14 62,22" fill="#FDBA74" stroke="#EA580C" strokeWidth="2" />
              <polygon points="74,30 80,18 66,24" fill="#FED7AA" />
              {/* Head Box */}
              <rect x="22" y="28" width="56" height="52" rx="14" fill="url(#corgiBody)" stroke="#EA580C" strokeWidth="2.5" />
              {/* White muzzle blaze */}
              <polygon points="50,42 42,76 58,76" fill="#FFF7ED" />
              {/* Eyes */}
              <circle cx="36" cy="50" r="5" fill="#431407" />
              <circle cx="35" cy="48" r="1.8" fill="#FFFFFF" />
              <circle cx="64" cy="50" r="5" fill="#431407" />
              <circle cx="63" cy="48" r="1.8" fill="#FFFFFF" />
              {/* Cheeks */}
              <circle cx="28" cy="60" r="4" fill="#FB923C" opacity="0.6" />
              <circle cx="72" cy="60" r="4" fill="#FB923C" opacity="0.6" />
              {/* Dog Nose & Tongue */}
              <ellipse cx="50" cy="60" rx="4.5" ry="3" fill="#1C1917" />
              <path d="M 48,66 Q 50,72 52,66" fill="#F43F5E" stroke="#E11D48" strokeWidth="1" />
            </g>
          )}

          {/* PET: UNICORN (Legendary Reward) */}
          {pet === 'unicorn' && (
            <g id="voxel-unicorn">
              {/* Golden Horn */}
              <polygon points="50,4 45,26 55,26" fill="url(#goldCrown)" stroke="#CA8A04" strokeWidth="1.5" />
              <line x1="47" y1="12" x2="53" y2="12" stroke="#FEF08A" strokeWidth="1" />
              <line x1="46" y1="18" x2="54" y2="18" stroke="#FEF08A" strokeWidth="1" />
              {/* Rainbow Mane */}
              <path d="M 26,26 Q 16,36 22,54" fill="none" stroke="url(#rainbowMane)" strokeWidth="6" strokeLinecap="round" />
              {/* Head Box */}
              <rect x="22" y="26" width="56" height="54" rx="14" fill="url(#unicornBody)" stroke="#6366F1" strokeWidth="2.5" />
              {/* Eyes */}
              <ellipse cx="36" cy="48" rx="5" ry="7" fill="#312E81" />
              <circle cx="35" cy="46" r="2" fill="#FFFFFF" />
              <ellipse cx="64" cy="48" rx="5" ry="7" fill="#312E81" />
              <circle cx="63" cy="46" r="2" fill="#FFFFFF" />
              {/* Stars on cheek */}
              <text x="70" y="66" fontSize="8" fill="#F59E0B">✨</text>
              <ellipse cx="50" cy="62" rx="4" ry="2.5" fill="#C7D2FE" />
            </g>
          )}

          {/* ACCESSORY HATS */}
          {hat === 'hat_wizard' && (
            <g id="hat-wizard">
              <ellipse cx="50" cy="27" rx="26" ry="6" fill="#581C87" />
              <polygon points="50,2 34,26 66,26" fill="url(#wizardHatGrad)" stroke="#4C1D95" strokeWidth="1.5" />
              <circle cx="50" cy="4" r="3" fill="#FACC15" />
              <path d="M 38,24 Q 50,28 62,24" stroke="#FDE047" strokeWidth="2.5" fill="none" />
            </g>
          )}

          {hat === 'hat_crown' && (
            <g id="hat-crown">
              <polygon points="30,26 30,12 40,20 50,8 60,20 70,12 70,26" fill="url(#goldCrown)" stroke="#A16207" strokeWidth="2" strokeLinejoin="round" />
              <circle cx="30" cy="11" r="2.5" fill="#EF4444" />
              <circle cx="50" cy="7" r="3" fill="#3B82F6" />
              <circle cx="70" cy="11" r="2.5" fill="#10B981" />
              <rect x="30" y="23" width="40" height="4" fill="#CA8A04" />
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}
