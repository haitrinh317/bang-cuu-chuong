import React, { useState, useEffect, useRef } from 'react';
import { MULTIPLICATION_FACTS, DIVISION_FACTS } from '../../data/mathCurriculum';
import { soundService } from '../../services/soundService';
import VoxelBlock from '../common/VoxelBlock';
import VoxelCompanion from '../common/VoxelCompanion';
import { useGame } from '../../context/GameContext';
import { Sparkles, Grid, Milestone, RotateCcw, Play, RefreshCw, Footprints, Hash } from 'lucide-react';

export default function DiscoveryGardenView() {
  const { gameState } = useGame();
  const [selectedTable, setSelectedTable] = useState(3);
  const [opType, setOpType] = useState('multiplication'); // 'multiplication' | 'division'
  const [activeFactIndex, setActiveFactIndex] = useState(3); // default fact (e.g. 3 x 4)
  const [highlightedRow, setHighlightedRow] = useState(null);
  const [isTransposed, setIsTransposed] = useState(false); // Xoay chiều ma trận (tính chất giao hoán)
  const [showNumbersOnBlocks, setShowNumbersOnBlocks] = useState(true); // Đánh số thứ tự trên từng khối
  const [currentJumpStep, setCurrentJumpStep] = useState(4); // Vị trí bước nhảy của thú cưng
  const [isAutoJumping, setIsAutoJumping] = useState(false);
  const autoJumpTimerRef = useRef(null);

  // Lấy 10 phép tính của bảng được chọn
  const currentFacts = opType === 'multiplication'
    ? MULTIPLICATION_FACTS.filter((f) => f.table === selectedTable)
    : DIVISION_FACTS.filter((f) => f.table === selectedTable);

  const activeFact = currentFacts[activeFactIndex] || currentFacts[0];

  // Khi đổi phép tính, tự động đồng bộ bước nhảy và trạng thái ma trận
  useEffect(() => {
    if (activeFact) {
      const targetStep = opType === 'multiplication' ? activeFact.multiplier : activeFact.result;
      setCurrentJumpStep(targetStep);
      setIsTransposed(false);
      setHighlightedRow(null);
    }
  }, [activeFactIndex, selectedTable, opType]);

  // Theo dõi kích thước màn hình để tự động scale khối hộp trên điện thoại & tablet
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Hủy timer tự động nhảy nếu unmount
  useEffect(() => {
    return () => {
      if (autoJumpTimerRef.current) clearInterval(autoJumpTimerRef.current);
    };
  }, []);

  const handleSelectFact = (idx) => {
    soundService.playBlockPlace();
    setActiveFactIndex(idx);
  };

  const handleRowClick = (rowIdx) => {
    soundService.playCorrectBounce();
    setHighlightedRow(highlightedRow === rowIdx ? null : rowIdx);
  };

  // Điều khiển bước nhảy thú cưng
  const handleJumpNext = () => {
    if (currentJumpStep < 10) {
      soundService.playCorrectBounce();
      setCurrentJumpStep((prev) => prev + 1);
    }
  };

  const handleJumpReset = () => {
    soundService.playBlockPlace();
    setCurrentJumpStep(0);
  };

  const handleAutoJump = () => {
    if (isAutoJumping) return;
    setIsAutoJumping(true);
    setCurrentJumpStep(0);
    soundService.playBlockPlace();

    const targetStep = opType === 'multiplication' ? activeFact.multiplier : activeFact.result;
    let step = 0;

    autoJumpTimerRef.current = setInterval(() => {
      step += 1;
      setCurrentJumpStep(step);
      soundService.playCorrectBounce();

      if (step >= targetStep) {
        clearInterval(autoJumpTimerRef.current);
        setIsAutoJumping(false);
        soundService.playVictoryFanfare();
      }
    }, 550);
  };

  // Tính toán kích thước ma trận hình học (Hàng x Cột)
  const baseRows = opType === 'multiplication' ? activeFact.table : activeFact.divisor;
  const baseCols = opType === 'multiplication' ? activeFact.multiplier : activeFact.result;
  const numRows = isTransposed ? baseCols : baseRows;
  const numCols = isTransposed ? baseRows : baseCols;
  const totalBlocks = numRows * numCols;

  // Tính toán bước nhảy trên trục số
  const stepValue = opType === 'multiplication' ? selectedTable : activeFact.divisor;
  const targetFinalStep = opType === 'multiplication' ? activeFact.multiplier : activeFact.result;

  return (
    <div className="discovery-view flex flex-col items-center max-w-5xl mx-auto p-4 md:p-6 animate-fade-in select-none">
      {/* Title Header */}
      <div className="w-full text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 border border-pink-300 text-xs font-bold text-pink-800 mb-2">
          <Sparkles size={14} className="text-pink-600" />
          <span>Thấu Hiểu Bản Chất Toán Học Trực Quan</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-purple-900 font-display">
          Vườn Khám Phá Cửu Chương 🌸
        </h2>
        <p className="text-purple-700 text-sm mt-1">
          Quan sát đảo khối hộp Minecraft và theo chân bạn <strong>{gameState.petName}</strong> nhảy nhịp điệu trên trục số!
        </p>
      </div>

      {/* Operation Switcher (Nhân / Chia) */}
      <div className="flex items-center gap-2 p-1.5 bg-purple-100 rounded-2xl border-2 border-purple-300 mb-5 shadow-sm">
        <button
          onClick={() => {
            soundService.playBlockPlace();
            setOpType('multiplication');
          }}
          className={`px-5 py-2.5 rounded-xl text-sm md:text-base font-black transition-all ${
            opType === 'multiplication'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-purple-800 hover:bg-purple-200'
          }`}
        >
          ✖️ Bảng Nhân
        </button>
        <button
          onClick={() => {
            soundService.playBlockPlace();
            setOpType('division');
          }}
          className={`px-5 py-2.5 rounded-xl text-sm md:text-base font-black transition-all ${
            opType === 'division'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-purple-800 hover:bg-purple-200'
          }`}
        >
          ➗ Bảng Chia
        </button>
      </div>

      {/* Table Selector (1 to 10) */}
      <div className="table-selector-track flex items-center justify-start sm:justify-center gap-2 sm:gap-2.5 overflow-x-auto py-2 px-1 mb-5 sm:mb-6 no-scrollbar w-full" style={{ WebkitOverflowScrolling: 'touch' }}>
        {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => {
          const isSelected = selectedTable === num;
          return (
            <button
              key={num}
              type="button"
              onClick={() => {
                soundService.playBlockPlace();
                setSelectedTable(num);
                setActiveFactIndex(0);
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

      {/* Main Interactive Stage */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 10 facts in table */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-4 border-4 border-purple-200 shadow-md flex flex-col">
          <h3 className="text-sm md:text-base font-black text-purple-900 mb-3 px-2 uppercase tracking-wider font-display">
            {opType === 'multiplication' ? `Bảng Nhân ${selectedTable}` : `Bảng Chia ${selectedTable}`}
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 max-h-[500px] overflow-y-auto pr-1">
            {currentFacts.map((fact, idx) => {
              const isActive = activeFactIndex === idx;
              return (
                <button
                  key={fact.id}
                  onClick={() => handleSelectFact(idx)}
                  className={`w-full p-2.5 rounded-2xl flex items-center justify-between text-left font-bold transition-all border-2 ${
                    isActive
                      ? 'bg-purple-600 text-white border-purple-700 shadow-md translate-x-1'
                      : 'bg-purple-50 text-purple-900 border-purple-100 hover:bg-purple-100'
                  }`}
                >
                  <span className="font-mono text-base font-extrabold">{fact.questionText}</span>
                  <span className="text-base font-black font-mono">={fact.result}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Visual Array & Number line jump */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* ========================================================
              1. MẢNG KHỐI HỘP TRỰC QUAN (VOXEL 2D GRID MATRIX ISLAND)
             ======================================================== */}
          <div className="bg-white rounded-3xl p-5 md:p-6 border-4 border-purple-200 shadow-md">
            {/* Header controls for matrix */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b-2 border-purple-100">
              <span className="text-base font-black text-purple-900 flex items-center gap-2 font-display">
                <Grid size={20} className="text-purple-600" />
                <span>Mảng Khối Hộp Trực Quan:</span>
              </span>

              <div className="flex items-center gap-2">
                {opType === 'multiplication' && (
                  <button
                    onClick={() => {
                      soundService.playBlockPlace();
                      setIsTransposed(!isTransposed);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 text-xs font-bold transition-colors border border-purple-300 shadow-sm"
                    title="Xoay chiều hàng và cột để hiểu tính chất giao hoán (a x b = b x a)"
                  >
                    <RefreshCw size={14} className={isTransposed ? 'rotate-180 transition-transform' : ''} />
                    <span>{isTransposed ? '🔄 Đã xoay: Cột ⇄ Hàng' : '🔄 Xoay Chiều (Giao Hoán)'}</span>
                  </button>
                )}

                <button
                  onClick={() => setShowNumbersOnBlocks(!showNumbersOnBlocks)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors shadow-sm ${
                    showNumbersOnBlocks
                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                      : 'bg-gray-100 text-gray-700 border-gray-300'
                  }`}
                  title="Hiện hoặc ẩn số thứ tự trên từng khối hộp"
                >
                  <Hash size={14} />
                  <span>{showNumbersOnBlocks ? 'Đang hiện số đếm' : 'Ẩn số đếm'}</span>
                </button>
              </div>
            </div>

            {/* Matrix rendering area */}
            <div className="p-4 bg-purple-50/80 rounded-2xl border-2 border-purple-100 flex flex-col items-center justify-center min-h-[250px] overflow-x-auto">
              {opType === 'multiplication' ? (
                <div className="flex flex-col items-center">
                  {/* Top Ruler (Chiều rộng: số cột) */}
                  <div className="flex items-center justify-center gap-2 mb-2 px-4 py-1 rounded-full bg-indigo-100 border border-indigo-200 text-xs font-extrabold text-indigo-900">
                    <span>↔️ Chiều rộng: <strong>{numCols} khối</strong> mỗi hàng</span>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Left Ruler (Chiều cao: số hàng) */}
                    <div className="flex flex-col items-center justify-center px-2 py-3 rounded-2xl bg-pink-100 border border-pink-200 text-xs font-extrabold text-pink-900">
                      <span className="[writing-mode:vertical-lr] rotate-180">
                        ↕️ Chiều cao: <strong>{numRows} hàng</strong>
                      </span>
                    </div>

                    {/* Voxel Grid Matrix Island */}
                    <div
                      className="p-3 bg-emerald-900/10 rounded-2xl border-4 border-emerald-300/80 shadow-inner flex flex-col gap-1.5"
                    >
                      {Array.from({ length: numRows }).map((_, rIdx) => {
                        return (
                          <div
                            key={rIdx}
                            onClick={() => handleRowClick(rIdx)}
                            className={`flex items-center gap-1.5 p-1 rounded-xl cursor-pointer transition-all ${
                              highlightedRow === rIdx
                                ? 'bg-amber-200/90 shadow-md ring-2 ring-amber-400 scale-102'
                                : 'hover:bg-purple-100/60'
                            }`}
                            title={`Hàng ${rIdx + 1}: ${numCols} khối`}
                          >
                            <span className="w-6 text-xs font-mono font-bold text-purple-700">
                              #{rIdx + 1}
                            </span>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: numCols }).map((_, cIdx) => {
                                const blockNum = rIdx * numCols + cIdx + 1;
                                const calculatedBlockSize = windowWidth < 480
                                  ? (numCols > 7 ? 20 : numCols > 5 ? 24 : 28)
                                  : windowWidth < 768
                                  ? (numCols > 7 ? 26 : numCols > 5 ? 30 : 36)
                                  : (numCols > 7 ? 32 : numCols > 5 ? 38 : 44);

                                return (
                                  <VoxelBlock
                                    key={cIdx}
                                    type="grass"
                                    size={calculatedBlockSize}
                                    label={showNumbersOnBlocks ? blockNum.toString() : ''}
                                    active={highlightedRow === rIdx}
                                  />
                                );
                              })}
                            </div>
                            <span className="text-xs font-extrabold text-purple-800 ml-2 font-mono">
                              +{numCols} = {numCols * (rIdx + 1)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Repeated Addition Equation Explanation */}
                  <div className="mt-4 p-3.5 rounded-2xl bg-white border-2 border-purple-200 shadow-sm w-full text-center">
                    <div className="text-xs text-purple-600 font-extrabold uppercase tracking-wider mb-1">
                      Bản chất phép nhân là phép cộng lặp lại:
                    </div>
                    <div className="text-base md:text-lg font-black text-purple-950 font-mono">
                      {Array(numRows).fill(numCols).join(' + ')} = <strong className="text-emerald-700 font-bold">{totalBlocks} khối</strong>
                    </div>
                    <div className="text-xs text-purple-700 mt-1">
                      👉 Lấy <strong>{numCols}</strong> khối lặp lại <strong>{numRows}</strong> lần = <strong>{totalBlocks}</strong> khối đất!
                    </div>
                  </div>
                </div>
              ) : (
                /* Division visualization (Chia đều vào các rương) */
                <div className="flex flex-col items-center gap-4 w-full">
                  <div className="px-4 py-1.5 rounded-full bg-cyan-100 border border-cyan-300 text-xs font-bold text-cyan-900">
                    📦 Chia đều <strong>{activeFact.dividend} khối kim cương</strong> vào <strong>{activeFact.divisor} rương</strong>:
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3 w-full">
                    {Array.from({ length: activeFact.divisor }).map((_, gIdx) => (
                      <div
                        key={gIdx}
                        className="p-3 bg-white rounded-2xl border-2 border-cyan-300 shadow-sm flex flex-col items-center min-w-[90px]"
                      >
                        <span className="text-xs font-black text-cyan-800 mb-1">
                          🎁 Rương {gIdx + 1}
                        </span>
                        <div className="flex flex-wrap gap-1 justify-center max-w-[120px]">
                          {Array.from({ length: activeFact.result }).map((_, bIdx) => (
                            <VoxelBlock
                              key={bIdx}
                              type="diamond"
                              size={28}
                              label={showNumbersOnBlocks ? (bIdx + 1).toString() : ''}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-black text-emerald-700 mt-1 font-mono">
                          {activeFact.result} khối
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 rounded-2xl bg-white border-2 border-cyan-200 text-center w-full">
                    <span className="text-sm font-bold text-cyan-950">
                      ✨ {activeFact.dividend} chia đều cho {activeFact.divisor} phần = Mỗi phần nhận đúng <strong className="text-emerald-700 text-base">{activeFact.result} khối</strong>!
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Smart Companion Hint Box */}
            <div className="mt-4 p-4 rounded-2xl bg-amber-50 border-2 border-amber-200 flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <h4 className="text-xs font-extrabold text-amber-900 uppercase tracking-wider font-display">
                  Mẹo Nhớ Nhanh Từ Bạn Đồng Hành
                </h4>
                <p className="text-sm font-semibold text-amber-800 mt-0.5">
                  {activeFact.hint}
                </p>
              </div>
            </div>
          </div>

          {/* ========================================================
              2. BƯỚC NHẢY CỦA THÚ CƯNG (ANIMATED NUMBER LINE & ARCHES)
             ======================================================== */}
          <div className="bg-white rounded-3xl p-5 md:p-6 border-4 border-purple-200 shadow-md">
            {/* Header controls for number line */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b-2 border-purple-100">
              <span className="text-base font-black text-purple-900 flex items-center gap-2 font-display">
                <Milestone size={20} className="text-purple-600" />
                <span>Bước Nhảy Của {gameState.petName}:</span>
              </span>

              {/* Action Buttons: Jump next, reset, auto jump */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleJumpNext}
                  disabled={currentJumpStep >= 10 || isAutoJumping}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-black shadow-sm transition-all active:scale-95"
                >
                  <Footprints size={15} />
                  <span>Nhảy +{stepValue}</span>
                </button>

                <button
                  onClick={handleAutoJump}
                  disabled={isAutoJumping}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 disabled:opacity-50 text-amber-950 text-xs font-black shadow-sm transition-all active:scale-95"
                  title="Xem thú cưng tự nhảy từ 0 đến kết quả"
                >
                  <Play size={14} />
                  <span>{isAutoJumping ? 'Đang nhảy...' : 'Tự động nhảy'}</span>
                </button>

                <button
                  onClick={handleJumpReset}
                  disabled={isAutoJumping}
                  className="p-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-700 transition-colors border border-purple-300"
                  title="Đưa thú cưng về vạch xuất phát 0"
                >
                  <RotateCcw size={16} />
                </button>
              </div>
            </div>

            {/* Graphic Number Line Stage - 100% Unified SVG Coordinate System */}
            <div className="w-full bg-gradient-to-b from-purple-50/80 via-pink-50/40 to-indigo-50/80 p-3 md:p-5 rounded-2xl border-2 border-purple-200 overflow-x-auto no-scrollbar">
              <div className="min-w-[750px] w-full">
                <svg
                  className="w-full h-auto select-none"
                  viewBox="0 0 1000 235"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <defs>
                    <linearGradient id="activeArchGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#F59E0B" />
                      <stop offset="100%" stopColor="#EA580C" />
                    </linearGradient>
                    <linearGradient id="activeBarGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#A855F7" />
                      <stop offset="50%" stopColor="#F59E0B" />
                      <stop offset="100%" stopColor="#10B981" />
                    </linearGradient>
                    <filter id="shadowFilter" x="-10%" y="-10%" width="120%" height="120%">
                      <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.15" />
                    </filter>
                  </defs>

                  {/* Base Ruler Track (Thanh ray trục số) */}
                  <line
                    x1="45"
                    y1="145"
                    x2="955"
                    y2="145"
                    stroke="#E2E8F0"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  <line
                    x1="55"
                    y1="145"
                    x2="945"
                    y2="145"
                    stroke="#DDD6FE"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                  {/* Active progress bar up to currentJumpStep */}
                  {currentJumpStep > 0 && (
                    <line
                      x1="65"
                      y1="145"
                      x2={65 + currentJumpStep * 87}
                      y2="145"
                      stroke="url(#activeBarGrad)"
                      strokeWidth="5"
                      strokeLinecap="round"
                      className="transition-all duration-300"
                    />
                  )}

                  {/* Parabolic Jump Arches (10 Vòm cong bước nhảy) */}
                  {Array.from({ length: 10 }).map((_, i) => {
                    const startX = 65 + i * 87;
                    const endX = 65 + (i + 1) * 87;
                    const midX = (startX + endX) / 2;
                    const isJumped = i < currentJumpStep;
                    const isTargetJump = i < targetFinalStep;

                    return (
                      <g key={i}>
                        {/* Parabolic Arch Path: starts exactly at startX,145 and lands at endX,145 */}
                        <path
                          d={`M ${startX} 145 Q ${midX} 68 ${endX} 145`}
                          fill="none"
                          stroke={isJumped ? 'url(#activeArchGrad)' : isTargetJump ? '#C084FC' : '#E9D5FF'}
                          strokeWidth={isJumped ? '4' : '2'}
                          strokeDasharray={isJumped ? 'none' : '4 3'}
                          className="transition-all duration-300"
                        />

                        {/* Step Increment Badge Pill (+stepValue) on peak */}
                        <g filter="url(#shadowFilter)">
                          <rect
                            x={midX - 17}
                            y="58"
                            width="34"
                            height="22"
                            rx="11"
                            fill={isJumped ? '#F59E0B' : '#FAF5FF'}
                            stroke={isJumped ? '#D97706' : '#D8B4FE'}
                            strokeWidth="1.5"
                            className="transition-all duration-300"
                          />
                          <text
                            x={midX}
                            y="73"
                            textAnchor="middle"
                            fill={isJumped ? '#FFFFFF' : '#7E22CE'}
                            fontSize="11"
                            fontWeight="900"
                            fontFamily="var(--font-mono)"
                          >
                            +{stepValue}
                          </text>
                        </g>
                      </g>
                    );
                  })}

                  {/* 11 Tick Points and Labels (from i = 0 to 10) */}
                  {Array.from({ length: 11 }).map((_, i) => {
                    const tickX = 65 + i * 87;
                    const stepVal = i * stepValue;
                    const isPassed = i <= currentJumpStep;
                    const isTarget = i === targetFinalStep;
                    const isCurrent = i === currentJumpStep;

                    return (
                      <g
                        key={i}
                        className="cursor-pointer group"
                        onClick={() => {
                          soundService.playCorrectBounce();
                          setCurrentJumpStep(i);
                        }}
                      >
                        {/* Invisible clickable hitbox for easy tapping on touch */}
                        <rect
                          x={tickX - 35}
                          y="125"
                          width="70"
                          height="95"
                          fill="transparent"
                        />

                        {/* Outer Glow Ring if target */}
                        {isTarget && (
                          <circle
                            cx={tickX}
                            cy="145"
                            r="11"
                            fill="none"
                            stroke="#F59E0B"
                            strokeWidth="3"
                            opacity="0.8"
                            className="animate-pulse"
                          />
                        )}

                        {/* Tick Circle Center on the line */}
                        <circle
                          cx={tickX}
                          cy="145"
                          r={isCurrent ? '7.5' : isTarget ? '6.5' : '5'}
                          fill={isCurrent ? '#F59E0B' : isTarget ? '#FBBF24' : isPassed ? '#7E22CE' : '#FFFFFF'}
                          stroke={isCurrent ? '#B45309' : isTarget ? '#D97706' : isPassed ? '#FFFFFF' : '#94A3B8'}
                          strokeWidth="2.5"
                          className="transition-all duration-200"
                        />

                        {/* Number Value Label (0, 3, 6, 9...) */}
                        <text
                          x={tickX}
                          y="178"
                          textAnchor="middle"
                          fill={isCurrent ? '#7E22CE' : isTarget ? '#92400E' : isPassed ? '#3B0764' : '#64748B'}
                          fontSize={isCurrent || isTarget ? '18' : '15'}
                          fontWeight="900"
                          fontFamily="var(--font-mono)"
                          className="transition-all duration-200"
                        >
                          {stepVal}
                        </text>

                        {/* Step Index Label (Bước 0, Bước 1...) - always clean and centered, never wraps */}
                        <text
                          x={tickX}
                          y="200"
                          textAnchor="middle"
                          fill={isCurrent ? '#9333EA' : isTarget ? '#D97706' : '#94A3B8'}
                          fontSize="11"
                          fontWeight={isCurrent || isTarget ? '800' : '600'}
                          fontFamily="var(--font-display)"
                        >
                          {i === 0 ? 'Gốc 0' : `Bước ${i}`}
                        </text>
                      </g>
                    );
                  })}

                  {/* Voxel Pet & Speech Bubble via foreignObject (Perfect Alignment) */}
                  {(() => {
                    const petX = 65 + currentJumpStep * 87;
                    return (
                      <g className="transition-all duration-300 ease-out">
                        {/* Shadow under Pet */}
                        <ellipse
                          cx={petX}
                          cy="141"
                          rx="18"
                          ry="4"
                          fill="rgba(59, 7, 100, 0.18)"
                        />

                        {/* ForeignObject container for speech bubble and Voxel Companion */}
                        <foreignObject
                          x={petX - 70}
                          y="6"
                          width="140"
                          height="136"
                          className="overflow-visible pointer-events-none"
                        >
                          <div className="w-full h-full flex flex-col items-center justify-end select-none">
                            {/* Floating Speech Bubble (Single Line, Never Wrapped, High Contrast) */}
                            <div className="bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-xl shadow-md border-2 border-purple-400 text-[11px] font-black text-purple-950 whitespace-nowrap mb-1 animate-bounce flex items-center gap-1">
                              {currentJumpStep === 0 ? (
                                <span>🚩 Vạch xuất phát 0</span>
                              ) : currentJumpStep === targetFinalStep ? (
                                <span>🎯 Đích: <strong>{stepValue} × {currentJumpStep} = {stepValue * currentJumpStep}!</strong></span>
                              ) : (
                                <span>🐾 Bước #{currentJumpStep}: <strong>{stepValue * currentJumpStep}</strong></span>
                              )}
                            </div>

                            {/* Companion Body */}
                            <div className="w-11 h-11 filter drop-shadow-md">
                              <VoxelCompanion pet={gameState.selectedPet} hat={gameState.customHat} size={42} />
                            </div>
                          </div>
                        </foreignObject>
                      </g>
                    );
                  })()}
                </svg>
              </div>
            </div>

            {/* Jump summary message */}
            <div className="mt-3.5 p-3 rounded-2xl bg-purple-50 border border-purple-200 text-center text-xs md:text-sm font-bold text-purple-900 flex items-center justify-center gap-2">
              <span className="text-base">🐾</span>
              <span>
                Bé <strong>Mai Nhiên</strong> đã cùng <strong>{gameState.petName}</strong> nhảy được{' '}
                <span className="text-purple-950 font-black text-sm md:text-base px-2 py-0.5 rounded-lg bg-white border border-purple-200 shadow-sm">{currentJumpStep} bước</span>
                {' '}({stepValue} × {currentJumpStep} ={' '}
                <strong className="text-emerald-700 text-base md:text-lg">{stepValue * currentJumpStep}</strong>)!
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
