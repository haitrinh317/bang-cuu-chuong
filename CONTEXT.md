# Bảng Cửu Chương Phép Thuật Mai Nhiên — Domain Model

Web App học tập chuyên sâu, tương tác gamified theo phong cách **Roblox & Minecraft Voxel (Khối Hộp Ma Thuật)** giúp học sinh lớp 3 (bé Mai Nhiên) làm chủ 10 bảng nhân và 10 bảng chia (1–10), rèn luyện phản xạ tính nhẩm và trực quan hóa bản chất toán học thông qua xây dựng thế giới khối và vượt chướng ngại vật Obby.

## Language

### Thuật ngữ Toán học & Học tập

**Phép Tính (Math Fact)**:
Một cặp phép toán cơ bản gồm 2 thừa số và tích (nhân) hoặc số bị chia, số chia và thương (chia) trong phạm vi từ 1 đến 10.
_Avoid_: Câu hỏi, đề bài, bài tập nhỏ

**Mảng Khối Hộp (Voxel Block Array)**:
Mô hình trực quan biểu diễn phép nhân dưới dạng sàn gạch khối hộp isometric 3D (ví dụ sàn 4 hàng × 6 khối = 24 khối Minecraft), thể hiện trực tiếp bản chất diện tích và số lượng vật phẩm.
_Avoid_: Bảng số thông thường, hình vẽ trang trí phẳng

**Trục Số Bước Nhảy (Number Line Jump)**:
Phương pháp đếm cách đều và phân tích phép nhân thông qua bước nhảy cách quãng của thú cưng trên thước đo 0–100.
_Avoid_: Đếm nhẩm khô khan, vạch chia thông thường

**Độ Thành Thạo (Mastery Score)**:
Chỉ số từ 0% đến 100% của từng phép tính riêng biệt, đo lường độ chính xác và tốc độ phản xạ qua các lần đặt khối. Đạt 100% sau ít nhất 3 lần đúng nhanh liên tiếp sẽ nhận huy hiệu Vương Miện Vàng.
_Avoid_: Điểm số, phần trăm hoàn thành chung chung

**Lỗ Hổng Cửu Chương (Weak Spot)**:
Những phép tính mà bé thường trả lời sai hoặc mất nhiều thời gian phản xạ (Mastery Score dưới 70%), được đánh dấu là "Khối Nứt Cần Hàn Gắn".
_Avoid_: Điểm trừ, lỗi phạt

### Thuật ngữ Thế giới Khối Hộp (Roblox & Minecraft Theme)

**Đảo Bay Mai Nhiên (Mai Nhiên Skyblock Island)**:
Vương quốc trên mây của bé Mai Nhiên, nơi bé dùng các Khối Ngọc thu thập được từ việc học bảng cửu chương để xây dựng nông trại, lâu đài và vương quốc phép thuật.
_Avoid_: Bảng xếp hạng, màn hình kết quả

**Đường Chạy Obby Cửu Chương (Math Obby Jump)**:
Chế độ thử thách phản xạ nơi nhân vật nhảy trên các khối block nổi trên mây dẫn về đích. Mỗi bước nhảy tương ứng với 1 phép tính cửu chương.
_Avoid_: Bài kiểm tra, thi trắc nghiệm

**Ngọc Lục Bảo (Emeralds) & Kim Cương (Diamonds)**:
Đơn vị bảo vật kiếm được khi giải đúng và đạt chuỗi combo tốc độ tia chớp (< 3s), dùng để chế tạo và trang trí đảo bay.
_Avoid_: Xu vàng, điểm thưởng thông thường

**Xưởng Chế Tạo (Crafting Altar)**:
Nơi quy đổi Emeralds và Diamonds thành vật phẩm trang trí đảo và phụ kiện trang phục cho bạn đồng hành.
_Avoid_: Cửa hàng, shop mua sắm

**Bạn Đồng Hành Voxel (Voxel Companions)**:
Thú cưng phong cách khối hộp 3D chibi đáng yêu (Thỏ Bông Voxel, Mèo Mun Voxel, Cún Vàng Voxel và Kỳ Lân Cầu Vồng Huyền Thoại) đi theo hỗ trợ bé và đưa ra gợi ý thông minh khi gặp khó.
_Avoid_: Avatar 2D tĩnh, icon emoji
