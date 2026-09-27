import React, { useState } from 'react';
import PWAInstallPrompt from './components/common/PWAInstallPrompt';
import { GameProvider, useGame } from './context/GameContext';
import Header from './components/common/Header';
import TabNav from './components/common/TabNav';
import SkyblockIslandView from './components/views/SkyblockIslandView';
import DiscoveryGardenView from './components/views/DiscoveryGardenView';
import TablePracticeView from './components/views/TablePracticeView';
import ObbyParkourView from './components/views/ObbyParkourView';
import WeakSpotAltarView from './components/views/WeakSpotAltarView';
import CraftingAltarView from './components/views/CraftingAltarView';
import PetSelectorModal from './components/modals/PetSelectorModal';
import ParentSettingsModal from './components/modals/ParentSettingsModal';
import { masteryEngine } from './services/masteryEngine';

function MainGameLayout() {
  const { gameState } = useGame();
  const [activeTab, setActiveTab] = useState('skyblock'); // 'skyblock' | 'discovery' | 'practice' | 'obby' | 'weakspots' | 'crafting'
  const [isPetModalOpen, setIsPetModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const weakSpots = masteryEngine.getWeakSpots(gameState.masteryMap);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-pink-50 to-indigo-100 flex flex-col font-sans text-purple-950">
      {/* Unified Top Sticky Navigation Bar */}
      <header className="sticky top-0 z-30 w-full flex flex-col bg-white/95 backdrop-blur-md shadow-md border-b-2 border-purple-200">
        <Header
          onOpenPetModal={() => setIsPetModalOpen(true)}
          onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        />
        <TabNav
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          weakCount={weakSpots.length}
        />
      </header>

      {/* Main View Router */}
      <main className="flex-1 w-full pb-16">
        {activeTab === 'skyblock' && <SkyblockIslandView onSelectTab={setActiveTab} />}
        {activeTab === 'discovery' && <DiscoveryGardenView />}
        {activeTab === 'practice' && <TablePracticeView />}
        {activeTab === 'obby' && <ObbyParkourView />}
        {activeTab === 'weakspots' && <WeakSpotAltarView />}
        {activeTab === 'crafting' && <CraftingAltarView />}
      </main>

      {/* Modals */}
      <PetSelectorModal
        isOpen={isPetModalOpen}
        onClose={() => setIsPetModalOpen(false)}
      />

      <ParentSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />

      {/* Footer watermark */}
      <footer className="w-full text-center py-4 text-xs text-purple-600/70 border-t border-purple-200/50">
        Dành tặng bé <strong className="text-purple-800">Mai Nhiên (Lớp 3)</strong> • Bảng Cửu Chương Voxel Phép Thuật
      </footer>

      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <MainGameLayout />
    </GameProvider>
  );
}
