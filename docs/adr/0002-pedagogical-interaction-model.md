# ADR 0002: Mô hình sư phạm không áp lực và Tương tác Đa giác quan Client-side

Hệ thống luyện tập Bảng cửu chương và phép chia áp dụng nguyên tắc thiết kế thân thiện tâm lý cho học sinh lớp 3: loại bỏ hoàn toàn cơ chế đếm ngược đột ngột (Sudden Game-Over Timer), thay thế bằng thang tốc độ phản xạ tia chớp (Lightning Speed Bonus) để khuyến khích tính nhẩm nhanh mà không gây căng thẳng.

Khi bé làm sai, hệ thống không phạt nặng mà kích hoạt gợi ý gợi mở (Scaffolding Hint) từ Bạn Đồng Hành dựa trên tính chất giao hoán và các mốc dễ nhớ (ví dụ: `7 × 8` gợi ý từ `7 × 7 = 49 + 7`). Toàn bộ hiệu ứng âm thanh được tạo độc quyền bằng Web Audio API nhằm đảm bảo zero-latency, hoạt động ngoại tuyến 100% không phụ thuộc tài nguyên mạng hay API ngoài.
