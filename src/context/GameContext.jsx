import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageService, INITIAL_STATE } from '../services/storageService';
import { soundService } from '../services/soundService';
import { masteryEngine } from '../services/masteryEngine';
import { CRAFTING_CATALOG, ISLAND_LANDMARKS } from '../data/skyblockData';

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [gameState, setGameState] = useState(() => storageService.loadState());
  const [isMuted, setIsMuted] = useState(soundService.isMuted);

  // Lưu state tự động mỗi khi có thay đổi
  useEffect(() => {
    storageService.saveState(gameState);
  }, [gameState]);

  // Kiểm tra mở khóa công trình đảo bay tự động dựa theo độ thành thạo
  useEffect(() => {
    const overallPercent = masteryEngine.getOverallMasteryPercent(gameState.masteryMap);
    const toUnlock = [];

    ISLAND_LANDMARKS.forEach((landmark) => {
      if (!gameState.unlockedLandmarks.includes(landmark.id)) {
        if (overallPercent >= landmark.requiredMastery) {
          toUnlock.push(landmark.id);
        }
      }
    });

    if (toUnlock.length > 0) {
      setGameState((prev) => ({
        ...prev,
        unlockedLandmarks: [...prev.unlockedLandmarks, ...toUnlock]
      }));
      soundService.playVictoryFanfare();
    }
  }, [gameState.masteryMap]);

  // Bật/tắt âm thanh
  const toggleMute = () => {
    const muted = soundService.toggleMute();
    setIsMuted(muted);
  };

  // Cập nhật thông tin bé và thú cưng
  const updatePet = (petId, petName, playerName) => {
    setGameState((prev) => ({
      ...prev,
      selectedPet: petId || prev.selectedPet,
      petName: petName || prev.petName,
      playerName: playerName || prev.playerName,
    }));
    soundService.playEmeraldCollect();
  };

  // Thưởng Emerald và Diamond
  const addRewards = (emeraldsToAdd = 0, diamondsToAdd = 0) => {
    setGameState((prev) => ({
      ...prev,
      emeralds: prev.emeralds + emeraldsToAdd,
      diamonds: prev.diamonds + diamondsToAdd,
    }));
    if (diamondsToAdd > 0) {
      soundService.playLightningSuper();
    } else if (emeraldsToAdd > 0) {
      soundService.playEmeraldCollect();
    }
  };

  // Ghi nhận câu trả lời và cập nhật Mastery
  const recordAnswer = (factId, isCorrect, speedMs) => {
    setGameState((prev) => {
      const updatedMastery = masteryEngine.recordAnswer(
        prev.masteryMap,
        factId,
        isCorrect,
        speedMs
      );

      // Thưởng tự động
      let earnedEmeralds = 0;
      let earnedDiamonds = 0;

      if (isCorrect) {
        if (speedMs < 3000) {
          // Tốc độ tia chớp: 5 emeralds + 1 diamond
          earnedEmeralds = 5;
          earnedDiamonds = 1;
        } else {
          // Đúng thường: 3 emeralds
          earnedEmeralds = 3;
        }
      }

      return {
        ...prev,
        masteryMap: updatedMastery,
        emeralds: prev.emeralds + earnedEmeralds,
        diamonds: prev.diamonds + earnedDiamonds,
      };
    });
  };

  // Chế tạo vật phẩm trong Crafting Altar
  const craftItem = (itemId) => {
    const item = CRAFTING_CATALOG.find((i) => i.id === itemId);
    if (!item) return { success: false, message: 'Vật phẩm không tồn tại!' };

    if (gameState.emeralds < item.costEmeralds || gameState.diamonds < item.costDiamonds) {
      soundService.playWrongSoft();
      return { success: false, message: 'Chưa đủ Ngọc Lục Bảo hoặc Kim Cương!' };
    }

    setGameState((prev) => {
      const newDecor = item.type === 'decor' ? [...prev.islandDecor, item.id] : prev.islandDecor;
      const newHat = item.type === 'accessory' ? item.id : prev.customHat;

      return {
        ...prev,
        emeralds: prev.emeralds - item.costEmeralds,
        diamonds: prev.diamonds - item.costDiamonds,
        islandDecor: newDecor,
        customHat: newHat,
      };
    });

    soundService.playVictoryFanfare();
    return { success: true, item };
  };

  // Hoàn thành 1 chặng Obby
  const completeObbyStage = (stageId, stars = 3) => {
    setGameState((prev) => {
      if (prev.completedObbyStages.includes(stageId)) return prev;
      return {
        ...prev,
        completedObbyStages: [...prev.completedObbyStages, stageId],
      };
    });
  };

  // Khôi phục mặc định
  const resetGame = () => {
    const fresh = storageService.resetState();
    setGameState(fresh);
  };

  // Nhập dữ liệu sao lưu
  const importBackup = (jsonString) => {
    const res = storageService.importStateJSON(jsonString);
    if (res.success) {
      setGameState(res.state);
      return { success: true };
    }
    return res;
  };

  const value = {
    gameState,
    isMuted,
    toggleMute,
    updatePet,
    addRewards,
    recordAnswer,
    craftItem,
    completeObbyStage,
    resetGame,
    importBackup,
    exportBackup: () => storageService.exportStateJSON(gameState),
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
