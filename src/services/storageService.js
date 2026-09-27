// LocalStorage Persistence & Parent Export/Import Service

const STORAGE_KEY = 'bcc_mai_nhien_save_v1';

export const INITIAL_STATE = {
  playerName: 'Mai Nhiên',
  selectedPet: 'bunny', // 'bunny' | 'kitty' | 'corgi' | 'unicorn'
  petName: 'Thỏ Ngọc',
  emeralds: 50, // Starting emeralds to buy first island flower
  diamonds: 5,
  masteryMap: {}, // [factId]: { mastery: 0-100, correct: 0, wrong: 0, bestSpeed: null, lastAnswered: timestamp }
  unlockedLandmarks: ['welcome_shrine'], // landmarks on Skyblock
  islandDecor: [], // bought items placed on island
  obbyTier: 'bronze', // 'bronze' | 'silver' | 'gold' | 'diamond'
  completedObbyStages: [], // array of stage IDs
  customHat: null, // companion accessory
  version: 1,
};

export const storageService = {
  loadState() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return INITIAL_STATE;
      const parsed = JSON.parse(data);
      return { ...INITIAL_STATE, ...parsed };
    } catch (e) {
      console.error('Error loading game state:', e);
      return INITIAL_STATE;
    }
  },

  saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Error saving game state:', e);
    }
  },

  exportStateJSON(state) {
    return JSON.stringify(state, null, 2);
  },

  importStateJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('Định dạng dữ liệu không hợp lệ!');
      }
      const merged = { ...INITIAL_STATE, ...parsed };
      this.saveState(merged);
      return { success: true, state: merged };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  resetState() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return INITIAL_STATE;
    } catch (e) {
      return INITIAL_STATE;
    }
  }
};
