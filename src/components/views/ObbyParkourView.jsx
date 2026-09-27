import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { OBBY_TIERS, ALL_MATH_FACTS, REMAINDER_CHALLENGES } from '../../data/mathCurriculum';
import { soundService } from '../../services/soundService';
import VoxelBlock from '../common/VoxelBlock';
import VoxelCompanion from '../common/VoxelCompanion';
import VoxelNumpad from '../common/VoxelNumpad';
import confetti from 'canvas-confetti';
import { Zap, Trophy, ShieldCheck, ArrowRight, Play } from 'lucide-react';

export default function ObbyParkourView() {
  const { gameState, recordAnswer, completeObbyStage, addRewards } = useGame();
  const [selectedTier, setSelectedTier] = useState('bronze');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // 0 to 9
  const [stageFacts, setStageFacts] = useState([]);
  const [numpadValue, setNumpadValue] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [speech, setSpeech] = useState('Sẵn sàng vượt Obby chưa Mai Nhiên?');
  const [mood, setMood] = useState('happy');
  const [isStageWon, setIsStageWon] = useState(false);

  const currentTierData = OBBY_TIERS[selectedTier];

  // Chuẩn bị 10 câu hỏi ngẫu nhiên cho màn chơi theo Tier
  const startNewRun = (tierKey) => {
    const tier = OBBY_TIERS[tierKey];
    let pool = ALL_MATH_FACTS.filter((f) => tier.tables.includes(f.table));

    // Nếu là tầng Kim Cương thì trộn thêm câu hỏi phép chia có dư
    if (tierKey === 'diamond') {
      pool = [...pool];
    }

    // Xáo trộn và lấy 10 câu
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 10);
    setStageFacts(shuffled);
    setCurrentStep(0);
    setNumpadValue('');
    setIsAnswered(false);
    setIsStageWon(false);
    setIsPlaying(true);
    setStartTime(Date.now());
    setSpeech(`Nhảy bước số 1 nào Mai Nhiên!`);
    setMood('jumping');
    soundService.playVictoryFanfare();
  };

  const currentFact = stageFacts[currentStep];

  // Xử lý nhảy bục khi trả lời
  const handleJumpAttempt = (answerStr) => {
    if (isAnswered || !currentFact) return;
    const num = parseInt(answerStr, 10);
    if (isNaN(num)) return;

    const speedMs = Date.now() - startTime;
    const isCorrect = num === currentFact.result;

    if (isCorrect) {
      setIsAnswered(true);
      recordAnswer(currentFact.id, true, speedMs);

      if (speedMs < 3000) {
        soundService.playLightningSuper();
        setSpeech(`⚡ SIÊU NHẢY CẦU VỒNG! ${(speedMs / 1000).toFixed(1)}s!`);
        setMood('celebrate');
      } else {
        soundService.playCorrectBounce();
        setSpeech(`🎉 Tuyệt đỉnh! Bước nhảy số ${currentStep + 1} thành công!`);
        setMood('jumping');
      }

      // Tự động chuyển bước sau 600ms
      setTimeout(() => {
        if (currentStep < 9) {
          setCurrentStep((prev) => prev + 1);
          setNumpadValue('');
          setIsAnswered(false);
          setStartTime(Date.now());
          setMood('happy');
        } else {
          // Về đích chặng Obby!
          setIsStageWon(true);
          completeObbyStage(`obby_${selectedTier}_${Date.now()}`);
          addRewards(20, 3);
          soundService.playVictoryFanfare();
          confetti({
            particleCount: 120,
            spread: 90,
            origin: { y: 0.5 }
          });
        }
      }, 700);
    } else {
      soundService.playWrongSoft();
      recordAnswer(currentFact.id, false, speedMs);
      setSpeech(`Ôi suýt nữa đúng! Gợi ý nè: ${currentFact.hint}`);
      setMood('thinking');
      setNumpadValue('');
    }
  };

  return (
    <div className="obby-view flex flex-col items-center max-w-5xl mx-auto p-4 md:p-6 animate-fade-in select-none">
      {/* Obby Header Banner */}
      <div className="w-full text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-100 border border-cyan-300 text-xs font-bold text-cyan-800 mb-2">
          <Zap size={14} className="text-cyan-600" />
          <span>Vượt Chướng Ngại Vật Roblox</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-purple-900 font-display">
          Đường Chạy Obby Cửu Chương ⚡
        </h2>
        <p className="text-purple-700 text-sm mt-1">
          Nhảy qua 10 khối mây bồng bềnh bằng cách tính nhẩm nhanh để lên đỉnh vinh quang!
        </p>
      </div>

      {/* Tiers Switcher */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {Object.values(OBBY_TIERS).map((tier) => {
          const isSelected = selectedTier === tier.id;
          return (
            <button
              key={tier.id}
              onClick={() => {
                soundService.playBlockPlace();
                setSelectedTier(tier.id);
                setIsPlaying(false);
                setIsStageWon(false);
              }}
              className={`p-3 rounded-2xl border-4 text-left transition-all ${
                isSelected
                  ? 'border-purple-600 bg-white shadow-lg scale-102'
                  : 'border-purple-200 bg-purple-50/80 hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-2xl">{tier.icon}</span>
                {isSelected && <span className="text-[10px] font-black bg-purple-600 text-white px-2 py-0.5 rounded-full">Đang chọn</span>}
              </div>
              <h4 className="text-sm font-black text-purple-900 font-display">{tier.name}</h4>
              <p className="text-[11px] text-purple-700 mt-0.5">{tier.description}</p>
            </button>
          );
        })}
      </div>

      {/* Main Game Stage or Start Screen */}
      {!isPlaying ? (
        <div className="w-full bg-white rounded-3xl p-8 border-4 border-purple-300 shadow-xl flex flex-col items-center text-center">
          <div className="w-24 h-24 mb-4 flex items-center justify-center rounded-3xl bg-purple-100 border-2 border-purple-200">
            <span className="text-5xl">{currentTierData.icon}</span>
          </div>
          <h3 className="text-2xl font-black text-purple-900 font-display">
            Thử Thách: {currentTierData.name}
          </h3>
          <p className="text-purple-700 text-sm max-w-md mt-1 mb-6">
            Bao gồm 10 bước nhảy thử thách phản xạ các phép tính thuộc{' '}
            <strong>Bảng {currentTierData.tables.join(', ')}</strong>. Về đích để nhận{' '}
            <strong className="text-emerald-600">+20 Ngọc Lục Bảo</strong> và{' '}
            <strong className="text-cyan-600">+3 Kim Cương</strong>!
          </p>

          <button
            onClick={() => startNewRun(selectedTier)}
            className="flex items-center gap-2 px-8 py-4 rounded-3xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-lg shadow-xl border-b-4 border-emerald-700 active:translate-y-1 active:border-b-0 transition-all font-display"
          >
            <Play size={20} />
            <span>BẮT ĐẦU CHẠY OBBY</span>
          </button>
        </div>
      ) : isStageWon ? (
        /* Stage Won Screen */
        <div className="w-full bg-white rounded-3xl p-8 border-4 border-emerald-400 shadow-2xl flex flex-col items-center text-center animate-fade-in">
          <div className="text-7xl mb-2">🎉</div>
          <h3 className="text-3xl font-black text-purple-900 font-display">
            CHINH PHỤC ĐỈNH THÁP OBBY!
          </h3>
          <p className="text-purple-700 text-base mt-1 max-w-md">
            Mai Nhiên đã hoàn thành xuất sắc 10 bước nhảy của <strong>{currentTierData.name}</strong>!
          </p>

          <div className="flex items-center gap-4 my-6 p-4 rounded-2xl bg-purple-50 border-2 border-purple-200">
            <div className="flex items-center gap-1.5 font-bold text-emerald-800">
              <span className="text-xl">🟩</span>
              <span>+20 Ngọc Lục Bảo</span>
            </div>
            <div className="flex items-center gap-1.5 font-bold text-cyan-800">
              <span className="text-xl">💎</span>
              <span>+3 Kim Cương</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => startNewRun(selectedTier)}
              className="px-6 py-3 rounded-2xl bg-purple-600 text-white font-extrabold shadow-md hover:bg-purple-700"
            >
              Chạy Lại Màn Này ⚡
            </button>
            <button
              onClick={() => setIsPlaying(false)}
              className="px-6 py-3 rounded-2xl bg-gray-100 text-purple-900 font-extrabold hover:bg-gray-200"
            >
              Chọn Tầng Khác ➔
            </button>
          </div>
        </div>
      ) : (
        /* Playing Screen: The Floating Obby Course */
        <div className="w-full flex flex-col gap-6">
          {/* Obby Cloud Path Visualizer */}
          <div className="w-full bg-gradient-to-r from-sky-200 via-indigo-100 to-purple-200 rounded-3xl p-3.5 sm:p-5 md:p-6 border-4 border-purple-300 shadow-lg relative overflow-hidden flex flex-col items-center">
            {/* Top Tracker */}
            <div className="w-full flex items-center justify-between text-xs font-black text-purple-900 mb-2 sm:mb-3 px-1 sm:px-2">
              <span className="flex items-center gap-1">
                <span>📍 Bước {currentStep + 1} / 10</span>
              </span>
              <span className="bg-white/80 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border border-purple-200">
                {currentTierData.name}
              </span>
            </div>

            {/* Stepping Stones Path */}
            <div className="w-full flex items-center justify-between gap-1 overflow-x-auto py-3 sm:py-4 px-1 sm:px-2 no-scrollbar" style={{ WebkitOverflowScrolling: 'touch' }}>
              {Array.from({ length: 10 }).map((_, stepIdx) => {
                const isPassed = stepIdx < currentStep;
                const isCurrent = stepIdx === currentStep;
                return (
                  <div key={stepIdx} className="flex flex-col items-center min-w-[36px] sm:min-w-[46px] relative">
                    {/* Character standing on current block */}
                    {isCurrent && (
                      <div className="absolute -top-12 sm:-top-16 z-20 animate-bounce">
                        <VoxelCompanion
                          pet={gameState.selectedPet}
                          hat={gameState.customHat}
                          size={40}
                          mood={mood}
                        />
                      </div>
                    )}

                    <VoxelBlock
                      type={isPassed ? 'emerald' : isCurrent ? 'diamond' : 'cloud'}
                      size={36}
                      label={isPassed ? '✓' : `${stepIdx + 1}`}
                      active={isCurrent}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Current Challenge Block & Numpad */}
          <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-3.5 sm:gap-4 md:gap-6 items-start">
            {/* Left: Math Step Card */}
            <div className="md:col-span-6 bg-white rounded-3xl p-4 sm:p-5 md:p-6 border-4 border-purple-300 shadow-xl flex flex-col items-center text-center">
              <span className="text-xs sm:text-base font-black text-purple-700 uppercase tracking-wider mb-1 font-display">
                Phép tính để nhảy bước số {currentStep + 1}:
              </span>

              <div className="text-4xl sm:text-5xl md:text-7xl font-black text-purple-900 font-mono tracking-wider my-1.5 sm:my-3 flex items-center gap-2 sm:gap-3">
                <span>{currentFact?.questionText}</span>
                <span>=</span>
                <span className="text-cyan-600 underline decoration-wavy decoration-cyan-300">
                  {numpadValue || '?'}
                </span>
              </div>

              {/* Companion Speech Bubble */}
              <div className="mt-1 sm:mt-2">
                <VoxelCompanion
                  pet={gameState.selectedPet}
                  hat={gameState.customHat}
                  size={58}
                  mood={mood}
                  speech={speech}
                />
              </div>
            </div>

            {/* Right: Touch Numpad */}
            <div className="md:col-span-6 w-full">
              <VoxelNumpad
                value={numpadValue}
                onChange={setNumpadValue}
                onSubmit={handleJumpAttempt}
                disabled={isAnswered}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
