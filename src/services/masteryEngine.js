// Thuật toán đo lường Độ Thành Thạo (Mastery Engine) & Sàng lọc Lỗ hổng Cửu Chương

import { ALL_MATH_FACTS, MULTIPLICATION_FACTS, DIVISION_FACTS, FACT_MAP } from '../data/mathCurriculum';

export const masteryEngine = {
  // Cập nhật kết quả làm bài của một phép tính
  recordAnswer(currentMasteryMap, factId, isCorrect, speedMs) {
    const existing = currentMasteryMap[factId] || {
      mastery: 0,
      correct: 0,
      wrong: 0,
      bestSpeed: null,
      lastAnswered: null,
    };

    let newMastery = existing.mastery;
    let newCorrect = existing.correct;
    let newWrong = existing.wrong;
    let newBestSpeed = existing.bestSpeed;

    if (isCorrect) {
      newCorrect += 1;
      if (newBestSpeed === null || speedMs < newBestSpeed) {
        newBestSpeed = speedMs;
      }

      if (speedMs < 3000) {
        // Tốc độ tia chớp: +25%
        newMastery = Math.min(100, newMastery + 25);
      } else if (speedMs <= 6000) {
        // Tốc độ bình thường: +15%
        newMastery = Math.min(100, newMastery + 15);
      } else {
        // Tốc độ chậm (>6s): +10%
        newMastery = Math.min(100, newMastery + 10);
      }
    } else {
      newWrong += 1;
      // Trả lời sai: trừ 30%, đưa vào danh sách cần chú ý
      newMastery = Math.max(0, newMastery - 30);
    }

    return {
      ...currentMasteryMap,
      [factId]: {
        mastery: newMastery,
        correct: newCorrect,
        wrong: newWrong,
        bestSpeed: newBestSpeed,
        lastAnswered: Date.now(),
      }
    };
  },

  // Lấy danh sách các phép tính đang là "Lỗ hổng" (Mastery < 70% và đã từng sai hoặc chậm)
  getWeakSpots(masteryMap) {
    const weakList = [];
    Object.keys(masteryMap).forEach((factId) => {
      const data = masteryMap[factId];
      if (data.wrong > 0 || (data.correct > 0 && data.mastery < 70)) {
        const fact = FACT_MAP[factId];
        if (fact) {
          weakList.push({
            ...fact,
            ...data
          });
        }
      }
    });

    // Sắp xếp: Ưu tiên điểm thành thạo thấp nhất lên đầu
    return weakList.sort((a, b) => a.mastery - b.mastery);
  },

  // Tính phần trăm thành thạo của một bảng cụ thể (ví dụ Bảng nhân 7)
  getTableProgress(masteryMap, tableNumber, type = 'multiplication') {
    const list = type === 'multiplication'
      ? MULTIPLICATION_FACTS.filter(f => f.table === tableNumber)
      : DIVISION_FACTS.filter(f => f.table === tableNumber);

    if (list.length === 0) return 0;
    const totalMastery = list.reduce((sum, f) => {
      const m = (masteryMap[f.id] && masteryMap[f.id].mastery) || 0;
      return sum + m;
    }, 0);

    return Math.round(totalMastery / list.length);
  },

  // Đếm tổng số phép tính đã đạt 100% (Vương Miện Vàng)
  getTotalMasteredFacts(masteryMap) {
    let count = 0;
    ALL_MATH_FACTS.forEach(fact => {
      if (masteryMap[fact.id] && masteryMap[fact.id].mastery >= 100) {
        count += 1;
      }
    });
    return count;
  },

  // Tính tỷ lệ hoàn thành tổng thể toàn bộ 200 phép tính
  getOverallMasteryPercent(masteryMap) {
    const masteredCount = this.getTotalMasteredFacts(masteryMap);
    return Math.round((masteredCount / ALL_MATH_FACTS.length) * 100);
  }
};
