import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { masteryEngine } from '../../services/masteryEngine';
import { soundService } from '../../services/soundService';
import VoxelBlock from '../common/VoxelBlock';
import VoxelCompanion from '../common/VoxelCompanion';
import VoxelNumpad from '../common/VoxelNumpad';
import { ShieldCheck, HeartHandshake, Sparkles, RefreshCw } from 'lucide-react';

export default function WeakSpotAltarView() {
  const { gameState, recordAnswer } = useGame();
  const weakSpots = masteryEngine.getWeakSpots(gameState.masteryMap);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [numpadValue, setNumpadValue] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [startTime, setStartTime] = useState(Date.now());

  const handleSelectSpot = (spot) => {
    soundService.playBlockPlace();
    setSelectedSpot(spot);
    setNumpadValue('');
    setIsAnswered(false);
    setFeedback(null);
    setStartTime(Date.now());
  };

  const handleRepairAnswer = (answerStr) => {
    if (!selectedSpot || isAnswered) return;
    const num = parseInt(answerStr, 10);
    if (isNaN(num)) return;

    const speedMs = Date.now() - startTime;
    const isCorrect = num === selectedSpot.result;

    setIsAnswered(true);
    recordAnswer(selectedSpot.id, isCorrect, speedMs);

    if (isCorrect) {
      soundService.playEmeraldCollect();
      setFeedback({
        type: 'success',
        text: `🎉 Xuất sắc! Khối nứt đã được hàn gắn! Độ thành thạo tăng lên!`
      });
    } else {
      soundService.playWrongSoft();
      setFeedback({
        type: 'error',
        text: `💡 Hãy nhớ: ${selectedSpot.hint}`
      });
    }
  };

  return (
    <div className="weakspot-view flex flex-col items-center max-w-4xl mx-auto p-4 md:p-6 animate-fade-in select-none">
      {/* Header */}
      <div className="w-full text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 border border-rose-300 text-xs font-bold text-rose-800 mb-2">
          <HeartHandshake size={14} className="text-rose-600" />
          <span>Sửa Lỗi Tinh Nghịch & Lặp Lại Ngắt Quãng</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-purple-900 font-display">
          Sổ Tay Lỗ Hổng: Hàn Gắn Khối Nứt 🩹
        </h2>
        <p className="text-purple-700 text-sm mt-1">
          Nơi tập hợp các phép tính Mai Nhiên từng bấm nhầm để chúng mình cùng luyện lại thật vững vàng!
        </p>
      </div>

      {/* No Weak Spots State */}
      {weakSpots.length === 0 ? (
        <div className="w-full bg-white rounded-3xl p-10 border-4 border-emerald-300 shadow-xl flex flex-col items-center text-center animate-fade-in">
          <div className="text-7xl mb-4">🌟</div>
          <h3 className="text-2xl font-black text-purple-900 font-display">
            Thật Kì Diệu! Không Có Khối Nứt Nào!
          </h3>
          <p className="text-purple-700 text-sm max-w-md mt-1 mb-6">
            Mai Nhiên đang phản xạ rất tốt các phép tính đã học. Nếu trong các bài Obby có phép tính nào bé bấm chưa kịp, bạn thú cưng sẽ tự động mang về đây để bé luyện tập nhé!
          </p>

          <VoxelCompanion pet={gameState.selectedPet} hat={gameState.customHat} size={110} mood="celebrate" />
        </div>
      ) : (
        /* Weak Spots List & Repair Workbench */
        <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-3.5 sm:gap-4 md:gap-6">
          {/* Left Column: List of cracked blocks */}
          <div className="md:col-span-5 bg-white rounded-3xl p-4 sm:p-5 border-4 border-purple-200 shadow-md">
            <h3 className="text-sm font-black text-purple-900 mb-3 flex items-center justify-between">
              <span>Cần hàn gắn ({weakSpots.length} phép tính):</span>
              <span className="text-xs text-rose-600 font-bold">Bấm vào khối để sửa</span>
            </h3>

            <div className="flex flex-col gap-2 max-h-[320px] md:max-h-[440px] overflow-y-auto pr-1" style={{ WebkitOverflowScrolling: 'touch' }}>
              {weakSpots.map((spot) => {
                const isSelected = selectedSpot?.id === spot.id;
                return (
                  <button
                    key={spot.id}
                    onClick={() => handleSelectSpot(spot)}
                    className={`w-full p-2.5 sm:p-3 rounded-2xl flex items-center justify-between transition-all border-2 text-left cursor-pointer min-h-[48px] ${
                      isSelected
                        ? 'bg-rose-50 border-rose-400 shadow-md translate-x-1'
                        : 'bg-purple-50/70 border-purple-100 hover:bg-purple-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <VoxelBlock type="grass" size={30} cracked={true} />
                      <div>
                        <div className="font-mono text-base font-extrabold text-purple-900">
                          {spot.questionText}
                        </div>
                        <div className="text-[11px] text-purple-600">
                          Thành thạo: {spot.mastery}%
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-bold px-2 py-1 bg-rose-100 text-rose-700 rounded-lg">
                      Sửa ngay ➔
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Repair Studio */}
          <div className="md:col-span-7">
            {selectedSpot ? (
              <div className="bg-white rounded-3xl p-4 sm:p-5 md:p-6 border-4 border-purple-300 shadow-xl flex flex-col items-center">
                <span className="text-xs sm:text-base font-black text-rose-600 uppercase tracking-wider mb-1 font-display">
                  Đang sửa khối nứt:
                </span>

                <div className="text-4xl sm:text-5xl md:text-7xl font-black text-purple-900 font-mono my-2 sm:my-3 flex items-center gap-2 sm:gap-3">
                  <span>{selectedSpot.questionText}</span>
                  <span>=</span>
                  <span className="text-purple-600 underline">
                    {isAnswered ? selectedSpot.result : numpadValue || '?'}
                  </span>
                </div>

                {/* Feedback Alert */}
                {feedback && (
                  <div
                    className={`w-full p-2.5 sm:p-3.5 rounded-2xl text-sm sm:text-base font-black text-center my-2 font-display ${
                      feedback.type === 'success'
                        ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-300'
                        : 'bg-amber-100 text-amber-800 border-2 border-amber-300'
                    }`}
                  >
                    {feedback.text}
                  </div>
                )}

                {/* Companion Hint */}
                <div className="my-1.5 sm:my-2">
                  <VoxelCompanion
                    pet={gameState.selectedPet}
                    hat={gameState.customHat}
                    size={58}
                    speech={selectedSpot.hint}
                  />
                </div>

                {/* Numpad */}
                <VoxelNumpad
                  value={numpadValue}
                  onChange={setNumpadValue}
                  onSubmit={handleRepairAnswer}
                  disabled={isAnswered}
                />
              </div>
            ) : (
              <div className="bg-purple-50/80 rounded-3xl p-8 border-4 border-dashed border-purple-200 flex flex-col items-center justify-center text-center min-h-[300px]">
                <span className="text-4xl mb-2">👈</span>
                <h4 className="text-base font-extrabold text-purple-900 font-display">
                  Chọn 1 phép tính ở danh sách bên trái
                </h4>
                <p className="text-xs text-purple-600 mt-1 max-w-xs">
                  Bạn thú cưng sẽ hiện gợi ý chi tiết để giúp Mai Nhiên sửa chữa khối gạch nhé!
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
