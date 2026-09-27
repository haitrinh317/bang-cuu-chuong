import React from 'react';
import { useGame } from '../../context/GameContext';
import { ISLAND_LANDMARKS, CRAFTING_CATALOG } from '../../data/skyblockData';
import { masteryEngine } from '../../services/masteryEngine';
import VoxelCompanion from '../common/VoxelCompanion';
import VoxelBlock from '../common/VoxelBlock';
import { Sparkles, Trophy, ArrowRight } from 'lucide-react';

export default function SkyblockIslandView({ onSelectTab }) {
  const { gameState } = useGame();
  const overallPercent = masteryEngine.getOverallMasteryPercent(gameState.masteryMap);
  const masteredCount = masteryEngine.getTotalMasteredFacts(gameState.masteryMap);

  return (
    <div className="skyblock-view flex flex-col items-center max-w-5xl mx-auto p-4 md:p-6 animate-fade-in">
      {/* Welcome Banner */}
      <div className="w-full bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 rounded-3xl p-5 md:p-7 text-white shadow-xl mb-6 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold mb-2">
              <Sparkles size={14} className="text-yellow-300" />
              <span>Thế Giới Khối Hộp Của Bé</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black font-display tracking-tight">
              Đảo Bay Cửu Chương Mai Nhiên 🏝️
            </h2>
            <p className="text-purple-100 text-sm md:text-base mt-1 max-w-xl">
              Giải đúng các phép tính nhân chia để nhận <strong className="text-emerald-300">Ngọc Lục Bảo</strong> và <strong className="text-cyan-300">Kim Cương</strong>, cùng bạn <strong className="text-pink-200">{gameState.petName}</strong> xây dựng vương quốc mây rực rỡ!
            </p>
          </div>

          <button
            onClick={() => onSelectTab('obby')}
            className="self-start md:self-auto flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-sm md:text-base shadow-lg border-b-4 border-amber-600 active:border-b-0 active:translate-y-1 transition-all"
          >
            <span>Nhảy Obby Ngay</span>
            <ArrowRight size={18} />
          </button>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute -right-8 -bottom-10 opacity-20 text-9xl select-none">
          🏰
        </div>
      </div>

      {/* Progress to Next Landmark */}
      <div className="w-full bg-white rounded-3xl p-5 border-4 border-purple-200 shadow-md mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-purple-900 flex items-center gap-1.5 font-display">
            <Trophy size={16} className="text-amber-500" />
            <span>Tiến độ làm chủ 200 phép tính:</span>
          </span>
          <span className="text-sm font-extrabold text-purple-700 font-mono">
            {masteredCount} / 200 ({overallPercent}%)
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-4 bg-purple-100 rounded-full overflow-hidden p-0.5 border border-purple-200">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500 rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${Math.max(5, overallPercent)}%` }}
          />
        </div>
      </div>

      {/* Floating Island 3D Canvas Showcase */}
      <div className="w-full bg-gradient-to-b from-sky-200 via-indigo-100 to-purple-200 rounded-3xl p-6 md:p-10 border-4 border-purple-300 shadow-2xl relative overflow-hidden mb-8 min-h-[380px] flex flex-col items-center justify-between">
        {/* Sky Clouds */}
        <div className="absolute top-4 left-6 text-4xl opacity-70 animate-pulse">☁️</div>
        <div className="absolute top-12 right-10 text-5xl opacity-60">☁️</div>
        <div className="absolute top-28 left-20 text-3xl opacity-50">✨</div>

        {/* Floating Balloons or Sky Decor */}
        {gameState.islandDecor.includes('floating_balloon') && (
          <div className="absolute top-6 left-1/3 animate-bounce text-4xl drop-shadow-md">
            🎈
          </div>
        )}

        {/* Main Island Platform */}
        <div className="relative z-10 flex flex-col items-center mt-6">
          {/* Pet standing proudly */}
          <div className="mb-2">
            <VoxelCompanion
              pet={gameState.selectedPet}
              hat={gameState.customHat}
              size={110}
              mood="jumping"
              speech={`Chào Mai Nhiên! Đảo của chúng mình đang có ${gameState.islandDecor.length} món đồ trang trí nè!`}
            />
          </div>

          {/* Island Green Surface (Voxel Grid) */}
          <div className="grid grid-cols-5 md:grid-cols-7 gap-1 md:gap-2 p-3 bg-emerald-600/90 rounded-3xl border-4 border-emerald-700 shadow-2xl">
            {Array.from({ length: 14 }).map((_, idx) => {
              const decorItem = gameState.islandDecor[idx % gameState.islandDecor.length];
              const catalogItem = decorItem ? CRAFTING_CATALOG.find((c) => c.id === decorItem) : null;

              return (
                <div key={idx} className="relative flex flex-col items-center">
                  <VoxelBlock
                    type={idx % 3 === 0 ? 'emerald' : idx % 5 === 0 ? 'diamond' : 'grass'}
                    size={46}
                  />
                  {catalogItem && (
                    <span className="absolute -top-3 text-lg animate-bounce drop-shadow">
                      {catalogItem.icon}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Island Action Bar */}
        <div className="relative z-10 mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => onSelectTab('crafting')}
            className="px-4 py-2 rounded-2xl bg-white/90 hover:bg-white text-purple-900 font-extrabold text-sm border-2 border-purple-300 shadow-md flex items-center gap-1.5 transition-all"
          >
            <span>🛠️ Mua thêm đồ trang trí đảo</span>
          </button>
          <button
            onClick={() => onSelectTab('discovery')}
            className="px-4 py-2 rounded-2xl bg-white/90 hover:bg-white text-purple-900 font-extrabold text-sm border-2 border-purple-300 shadow-md flex items-center gap-1.5 transition-all"
          >
            <span>🌸 Xem Vườn Khám Phá</span>
          </button>
        </div>
      </div>

      {/* Landmarks Checklist */}
      <div className="w-full">
        <h3 className="text-xl font-black text-purple-900 mb-4 flex items-center gap-2 font-display">
          <span>🏛️</span>
          <span>Kỳ Quan Đảo Bay Mai Nhiên</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ISLAND_LANDMARKS.map((landmark) => {
            const isUnlocked = gameState.unlockedLandmarks.includes(landmark.id);
            return (
              <div
                key={landmark.id}
                className={`p-4 rounded-3xl border-4 transition-all duration-300 ${
                  isUnlocked
                    ? 'bg-white border-purple-300 shadow-lg'
                    : 'bg-gray-50/80 border-gray-200 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-3xl p-2 rounded-2xl bg-purple-100 border border-purple-200">
                    {landmark.icon}
                  </span>
                  <span
                    className={`text-xs font-black px-2.5 py-1 rounded-full ${
                      isUnlocked
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {isUnlocked ? '✅ Đã mở khóa' : `Cần ${landmark.requiredMastery}%`}
                  </span>
                </div>

                <h4 className="text-base font-extrabold text-purple-900 mt-3 font-display">
                  {landmark.name}
                </h4>
                <p className="text-xs text-purple-700 mt-1 line-clamp-2">
                  {landmark.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
