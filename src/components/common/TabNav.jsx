import React from 'react';
import { soundService } from '../../services/soundService';

export default function TabNav({ activeTab, onSelectTab, weakCount = 0 }) {
  const tabs = [
    { id: 'skyblock', label: 'Đảo Bay', icon: '🏝️', badge: null },
    { id: 'discovery', label: 'Khám Phá', icon: '🌸', badge: null },
    { id: 'practice', label: 'Luyện Bảng', icon: '🧪', badge: null },
    { id: 'obby', label: 'Obby Mây', icon: '⚡', badge: 'Hot' },
    { id: 'weakspots', label: 'Lỗ Hổng', icon: '🩹', badge: weakCount > 0 ? weakCount : null },
    { id: 'crafting', label: 'Chế Tạo', icon: '🛠️', badge: null },
  ];

  const handleTabClick = (tabId) => {
    soundService.playBlockPlace();
    onSelectTab(tabId);
  };

  return (
    <nav className="w-full px-2 py-1.5 sm:py-2 overflow-x-auto no-scrollbar select-none" style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-x' }}>
      <div className="flex items-center justify-start md:justify-center gap-1.5 sm:gap-2 md:gap-3 min-w-max mx-auto px-1 sm:px-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-2xl text-xs sm:text-sm md:text-base font-black transition-all duration-200 border-2 font-display min-h-[44px] sm:min-h-[48px] cursor-pointer ${
                isActive
                  ? 'bg-purple-600 text-white border-purple-700 shadow-md -translate-y-0.5'
                  : 'bg-white/80 text-purple-800 border-purple-200 hover:bg-purple-100 hover:border-purple-300'
              }`}
            >
              <span className="text-base sm:text-lg md:text-xl">{tab.icon}</span>
              <span>{tab.label}</span>

              {tab.badge && (
                <span
                  className={`text-[10px] sm:text-xs font-black px-1.5 sm:px-2 py-0.5 rounded-full ml-0.5 sm:ml-1 ${
                    tab.badge === 'Hot'
                      ? 'bg-amber-400 text-amber-950 animate-pulse'
                      : 'bg-rose-500 text-white'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
