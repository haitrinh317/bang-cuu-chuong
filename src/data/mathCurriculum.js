// Dữ liệu toàn diện 10 Bảng Nhân & 10 Bảng Chia (1–10) chuẩn Toán lớp 3

// Sinh tự động 100 phép nhân (1x1 đến 10x10)
export const MULTIPLICATION_FACTS = [];
// Sinh tự động 100 phép chia (1:1 đến 100:10)
export const DIVISION_FACTS = [];

const ITEM_THEMES = [
  '🍓 Dâu Tây', '🥕 Cà Rốt', '🍎 Táo Đỏ', '⭐ Ngôi Sao', '💎 Kim Cương',
  '🟩 Ngọc Lục Bảo', '🌸 Hoa Anh Đào', '🧁 Bánh Kem', '🍬 Kẹo Bảy Màu', '🍄 Nấm Phép'
];

// Helper sinh gợi ý thông minh cho phép nhân
function generateMulHint(a, b) {
  if (a === 0 || b === 0) return 'Bất kỳ số nào nhân với 0 cũng bằng 0 bạn nhé!';
  if (a === 1) return `1 nhân với số nào cũng bằng chính số đó: 1 × ${b} = ${b}`;
  if (b === 1) return `Số nào nhân với 1 cũng bằng chính nó: ${a} × 1 = ${a}`;
  if (a === 5) return `Bảng nhân 5 tận cùng luôn là 0 hoặc 5: đếm thêm 5 là ra nè!`;
  if (a === 10 || b === 10) return `Nhân với 10 chỉ cần thêm số 0 vào sau thôi nhé!`;
  if (b > 1) {
    const prev = a * (b - 1);
    return `Mẹo nhỏ: ${a} × ${b - 1} = ${prev}, thêm ${a} nữa là ${prev + a}!`;
  }
  return `Phép nhân là tính tổng ${b} lần số ${a}: ${Array(b).fill(a).join(' + ')}`;
}

// Helper sinh gợi ý cho phép chia
function generateDivHint(dividend, divisor, quotient) {
  if (dividend === 0) return 'Số 0 chia cho số nào khác 0 cũng bằng 0!';
  if (divisor === 1) return `Số nào chia cho 1 cũng bằng chính số đó!`;
  if (divisor === quotient && dividend === divisor * quotient) {
    return `Vì ${divisor} × ${quotient} = ${dividend}, nên ${dividend} : ${divisor} = ${quotient}!`;
  }
  return `Hãy nhớ lại bảng nhân ${divisor}: ${divisor} nhân mấy thì bằng ${dividend}? Đó là ${quotient}!`;
}

// Khởi tạo bảng nhân 1-10
for (let a = 1; a <= 10; a++) {
  for (let b = 1; b <= 10; b++) {
    const result = a * b;
    MULTIPLICATION_FACTS.push({
      id: `m_${a}_${b}`,
      type: 'multiplication',
      table: a,
      multiplier: b,
      result: result,
      questionText: `${a} × ${b}`,
      displayLatex: `${a} × ${b} = ${result}`,
      hint: generateMulHint(a, b),
      themeItem: ITEM_THEMES[(a - 1) % ITEM_THEMES.length],
      commutativeId: `m_${b}_${a}`,
      relatedDivisions: [`d_${result}_${a}`, `d_${result}_${b}`]
    });
  }
}

// Khởi tạo bảng chia 1-10
for (let divisor = 1; divisor <= 10; divisor++) {
  for (let quotient = 1; quotient <= 10; quotient++) {
    const dividend = divisor * quotient;
    DIVISION_FACTS.push({
      id: `d_${dividend}_${divisor}`,
      type: 'division',
      table: divisor,
      divisor: divisor,
      dividend: dividend,
      result: quotient,
      questionText: `${dividend} : ${divisor}`,
      displayLatex: `${dividend} : ${divisor} = ${quotient}`,
      hint: generateDivHint(dividend, divisor, quotient),
      themeItem: ITEM_THEMES[(divisor - 1) % ITEM_THEMES.length],
      relatedMultiplication: `m_${divisor}_${quotient}`
    });
  }
}

// Toàn bộ 200 phép tính
export const ALL_MATH_FACTS = [...MULTIPLICATION_FACTS, ...DIVISION_FACTS];

// Bảng tra nhanh theo ID
export const FACT_MAP = ALL_MATH_FACTS.reduce((acc, fact) => {
  acc[fact.id] = fact;
  return acc;
}, {});

// Danh sách bài tập thử thách: Phép chia có dư lớp 3 (Khu vực mở khóa đặc biệt)
export const REMAINDER_CHALLENGES = [
  { id: 'rem_1', text: '17 : 3', dividend: 17, divisor: 3, quotient: 5, remainder: 2, hint: '3 × 5 = 15, 17 - 15 = 2. Vậy được 5 dư 2!' },
  { id: 'rem_2', text: '19 : 4', dividend: 19, divisor: 4, quotient: 4, remainder: 3, hint: '4 × 4 = 16, 19 - 16 = 3. Vậy được 4 dư 3!' },
  { id: 'rem_3', text: '26 : 5', dividend: 26, divisor: 5, quotient: 5, remainder: 1, hint: '5 × 5 = 25, 26 - 25 = 1. Vậy được 5 dư 1!' },
  { id: 'rem_4', text: '38 : 6', dividend: 38, divisor: 6, quotient: 6, remainder: 2, hint: '6 × 6 = 36, 38 - 36 = 2. Vậy được 6 dư 2!' },
  { id: 'rem_5', text: '45 : 7', dividend: 45, divisor: 7, quotient: 6, remainder: 3, hint: '7 × 6 = 42, 45 - 42 = 3. Vậy được 6 dư 3!' },
  { id: 'rem_6', text: '58 : 8', dividend: 58, divisor: 8, quotient: 7, remainder: 2, hint: '8 × 7 = 56, 58 - 56 = 2. Vậy được 7 dư 2!' },
  { id: 'rem_7', text: '75 : 8', dividend: 75, divisor: 8, quotient: 9, remainder: 3, hint: '8 × 9 = 72, 75 - 72 = 3. Vậy được 9 dư 3!' },
  { id: 'rem_8', text: '83 : 9', dividend: 83, divisor: 9, quotient: 9, remainder: 2, hint: '9 × 9 = 81, 83 - 81 = 2. Vậy được 9 dư 2!' }
];

// Định nghĩa 4 Tầng Danh Vọng Obby Leo Tháp
export const OBBY_TIERS = {
  bronze: {
    id: 'bronze',
    name: 'Tầng Đồng (Tập Sự)',
    tables: [2, 5],
    icon: '🥉',
    color: '#CD7F32',
    bgGradient: 'linear-gradient(135deg, #FDE68A 0%, #D97706 100%)',
    requiredStars: 0,
    description: 'Chinh phục Bảng 2 và Bảng 5 dễ nhớ nhất'
  },
  silver: {
    id: 'silver',
    name: 'Tầng Bạc (Phù Thủy Khối)',
    tables: [3, 4, 6],
    icon: '🥈',
    color: '#94A3B8',
    bgGradient: 'linear-gradient(135deg, #E2E8F0 0%, #64748B 100%)',
    requiredStars: 10,
    description: 'Làm chủ Bảng 3, Bảng 4 và Bảng 6 nhịp nhàng'
  },
  gold: {
    id: 'gold',
    name: 'Tầng Vàng (Bậc Thầy Cửu Chương)',
    tables: [7, 8, 9],
    icon: '🥇',
    color: '#F59E0B',
    bgGradient: 'linear-gradient(135deg, #FEF08A 0%, #EAB308 100%)',
    requiredStars: 25,
    description: 'Vượt qua Bảng 7, Bảng 8 và Bảng 9 đầy thử thách'
  },
  diamond: {
    id: 'diamond',
    name: 'Tầng Kim Cương (Thần Đồng Voxel)',
    tables: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    icon: '💎',
    color: '#06B6D4',
    bgGradient: 'linear-gradient(135deg, #A5F3FC 0%, #0284C7 100%)',
    requiredStars: 45,
    description: 'Đỉnh cao phản xạ 10 bảng nhân chia + Phép chia có dư'
  }
};
