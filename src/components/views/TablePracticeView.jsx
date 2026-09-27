import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { MULTIPLICATION_FACTS, DIVISION_FACTS } from '../../data/mathCurriculum';
import { masteryEngine } from '../../services/masteryEngine';
import { soundService } from '../../services/soundService';
import VoxelNumpad from '../common/VoxelNumpad';
import VoxelCompanion from '../common/VoxelCompanion';
import confetti from 'canvas-confetti';
import { Zap, CheckCircle2, XCircle, RotateCcw, Award, ArrowRight } from 'lucide-react';

export default function TablePracticeView() {
  const { gameState, recordAnswer } = useGame();
  const [selectedTable, setSelectedTable] = useState(2);
  const [opType, setOpType] = useState('multiplication');
  const [inputMode, setInputMode] = useState('bubbles'); // Mặc định 'bubbles' trực quan cho bé
  const [currentIndex, setCurrentIndex] = useState(0);
  const [numpadValue, setNumpadValue] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [userSelectedOption, setUserSelectedOption] = useState(null);
  const [startTime, setStartTime] = useState(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [companionSpeech, setCompanionSpeech] = useState(null);
  const [companionMood, setCompanionMood] = useState('happy');
  const [bubbleOptions, setBubbleOptions] = useState([]);
  const [roundCompleted, setRoundCompleted] = useState(false);

  const tableFacts = opType === 'multiplication'
    ? MULTIPLICATION_FACTS.filter((f) => f.table === selectedTable)
    : DIVISION_FACTS.filter((f) => f.table === selectedTable);

  const currentFact = tableFacts[currentIndex] || tableFacts[0];
  const tableProgress = masteryEngine.getTableProgress(gameState.masteryMap, selectedTable, opType);

  // Sinh 4 đáp án trắc nghiệm khi chuyển câu
  useEffect(() => {
    if (!currentFact) return;
    const correct = currentFact.result;
    const set = new Set([correct]);
    while (set.size < 4) {
      const offset = (Math.floor(Math.random() * 5) + 1) * (Math.random() > 0.5 ? 1 : -1);
      const fake = Math.max(1, correct + offset);
      set.add(fake);
    }
    setBubbleOptions(Array.from(set).sort(() => Math.random() - 0.5));
  }, [currentIndex, currentFact]);

  // Reset khi đổi câu hoặc đổi bảng
  useEffect(() => {
    setNumpadValue('');
    setIsAnswered(false);
    setIsCorrect(null);
    setUserSelectedOption(null);
    setStartTime(Date.now());
    setElapsedSeconds(0);
    setCompanionSpeech(`Hãy tính nhẩm thật nhanh ${currentFact.questionText} nhé!`);
    setCompanionMood('happy');
  }, [currentIndex, selectedTable, opType]);

  // Timer đo tốc độ phản xạ
  useEffect(() => {
    if (isAnswered || roundCompleted) return;
    const timer = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 200);
    return () => clearInterval(timer);
  }, [startTime, isAnswered, roundCompleted]);

  // Xử lý nộp đáp án
  const handleCheckAnswer = (answerToCheck) => {
    if (isAnswered) return;
    const num = parseInt(answerToCheck, 10);
    if (isNaN(num)) return;

    const speedMs = Date.now() - startTime;
    const correct = num === currentFact.result;

    setIsAnswered(true);
    setIsCorrect(correct);
    setUserSelectedOption(num);
    recordAnswer(currentFact.id, correct, speedMs);

    if (correct) {
      if (speedMs < 3000) {
        soundService.playLightningSuper();
        setCompanionSpeech(`⚡ SIÊU TỐC ĐỘ! Mai Nhiên tính trong ${(speedMs / 1000).toFixed(1)}s, nhận ngay +1 Kim Cương!`);
        setCompanionMood('celebrate');
      } else {
        soundService.playCorrectBounce();
        setCompanionSpeech(`🎉 Giỏi quá Mai Nhiên ơi! Đúng rồi nè!`);
        setCompanionMood('jumping');
      }
    } else {
      soundService.playWrongSoft();
      setCompanionSpeech(`💡 Gợi ý nè: ${currentFact.hint}`);
      setCompanionMood('thinking');
    }
  };

  // Sang câu tiếp theo
  const handleNextQuestion = () => {
    if (currentIndex < tableFacts.length - 1) {
      soundService.playBlockPlace();
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Hoàn thành bảng
      setRoundCompleted(true);
      soundService.playVictoryFanfare();
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.55 },
      });
    }
  };

  // Lắng nghe phím Space hoặc Enter để sang câu tiếp theo tức thì
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isAnswered && !roundCompleted && (e.key === ' ' || e.key === 'Enter')) {
        e.preventDefault();
        handleNextQuestion();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswered, roundCompleted, currentIndex, tableFacts]);

  const handleRestartRound = () => {
    soundService.playBlockPlace();
    setCurrentIndex(0);
    setRoundCompleted(false);
  };

  return (
    <div className="practice-view flex flex-col items-center max-w-4xl mx-auto px-3 py-3 md:px-6 md:py-4 animate-fade-in select-none">
      {/* ========================================================
          1. COMPACT TOP TOOLBAR (Thu gọn tích hợp 1 thanh duy nhất)
         ======================================================== */}
      <div className="w-full bg-white/95 backdrop-blur-md rounded-2xl md:rounded-3xl p-3 md:p-3.5 border-3 border-purple-200 shadow-md mb-3.5">
        {/* Controls row */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-purple-100">
          {/* Operation switcher */}
          <div className="flex items-center gap-1.5 bg-purple-100/80 p-1 rounded-xl border border-purple-200">
            <button
              onClick={() => {
                soundService.playBlockPlace();
                setOpType('multiplication');
                setCurrentIndex(0);
                setRoundCompleted(false);
              }}
              className={`px-3 py-1 rounded-lg text-xs md:text-sm font-black transition-all ${
                opType === 'multiplication' ? 'bg-purple-600 text-white shadow-sm' : 'text-purple-800 hover:bg-purple-200'
              }`}
            >
              ✖️ Nhân
            </button>
            <button
              onClick={() => {
                soundService.playBlockPlace();
                setOpType('division');
                setCurrentIndex(0);
                setRoundCompleted(false);
              }}
              className={`px-3 py-1 rounded-lg text-xs md:text-sm font-black transition-all ${
                opType === 'division' ? 'bg-purple-600 text-white shadow-sm' : 'text-purple-800 hover:bg-purple-200'
              }`}
            >
              ➗ Chia
            </button>
          </div>

          {/* Mode Switcher (Phím / Bong bóng) */}
          <div className="flex items-center gap-1 bg-purple-100/80 p-1 rounded-xl border border-purple-200">
            <button
              onClick={() => {
                soundService.playBlockPlace();
                setInputMode('bubbles');
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all ${
                inputMode === 'bubbles' ? 'bg-purple-600 text-white shadow-sm' : 'text-purple-800'
              }`}
            >
              🫧 Bong Bóng
            </button>
            <button
              onClick={() => {
                soundService.playBlockPlace();
                setInputMode('numpad');
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all ${
                inputMode === 'numpad' ? 'bg-purple-600 text-white shadow-sm' : 'text-purple-800'
              }`}
            >
              ⌨️ Phím Số
            </button>
          </div>

          {/* Mastery Progress Badge */}
          <div className="text-xs font-black text-purple-900 bg-amber-100/80 border border-amber-300 px-2.5 py-1 rounded-xl flex items-center gap-1">
            <Award size={15} className="text-amber-600" />
            <span>Thành thạo: <strong>{tableProgress}%</strong></span>
          </div>
        </div>

        {/* 10 Table Pill Buttons */}
        <div className="table-selector-track flex items-center justify-start sm:justify-center gap-2 overflow-x-auto py-1 no-scrollbar w-full" style={{ WebkitOverflowScrolling: 'touch' }}>
          {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => {
            const isSelected = selectedTable === num;
            return (
              <button
                key={num}
                type="button"
                onClick={() => {
                  soundService.playBlockPlace();
                  setSelectedTable(num);
                  setCurrentIndex(0);
                  setRoundCompleted(false);
                }}
                className={`table-pill-btn ${
                  isSelected ? 'selected' : 'unselected'
                }`}
              >
                {num}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================
          2. ROUND COMPLETED SCREEN (Khi làm xong cả 10 câu)
         ======================================================== */}
      {roundCompleted ? (
        <div className="w-full bg-white rounded-3xl p-6 md:p-8 border-4 border-emerald-300 shadow-2xl flex flex-col items-center text-center animate-fade-in">
          <div className="text-6xl mb-2 animate-bounce">🏆</div>
          <h3 className="text-2xl font-black text-purple-900 font-display">
            Xuất Sắc Quá Mai Nhiên Ơi!
          </h3>
          <p className="text-purple-700 text-sm mt-1 max-w-md">
            Bé đã hoàn thành trọn vẹn 10 câu của {opType === 'multiplication' ? `Bảng Nhân ${selectedTable}` : `Bảng Chia ${selectedTable}`}!
          </p>

          <div className="my-5">
            <VoxelCompanion pet={gameState.selectedPet} hat={gameState.customHat} size={80} mood="celebrate" />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleRestartRound}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-purple-600 text-white font-extrabold shadow-md hover:bg-purple-700 transition-all cursor-pointer"
            >
              <RotateCcw size={18} />
              <span>Luyện lại bảng này</span>
            </button>
            {selectedTable < 10 && (
              <button
                onClick={() => {
                  soundService.playBlockPlace();
                  setSelectedTable((prev) => prev + 1);
                  setCurrentIndex(0);
                  setRoundCompleted(false);
                }}
                className="px-6 py-2.5 rounded-2xl bg-amber-400 text-amber-950 font-black shadow-md hover:bg-amber-300 transition-all border-b-4 border-amber-600 cursor-pointer"
              >
                Sang Bảng {selectedTable + 1} ➔
              </button>
            )}
          </div>
        </div>
      ) : (
        /* ========================================================
            3. MAIN PRACTICE STAGE (Sân khấu luyện tập Zero-Scroll)
           ======================================================== */
        <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-3.5 md:gap-5 items-start">
          {/* CỘT TRÁI: ĐỀ BÀI VÀ NÚT TIẾP THEO TRỌNG TÂM */}
          <div className="md:col-span-6 flex flex-col gap-2.5">
            {/* Speed Gauge & Question Index Mini Bar */}
            <div className="w-full flex items-center justify-between px-3.5 py-1.5 bg-purple-50/90 rounded-xl border border-purple-200">
              <span className="text-xs md:text-sm font-black text-purple-800 flex items-center gap-1.5 font-display">
                <Zap size={16} className={elapsedSeconds < 3 ? 'text-amber-500 animate-bounce' : 'text-gray-400'} />
                {elapsedSeconds < 3 ? 'Tốc độ tia chớp (< 3s) nhận 💎!' : `Thời gian: ${elapsedSeconds}s`}
              </span>
              <span className="text-xs md:text-sm font-mono font-black text-purple-900 bg-white px-2 py-0.5 rounded-lg border border-purple-200">
                Câu {currentIndex + 1} / 10
              </span>
            </div>

            {/* Big Math Question Box (Chứa kết quả và Nút Tiếp Theo) */}
            <div className="w-full bg-white rounded-3xl p-4 sm:p-5 md:p-6 border-4 border-purple-300 shadow-lg flex flex-col items-center justify-center relative">
              <div className="text-xs font-black text-purple-600 uppercase tracking-widest font-display">
                {currentFact.themeItem}
              </div>

              {/* Big Math Question Formula */}
              <div className="text-4xl sm:text-5xl md:text-6xl font-black text-purple-950 font-mono tracking-wider flex items-center gap-2 sm:gap-2.5 my-1.5 sm:my-2">
                <span>{currentFact.questionText}</span>
                <span>=</span>
                <span className="text-purple-600 underline decoration-wavy decoration-purple-300">
                  {isAnswered ? currentFact.result : numpadValue || '?'}
                </span>
              </div>

              {/* Status Alert */}
              {isAnswered ? (
                <div className="w-full flex flex-col items-center mt-2 sm:mt-2.5 animate-fade-in">
                  <div
                    className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-black flex items-center gap-1.5 font-display ${
                      isCorrect
                        ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-300'
                        : 'bg-rose-100 text-rose-800 border-2 border-rose-300'
                    }`}
                  >
                    {isCorrect ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                    <span>{isCorrect ? 'Chính xác tuyệt đối!' : `Đáp án đúng là ${currentFact.result}`}</span>
                  </div>
                </div>
              ) : (
                <div className="text-xs font-bold text-purple-400 mt-1.5 sm:mt-2">
                  Bé chọn đáp án bên phải nhé 👉
                </div>
              )}
            </div>

            {/* Companion Strip (Gọn gàng nằm ngang, không đẩy layout) */}
            <div className="w-full p-2 sm:p-2.5 bg-white/80 rounded-2xl border-2 border-purple-200/80 shadow-sm flex items-center gap-2.5 sm:gap-3">
              <div className="flex-shrink-0">
                <VoxelCompanion
                  pet={gameState.selectedPet}
                  hat={gameState.customHat}
                  size={44}
                  mood={companionMood}
                />
              </div>
              <div className="flex-1 text-xs md:text-sm font-extrabold text-purple-900 font-display leading-tight">
                {companionSpeech || `Hãy tính nhẩm thật nhanh ${currentFact.questionText} nhé!`}
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: KHU VỰC CHỌN ĐÁP ÁN (BONG BÓNG HOẶC PHÍM) */}
          <div className="md:col-span-6 flex flex-col items-center">
            {inputMode === 'bubbles' ? (
              /* Bubble Quiz Options */
              <div className="w-full p-3 sm:p-3.5 md:p-4 bg-purple-100/90 rounded-3xl border-4 border-purple-300 shadow-lg flex flex-col">
                <span className="text-xs font-black text-purple-800 uppercase tracking-wider block text-center mb-2 sm:mb-2.5 font-display">
                  Bấm chọn đáp án đúng:
                </span>

                <div className="grid grid-cols-2 gap-2 sm:gap-2.5 mb-2 sm:mb-2.5">
                  {bubbleOptions.map((opt, i) => {
                    const isSelected = userSelectedOption === opt;
                    const isThisCorrect = opt === currentFact.result;

                    let btnStyle = 'bg-white text-purple-900 border-purple-300 hover:bg-purple-50';
                    if (isAnswered) {
                      if (isThisCorrect) {
                        btnStyle = 'bg-emerald-500 text-white border-emerald-700 shadow-md ring-2 ring-emerald-300 scale-102';
                      } else if (isSelected) {
                        btnStyle = 'bg-rose-500 text-white border-rose-700 opacity-90';
                      } else {
                        btnStyle = 'bg-white/60 text-purple-400 border-purple-200 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={i}
                        disabled={isAnswered}
                        onClick={() => handleCheckAnswer(opt)}
                        className={`h-14 sm:h-18 md:h-22 rounded-2xl text-2xl sm:text-3xl md:text-4xl font-black border-b-4 shadow-sm active:translate-y-1 active:border-b-0 transition-all flex items-center justify-center font-mono cursor-pointer ${btnStyle}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {/* NÚT TIẾP THEO DUY NHẤT Ở CỘT PHẢI */}
                {isAnswered && (
                  <button
                    onClick={handleNextQuestion}
                    className="w-full py-3 sm:py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-base sm:text-lg shadow-lg border-b-4 border-amber-600 active:translate-y-1 active:border-b-0 transition-all font-display flex items-center justify-center gap-2 cursor-pointer mt-1 sm:mt-1.5 animate-pulse min-h-[48px]"
                  >
                    <span>Câu Tiếp Theo</span>
                    <ArrowRight size={22} className="animate-wiggle" />
                    <span className="text-xs bg-amber-600/30 text-amber-950 px-2 py-0.5 rounded-full font-mono font-normal hidden sm:inline">
                      (Phím Cách ⎵)
                    </span>
                  </button>
                )}
              </div>
            ) : (
              /* Numpad Mode */
              <div className="w-full flex flex-col items-center">
                <VoxelNumpad
                  value={numpadValue}
                  onChange={setNumpadValue}
                  onSubmit={handleCheckAnswer}
                  disabled={isAnswered}
                />
                {isAnswered && (
                  <button
                    onClick={handleNextQuestion}
                    className="w-full max-w-sm mt-3 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-lg shadow-lg border-b-4 border-amber-600 active:translate-y-1 active:border-b-0 transition-all font-display flex items-center justify-center gap-2 cursor-pointer animate-pulse"
                  >
                    <span>Câu Tiếp Theo</span>
                    <ArrowRight size={22} className="animate-wiggle" />
                    <span className="text-xs bg-amber-600/30 text-amber-950 px-2 py-0.5 rounded-full font-mono font-normal hidden sm:inline">
                      (Phím Cách ⎵)
                    </span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
