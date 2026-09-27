import React from 'react';
import { Volume2, VolumeX, Settings, Sparkles, Trophy } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { masteryEngine } from '../../services/masteryEngine';
import VoxelCompanion from './VoxelCompanion';

export default function Header({ onOpenPetModal, onOpenSettingsModal }) {
  const { gameState, isMuted, toggleMute } = useGame();
  const masteredCount = masteryEngine.getTotalMasteredFacts(gameState.masteryMap);

  return (
    <div className="w-full border-b-2 border-purple-100/90 px-2.5 sm:px-4 py-2 flex items-center justify-between select-none">
      {/* Brand & Pet Info */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onOpenPetModal}
          className="flex items-center gap-2 p-1 sm:p-1.5 rounded-2xl bg-purple-100 hover:bg-purple-200 transition-colors border-2 border-purple-300 text-left group min-h-[44px]"
          title="Đổi bạn thú cưng"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm">
            <VoxelCompanion pet={gameState.selectedPet} hat={gameState.customHat} size={34} />
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-black text-purple-900 group-hover:text-purple-700 font-display">
              {gameState.playerName}
            </div>
            <div className="text-xs text-purple-600 font-extrabold">
              🐾 {gameState.petName}
            </div>
          </div>
        </button>

        <h1 className="text-lg sm:text-xl md:text-2xl font-black text-purple-900 tracking-tight flex items-center gap-1.5 font-display">
          <span className="text-xl sm:text-2xl">🏰</span>
          <span className="hidden md:inline bg-gradient-to-r from-purple-700 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
            Cửu Chương Voxel
          </span>
        </h1>
      </div>

      {/* Rewards & Counters */}
      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
        {/* Emeralds */}
        <div
          className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-2xl bg-emerald-100/90 border-2 border-emerald-300 shadow-sm"
          title="Ngọc Lục Bảo để xây đảo và mua đồ"
        >
          <span className="text-sm sm:text-base">🟩</span>
          <span className="text-xs sm:text-sm md:text-base font-extrabold text-emerald-800 font-mono">
            {gameState.emeralds}
          </span>
        </div>

        {/* Diamonds */}
        <div
          className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-2xl bg-cyan-100/90 border-2 border-cyan-300 shadow-sm"
          title="Kim Cương kiếm từ Tốc độ tia chớp"
        >
          <span className="text-sm sm:text-base">💎</span>
          <span className="text-xs sm:text-sm md:text-base font-extrabold text-cyan-800 font-mono">
            {gameState.diamonds}
          </span>
        </div>

        {/* Mastered Crown */}
        <div
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-100/90 border-2 border-amber-300 shadow-sm"
          title="Số phép tính đã làm chủ vương miện vàng"
        >
          <span className="text-base">👑</span>
          <span className="text-sm font-extrabold text-amber-800 font-mono">
            {masteredCount}/200
          </span>
        </div>

        {/* Mute toggle */}
        <button
          onClick={toggleMute}
          className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-700 border-2 border-purple-200 transition-colors"
          title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>

        {/* Settings / Parent Corner */}
        <button
          onClick={onOpenSettingsModal}
          className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-700 border-2 border-purple-200 transition-colors"
          title="Cài đặt & Góc Phụ Huynh"
        >
          <Settings size={18} />
        </button>
      </div>
    </div>
  );
}
