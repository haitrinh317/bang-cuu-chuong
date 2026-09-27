import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { masteryEngine } from '../../services/masteryEngine';
import { X, Volume2, VolumeX, Download, Upload, Trash2, CheckCircle2 } from 'lucide-react';

export default function ParentSettingsModal({ isOpen, onClose }) {
  const { gameState, isMuted, toggleMute, exportBackup, importBackup, resetGame } = useGame();
  const [jsonInput, setJsonInput] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [importStatus, setImportStatus] = useState(null);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  if (!isOpen) return null;

  const totalMastered = masteryEngine.getTotalMasteredFacts(gameState.masteryMap);
  const overallPercent = masteryEngine.getOverallMasteryPercent(gameState.masteryMap);
  const weakSpots = masteryEngine.getWeakSpots(gameState.masteryMap);

  const handleCopyBackup = () => {
    const json = exportBackup();
    navigator.clipboard.writeText(json);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  const handleApplyImport = () => {
    if (!jsonInput.trim()) return;
    const res = importBackup(jsonInput);
    if (res.success) {
      setImportStatus({ type: 'success', text: '✅ Khôi phục dữ liệu thành công!' });
      setTimeout(() => onClose(), 1500);
    } else {
      setImportStatus({ type: 'error', text: `❌ Lỗi: ${res.error}` });
    }
  };

  const handleConfirmReset = () => {
    resetGame();
    setShowConfirmReset(false);
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
            Góc Phụ Huynh & Cài Đặt ⚙️
          </h3>
          <p className="text-xs text-purple-700 mt-0.5">
            Theo dõi tiến trình học tập của bé Mai Nhiên và sao lưu dữ liệu
          </p>
        </div>

        <div className="overflow-y-auto pr-1 flex-1 flex flex-col gap-4">
          {/* Learning Progress Summary */}
          <div className="p-4 rounded-2xl bg-purple-50 border-2 border-purple-200">
            <h4 className="text-xs font-black text-purple-900 uppercase tracking-wider mb-2 font-display">
              Báo cáo tiến trình học tập
            </h4>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 bg-white rounded-xl border border-purple-100 shadow-sm">
                <div className="text-lg font-black text-purple-900 font-mono">
                  {totalMastered}/200
                </div>
                <div className="text-[10px] text-purple-600 font-bold">Làm chủ (100%)</div>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-purple-100 shadow-sm">
                <div className="text-lg font-black text-emerald-700 font-mono">
                  {overallPercent}%
                </div>
                <div className="text-[10px] text-emerald-600 font-bold">Tiến độ chung</div>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-purple-100 shadow-sm">
                <div className="text-lg font-black text-rose-700 font-mono">
                  {weakSpots.length}
                </div>
                <div className="text-[10px] text-rose-600 font-bold">Cần ôn luyện</div>
              </div>
            </div>
          </div>

          {/* Sound Toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-purple-50 border-2 border-purple-200">
            <div className="flex items-center gap-2">
              {isMuted ? <VolumeX className="text-purple-600" /> : <Volume2 className="text-purple-600" />}
              <span className="text-sm font-bold text-purple-900 font-display">Âm thanh & Hiệu ứng</span>
            </div>
            <button
              onClick={toggleMute}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-colors ${
                isMuted ? 'bg-gray-200 text-gray-700' : 'bg-purple-600 text-white'
              }`}
            >
              {isMuted ? 'Đang tắt' : 'Đang bật'}
            </button>
          </div>

          {/* Backup & Restore Data */}
          <div className="p-4 rounded-2xl bg-purple-50 border-2 border-purple-200">
            <h4 className="text-xs font-black text-purple-900 uppercase tracking-wider mb-2 font-display">
              Sao lưu & Chuyển đổi thiết bị (Backup / Restore)
            </h4>

            <div className="flex gap-2 mb-3">
              <button
                onClick={handleCopyBackup}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm transition-all"
              >
                <Download size={14} />
                <span>{copySuccess ? 'Đã sao chép mã!' : 'Sao chép mã dữ liệu'}</span>
              </button>
            </div>

            <div>
              <textarea
                rows={2}
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder="Dán mã sao lưu vào đây để khôi phục tiến độ..."
                className="w-full p-2 rounded-xl bg-white border border-purple-200 text-xs font-mono focus:outline-none focus:border-purple-400 mb-2"
              />
              <button
                onClick={handleApplyImport}
                disabled={!jsonInput.trim()}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm disabled:opacity-50 transition-all"
              >
                <Upload size={14} />
                <span>Khôi phục từ mã dán vào</span>
              </button>
              {importStatus && (
                <div className="text-xs font-bold text-center mt-2">{importStatus.text}</div>
              )}
            </div>
          </div>

          {/* Reset progress */}
          <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-200">
            <h4 className="text-xs font-black text-rose-900 uppercase tracking-wider mb-1 font-display">
              Đặt lại tiến độ
            </h4>
            <p className="text-[11px] text-rose-700 mb-3">
              Xóa sạch sao và lịch sử học tập để bé bắt đầu hành trình từ đầu.
            </p>

            {showConfirmReset ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleConfirmReset}
                  className="flex-1 py-2 rounded-xl bg-rose-600 text-white text-xs font-black shadow-md hover:bg-rose-700"
                >
                  Xác nhận xóa hết!
                </button>
                <button
                  onClick={() => setShowConfirmReset(false)}
                  className="py-2 px-4 rounded-xl bg-gray-200 text-gray-800 text-xs font-bold"
                >
                  Hủy
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowConfirmReset(true)}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white border border-rose-300 text-rose-700 hover:bg-rose-100 text-xs font-bold transition-colors"
              >
                <Trash2 size={14} />
                <span>Xóa dữ liệu làm lại từ đầu</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
