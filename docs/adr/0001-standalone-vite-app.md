# ADR 0001: Xây dựng App Bảng Cửu Chương dưới dạng Standalone Vite Web App

Ứng dụng học Bảng cửu chương và phép chia cho bé Mai Nhiên được quyết định triển khai dưới dạng một ứng dụng web độc lập (Standalone Single Page Application với Vite + React) đặt tại workspace `Bang-cuu-chuong`, thay vì nhúng trực tiếp thành một sub-page trong `mainhien`.

Quyết định này giúp ứng dụng có vòng đời khởi động siêu tốc (instant load), kích thước bundle cực nhỏ (< 200KB), có thể cài đặt độc lập thành PWA trên iPad của bé với icon riêng biệt, đồng thời không làm phình to hoặc phụ thuộc vào chu kỳ phát hành theo tuần của SGK `mainhien`. Ứng dụng vẫn chia sẻ chung hệ ngôn ngữ thiết kế "Pastel Magic Garden" và hệ thống nhân vật đồng hành để duy trì tính nhất quán về trải nghiệm cho bé.
