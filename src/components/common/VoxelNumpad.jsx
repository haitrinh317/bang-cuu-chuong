import React, { useEffect } from 'react';
import { soundService } from '../../services/soundService';

export default function VoxelNumpad({
  value = '',
  onChange,
  onSubmit,
  disabled = false,
  maxLength = 4,
}) {
  const handleDigit = (digit) => {
    if (disabled) return;
    if (value.length < maxLength) {
      soundService.playBlockPlace();
      onChange(value + digit);
    }
  };

  const handleDelete = () => {
    if (disabled || value.length === 0) return;
    soundService.playBlockPlace();
    onChange(value.slice(0, -1));
  };

  const handleEnter = () => {
    if (disabled || !value) return;
    if (onSubmit) onSubmit(value);
  };

  // Hỗ trợ bàn phím vật lý
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (disabled) return;
      if (e.key >= '0' && e.key <= '9') {
        handleDigit(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      } else if (e.key === 'Enter') {
        handleEnter();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [value, disabled]);

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

  return (
    <div className="voxel-numpad-container w-full max-w-sm mx-auto p-3 sm:p-4 bg-purple-100/90 backdrop-blur-md rounded-3xl border-4 border-purple-300 shadow-xl select-none">
      {/* Display box */}
      <div className="numpad-screen mb-2.5 sm:mb-3.5 p-2.5 sm:p-3.5 bg-white rounded-2xl border-2 sm:border-3 border-purple-200 shadow-inner flex items-center justify-between">
        <span className="text-xs sm:text-sm uppercase tracking-wider text-purple-600 font-extrabold font-display">Đáp án của bé:</span>
        <span className="text-3xl sm:text-4xl font-black text-purple-900 tracking-wider font-mono min-h-[38px] sm:min-h-[46px] flex items-center">
          {value || <span className="text-purple-300 animate-pulse">?</span>}
        </span>
      </div>

      {/* Grid keypad */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {keys.slice(0, 9).map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => handleDigit(num)}
            disabled={disabled}
            className="numpad-btn h-13 sm:h-14 md:h-16 rounded-2xl bg-white text-2xl sm:text-3xl font-black text-purple-900 border-b-4 border-purple-300 shadow-md active:translate-y-1 active:border-b-0 transition-all hover:bg-purple-50 flex items-center justify-center font-display cursor-pointer"
          >
            {num}
          </button>
        ))}

        {/* Backspace */}
        <button
          type="button"
          onClick={handleDelete}
          disabled={disabled || value.length === 0}
          className="numpad-btn h-13 sm:h-14 md:h-16 rounded-2xl bg-rose-100 text-rose-800 text-xl sm:text-2xl font-black border-b-4 border-rose-300 shadow-md active:translate-y-1 active:border-b-0 transition-all hover:bg-rose-200 disabled:opacity-50 flex items-center justify-center cursor-pointer"
        >
          ⌫
        </button>

        {/* Zero */}
        <button
          type="button"
          onClick={() => handleDigit('0')}
          disabled={disabled}
          className="numpad-btn h-13 sm:h-14 md:h-16 rounded-2xl bg-white text-2xl sm:text-3xl font-black text-purple-900 border-b-4 border-purple-300 shadow-md active:translate-y-1 active:border-b-0 transition-all hover:bg-purple-50 flex items-center justify-center font-display cursor-pointer"
        >
          0
        </button>

        {/* Submit */}
        <button
          type="button"
          onClick={handleEnter}
          disabled={disabled || !value}
          className="numpad-btn h-13 sm:h-14 md:h-16 rounded-2xl bg-emerald-500 text-white text-base sm:text-xl font-black border-b-4 border-emerald-700 shadow-md active:translate-y-1 active:border-b-0 transition-all hover:bg-emerald-600 disabled:opacity-50 flex items-center justify-center font-display cursor-pointer"
        >
          ✔️ Nhập
        </button>
      </div>
    </div>
  );
}
