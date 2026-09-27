// Dữ liệu Đảo Bay Mai Nhiên (Skyblock Tycoon) & Xưởng Chế Tạo

export const ISLAND_LANDMARKS = [
  {
    id: 'welcome_shrine',
    name: 'Bục Xuất Phát Ma Thuật',
    requiredMastery: 0,
    icon: '✨',
    color: '#A855F7',
    description: 'Nơi Mai Nhiên bắt đầu hành trình xây dựng thế giới khối phép thuật.',
    unlockedByDefault: true,
  },
  {
    id: 'windmill_candy',
    name: 'Cối Xay Gió Bánh Kẹo',
    requiredMastery: 20, // 20% tổng số phép tính thành thạo
    requiredTables: [2, 5],
    icon: '🍭',
    color: '#EC4899',
    description: 'Cối xay gió quay tít với những cánh quạt kẹo mút rực rỡ (Làm chủ Bảng 2 & 5).'
  },
  {
    id: 'cherry_garden',
    name: 'Vườn Anh Đào Khối Hộp',
    requiredMastery: 40,
    requiredTables: [3, 4],
    icon: '🌸',
    color: '#F472B6',
    description: 'Hàng cây anh đào khối vuông nở hoa rực rỡ và suối cá Koi (Làm chủ Bảng 3 & 4).'
  },
  {
    id: 'emerald_tower',
    name: 'Tháp Ngọc Lục Bảo',
    requiredMastery: 65,
    requiredTables: [6, 7],
    icon: '🟩',
    color: '#10B981',
    description: 'Ngọn tháp sừng sững tạc từ ngọc lục bảo nguyên khối (Làm chủ Bảng 6 & 7).'
  },
  {
    id: 'crystal_castle',
    name: 'Lâu Đài Mây Pha Lê',
    requiredMastery: 85,
    requiredTables: [8, 9],
    icon: '🏰',
    color: '#3B82F6',
    description: 'Lâu đài nguy nga trên tầng mây cao nhất (Làm chủ Bảng 8 & 9).'
  },
  {
    id: 'rainbow_bridge',
    name: 'Cầu Vồng Tối Thượng & Đài Kỳ Lân',
    requiredMastery: 100,
    requiredTables: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    icon: '🦄',
    color: '#8B5CF6',
    description: 'Kỳ quan huyền thoại vinh danh Thần Đồng Cửu Chương (Làm chủ toàn bộ 10 Bảng)!'
  }
];

export const CRAFTING_CATALOG = [
  {
    id: 'flower_rainbow',
    type: 'decor',
    name: 'Bụi Hoa Cầu Vồng Voxel',
    costEmeralds: 20,
    costDiamonds: 0,
    icon: '🌺',
    description: 'Bụi hoa nhiều màu sắc tỏa hương thơm mát trên bãi cỏ đảo.'
  },
  {
    id: 'magic_lantern',
    type: 'decor',
    name: 'Đèn Lồng Phép Thuật',
    costEmeralds: 35,
    costDiamonds: 1,
    icon: '🏮',
    description: 'Đèn lồng khối vuông phát sáng lung linh huyền ảo về đêm.'
  },
  {
    id: 'floating_balloon',
    type: 'decor',
    name: 'Khinh Khí Cầu Kẹo Ngọt',
    costEmeralds: 60,
    costDiamonds: 2,
    icon: '🎈',
    description: 'Quả bóng khí cầu bay bồng bềnh canh giữ bầu trời đảo bay.'
  },
  {
    id: 'magic_fountain',
    type: 'decor',
    name: 'Đài Phun Nước Pha Lê',
    costEmeralds: 90,
    costDiamonds: 3,
    icon: '⛲',
    description: 'Đài phun nước với những giọt nước kim cương lấp lánh.'
  },
  {
    id: 'hat_wizard',
    type: 'accessory',
    name: 'Nón Phù Thủy Voxel',
    costEmeralds: 40,
    costDiamonds: 1,
    icon: '🧙‍♀️',
    description: 'Mũ phù thủy tím chóp nhọn cho bạn thú cưng đội lên đầu.'
  },
  {
    id: 'hat_wings',
    type: 'accessory',
    name: 'Đôi Cánh Tiên Bướm Voxel',
    costEmeralds: 80,
    costDiamonds: 4,
    icon: '🧚‍♀️',
    description: 'Đôi cánh lấp lánh giúp bạn thú cưng bay lượn theo bé.'
  },
  {
    id: 'hat_crown',
    type: 'accessory',
    name: 'Vương Miện Kim Cương',
    costEmeralds: 120,
    costDiamonds: 6,
    icon: '👑',
    description: 'Vương miện hoàng gia dành riêng cho Bậc Thầy Cửu Chương!'
  }
];
