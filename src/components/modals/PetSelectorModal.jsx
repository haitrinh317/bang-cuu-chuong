import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { masteryEngine } from '../../services/masteryEngine';
import VoxelCompanion from '../common/VoxelCompanion';
import { soundService } from '../../services/soundService';
import { X, Check, Lock } from 'lucide-react';

export default function PetSelectorModal({ isOpen, onClose }) {
  const { gameState, updatePet } = useGame();
  const [selectedPet, setSelectedPet] = useState(gameState.selectedPet);
  const [petName, setPetName] = useState(gameState.petName);
  const [playerName, setPlayerName] = useState(gameState.playerName);

  if (!isOpen) return null;

  const totalMastered = masteryEngine.getTotalMasteredFacts(gameState.masteryMap);
  const isUnicornUnlocked = totalMastered >= 200;

  const pets = [
    {
      id: 'bunny',
      title: 'Thỏ Bông Voxel',
      desc: 'Tai dài lúc lắc, chuyên mách nước các mẹo đếm bước nhảy.',
      isUnlocked: true,
    },
    {
      id: 'kitty',
      title: 'Mèo Mun Voxel',
      desc: 'Đeo nơ hồng xinh xắn, mắt to tròn, thích tung mưa tim cổ vũ.',
      isUnlocked: true,
    },
    {
      id: 'corgi',
      title: 'Cún Vàng Voxel',
      desc: 'Tinh nghịch, mang ba lô lưu giữ các phép tính cần ôn luyện.',
      isUnlocked: true,
    },
    {
      id: 'unicorn',
      title: 'Kỳ Lân Cầu Vồng',
      desc: 'Thú cưng Huyền Thoại tối thượng (Mở khóa khi hoàn thành 200 phép tính)!',
      isUnlocked: isUnicornUnlocked,
    },
  ];

  const handleSave = () => {
    soundService.playVictoryFanfare();
    updatePet(selectedPet, petName, playerName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-purple-950/60 backdrop-blur-sm animate-fade-in select-none">
      <div className="w-full max-w-lg bg-white rounded-3xl p-4 sm:p-6 border-4 border-purple-300 shadow-2xl relative overflow-hidden flex flex-col max-h-[92vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-2 rounded-2xl bg-purple-100 hover:bg-purple-200 text-purple-700 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Modal Title */}
        <div className="text-center mb-4">
          <h3 className="text-2xl font-black text-purple-900 font-display">
            Chọn Bạn Đồng Hành Voxel 🐾
          </h3>
          <p className="text-xs text-purple-700 mt-0.5">
            Bé hãy chọn người bạn cùng leo tháp Obby và đặt tên cho bạn ấy nhé!
          </p>
        </div>

        {/* Name Customization Inputs */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-[11px] font-black text-purple-800 uppercase tracking-wider block mb-1">
              Tên của bé:
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-purple-50 border-2 border-purple-200 font-bold text-sm text-purple-900 focus:outline-none focus:border-purple-500 font-display"
              placeholder="Mai Nhiên"
            />
          </div>
          <div>
            <label className="text-[11px] font-black text-purple-800 uppercase tracking-wider block mb-1">
              Tên bạn thú cưng:
            </label>
            <input
              type="text"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-purple-50 border-2 border-purple-200 font-bold text-sm text-purple-900 focus:outline-none focus:border-purple-500 font-display"
              placeholder="Thỏ Ngọc"
            />
          </div>
        </div>

        {/* Pets Selection Grid */}
        <div className="grid grid-cols-2 gap-3 overflow-y-auto p-1 mb-4 flex-1">
          {pets.map((p) => {
            const isSelected = selectedPet === p.id;
            return (
              <button
                key={p.id}
                disabled={!p.isUnlocked}
                onClick={() => {
                  soundService.playBlockPlace();
                  setSelectedPet(p.id);
                }}
                className={`p-3 rounded-2xl border-4 text-center flex flex-col items-center justify-between transition-all ${
                  isSelected
                    ? 'border-purple-600 bg-purple-50 shadow-md scale-102'
                    : p.isUnlocked
                    ? 'border-purple-200 bg-white hover:bg-purple-50/50'
                    : 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="h-20 flex items-center justify-center relative">
                  <VoxelCompanion pet={p.id} size={64} hat={isSelected ? gameState.customHat : null} />
                  {!p.isUnlocked && (
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center rounded-xl">
                      <Lock size={20} className="text-gray-600" />
                    </div>
                  )}
                </div>

                <div className="w-full mt-2">
                  <h4 className="text-xs font-black text-purple-900 font-display flex items-center justify-center gap-1">
                    <span>{p.title}</span>
                    {isSelected && <Check size={14} className="text-purple-600" />}
                  </h4>
                  <p className="text-[10px] text-purple-700 mt-0.5 line-clamp-2">
                    {p.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Confirm Button */}
        <button
          onClick={handleSave}
          className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black text-base shadow-lg border-b-4 border-purple-800 active:border-b-0 active:translate-y-1 transition-all font-display"
        >
          Xác Nhận Bạn Đồng Hành ✨
        </button>
      </div>
    </div>
  );
}
