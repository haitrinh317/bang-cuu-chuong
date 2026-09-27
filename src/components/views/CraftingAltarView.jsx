import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { CRAFTING_CATALOG } from '../../data/skyblockData';
import { soundService } from '../../services/soundService';
import VoxelCompanion from '../common/VoxelCompanion';
import confetti from 'canvas-confetti';
import { Hammer, Sparkles, Check } from 'lucide-react';

export default function CraftingAltarView() {
  const { gameState, craftItem } = useGame();
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'decor' | 'accessory'
  const [craftMsg, setCraftMsg] = useState(null);

  const filteredItems = CRAFTING_CATALOG.filter((item) => {
    if (activeTab === 'all') return true;
    return item.type === activeTab;
  });

  const handleCraft = (itemId) => {
    const res = craftItem(itemId);
    if (res.success) {
      setCraftMsg({ type: 'success', text: `✨ Chế tạo thành công ${res.item.name}!` });
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } else {
      setCraftMsg({ type: 'error', text: res.message });
    }

    setTimeout(() => setCraftMsg(null), 3500);
  };

  return (
    <div className="crafting-view flex flex-col items-center max-w-5xl mx-auto p-4 md:p-6 animate-fade-in select-none">
      {/* Title */}
      <div className="w-full text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-xs font-bold text-amber-800 mb-2">
          <Hammer size={14} className="text-amber-600" />
          <span>Bàn Chế Tạo Minecraft Skyblock</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-purple-900 font-display">
          Xưởng Chế Tạo & Thời Trang Voxel 🛠️
        </h2>
        <p className="text-purple-700 text-sm mt-1">
          Dùng Ngọc Lục Bảo và Kim Cương để mua phụ kiện và đồ trang trí tuyệt đẹp cho Đảo Bay!
        </p>
      </div>

      {/* Companion Preview Studio */}
      <div className="w-full bg-gradient-to-r from-purple-200 via-pink-100 to-indigo-100 rounded-3xl p-6 border-4 border-purple-300 shadow-md mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 bg-white/80 rounded-2xl border-2 border-purple-200 flex items-center justify-center shadow-inner">
            <VoxelCompanion pet={gameState.selectedPet} hat={gameState.customHat} size={80} />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold text-purple-600 tracking-wider font-display">
              Bạn đồng hành hiện tại
            </div>
            <h3 className="text-xl font-black text-purple-900 font-display">
              🐾 {gameState.petName}
            </h3>
            <p className="text-xs text-purple-700 mt-0.5">
              Phụ kiện đang đội:{' '}
              <strong className="text-purple-900">
                {gameState.customHat
                  ? CRAFTING_CATALOG.find((c) => c.id === gameState.customHat)?.name
                  : 'Chưa có nón'}
              </strong>
            </p>
          </div>
        </div>

        {/* Currency balances */}
        <div className="flex items-center gap-3 bg-white/90 p-3 rounded-2xl border-2 border-purple-200 shadow-sm">
          <div className="flex items-center gap-1.5">
            <span className="text-lg">🟩</span>
            <span className="font-mono font-extrabold text-emerald-800 text-base">
              {gameState.emeralds}
            </span>
          </div>
          <div className="w-px h-6 bg-purple-200" />
          <div className="flex items-center gap-1.5">
            <span className="text-lg">💎</span>
            <span className="font-mono font-extrabold text-cyan-800 text-base">
              {gameState.diamonds}
            </span>
          </div>
        </div>
      </div>

      {/* Crafting Alert Message */}
      {craftMsg && (
        <div
          className={`w-full p-3 rounded-2xl text-center text-sm font-bold mb-4 animate-fade-in ${
            craftMsg.type === 'success'
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              : 'bg-rose-100 text-rose-800 border border-rose-300'
          }`}
        >
          {craftMsg.text}
        </div>
      )}

      {/* Catalog Tabs */}
      <div className="flex items-center gap-2 mb-5 sm:mb-6 overflow-x-auto no-scrollbar w-full pb-1" style={{ WebkitOverflowScrolling: 'touch' }}>
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3.5 sm:px-4 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all min-h-[44px] cursor-pointer flex-shrink-0 ${
            activeTab === 'all'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-white text-purple-800 border border-purple-200'
          }`}
        >
          Tất Cả
        </button>
        <button
          onClick={() => setActiveTab('decor')}
          className={`px-3.5 sm:px-4 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all min-h-[44px] cursor-pointer flex-shrink-0 ${
            activeTab === 'decor'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-white text-purple-800 border border-purple-200'
          }`}
        >
          🌺 Trang Trí Đảo
        </button>
        <button
          onClick={() => setActiveTab('accessory')}
          className={`px-3.5 sm:px-4 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all min-h-[44px] cursor-pointer flex-shrink-0 ${
            activeTab === 'accessory'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-white text-purple-800 border border-purple-200'
          }`}
        >
          👑 Nón & Phụ Kiện
        </button>
      </div>

      {/* Catalog Grid */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {filteredItems.map((item) => {
          const isOwned =
            item.type === 'decor'
              ? gameState.islandDecor.includes(item.id)
              : gameState.customHat === item.id;

          const canAfford =
            gameState.emeralds >= item.costEmeralds &&
            gameState.diamonds >= item.costDiamonds;

          return (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-4 sm:p-5 border-4 border-purple-200 shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-2.5 sm:mb-3">
                  <span className="text-3xl sm:text-4xl p-2 rounded-2xl bg-purple-50 border border-purple-200">
                    {item.icon}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {item.costEmeralds > 0 && (
                      <span className="text-xs font-bold text-emerald-800 px-2 py-0.5 rounded-full bg-emerald-100 flex items-center gap-1">
                        <span>🟩</span>
                        <span>{item.costEmeralds}</span>
                      </span>
                    )}
                    {item.costDiamonds > 0 && (
                      <span className="text-xs font-bold text-cyan-800 px-2 py-0.5 rounded-full bg-cyan-100 flex items-center gap-1">
                        <span>💎</span>
                        <span>{item.costDiamonds}</span>
                      </span>
                    )}
                  </div>
                </div>

                <h4 className="text-base font-black text-purple-900 font-display">
                  {item.name}
                </h4>
                <p className="text-xs text-purple-700 mt-1">{item.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-purple-100">
                {isOwned ? (
                  <div className="w-full py-2.5 rounded-xl bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center gap-1.5 min-h-[44px]">
                    <Check size={14} />
                    <span>Đã sở hữu / Đang dùng</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleCraft(item.id)}
                    disabled={!canAfford}
                    className={`w-full py-2.5 rounded-xl text-xs font-black shadow-md border-b-4 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-1.5 min-h-[46px] cursor-pointer ${
                      canAfford
                        ? 'bg-amber-400 hover:bg-amber-300 text-amber-950 border-amber-600'
                        : 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
                    }`}
                  >
                    <span>🛠️ Chế tạo ngay</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
