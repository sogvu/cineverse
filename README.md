## 📝 Giới thiệu Dự án

**Cineverse** là một ứng dụng web toàn diện dành cho những tín đồ điện ảnh để tìm kiếm, khám phá và quản lý thế giới phim ảnh của riêng mình. Hệ thống tích hợp các API dữ liệu lớn, mang lại trải nghiệm mượt mà từ việc xem trailer, đánh giá phim đến việc cá nhân hóa danh sách theo dõi. 

Dự án được xây dựng với tư duy thiết kế hệ thống tối ưu, phân tách rõ ràng trách nhiệm giữa hai phần Client và Server nhằm đảm bảo khả năng mở rộng, tính bảo mật cao và hiệu năng vận hành ổn định.

> 🚀 **Mục tiêu kỹ thuật:** Áp dụng các kiến trúc chuẩn công nghiệp như Clean Architecture hoặc Repository Pattern, tối ưu hóa truy vấn SQL Server, mang lại trải nghiệm UI/UX mượt mà trên mọi thiết bị với Dark Mode thời thượng.

---

## 📌 Các Tính năng Nổi bật

### 👤 Dành cho Người dùng (Client-Side)
* **Xác thực & Bảo mật:** Đăng ký, đăng nhập hệ thống an toàn bằng cơ chế mã hóa mật khẩu và cấp phát mã token định danh (JWT).
* **Khám phá Điện ảnh:** Liên tục cập nhật các danh sách phim xu hướng (Trending), phim sắp chiếu (Upcoming) và phim được đánh giá cao nhờ đồng bộ hóa dữ liệu thông minh.
* **Bộ lọc và Tìm kiếm Thông minh:** Hỗ trợ tìm kiếm theo từ khóa, thể loại, năm phát hành, sắp xếp theo điểm đánh giá. Áp dụng kỹ thuật *Debouncing* ở Frontend để giảm tải số lượng truy vấn đến API Server.
* **Watchlist cá nhân:** Cho phép người dùng thêm các bộ phim yêu thích vào không gian lưu trữ riêng để theo dõi lại sau.
* **Hệ thống Đánh giá (Review System):** Người dùng có thể chấm điểm tương tác (Rating) và để lại bình luận chuyên sâu dưới mỗi bài viết phim.

### 👑 Dành cho Quản trị viên (Admin Dashboard)
* **Quản lý Tài nguyên (CRUD):** Giao diện quản trị mạnh mẽ giúp thêm, sửa, xóa danh sách phim, danh mục thể loại, thông tin diễn viên, đạo diễn.
* **Kiểm duyệt nội dung:** Quản lý bình luận của người dùng nhằm xây dựng một cộng đồng văn minh.
* **Thống kê Tổng quan:** Cung cấp số liệu trực quan về lượng người dùng mới, phim hot nhất trong tháng và biểu đồ xu hướng thể loại được quan tâm.

---

## 🛠️ Công nghệ Sử dụng (Tech Stack)

### 🖥️ Backend (Core Engine)
* **Framework:** ASP.NET Core Web API (.NET 8.0)
* **Database Access:** Entity Framework Core (Code-First Approach)
* **Database:** Microsoft SQL Server (Tối ưu hóa các bảng, chỉ mục và ràng buộc dữ liệu)
* **Security:** JSON Web Tokens (JWT) & ASP.NET Core Identity để phân quyền chi tiết (Role-based Authorization: Admin/User)
* **Architecture:** Cấu trúc dự án theo hướng mô-đun hóa cao, dễ viết Unit Test và bảo trì lâu dài.

### 🎨 Frontend (User Interface)
* **Framework:** React.js / Vite hoặc Next.js (TypeScript)
* **State Management:** Redux Toolkit hoặc Context API để đồng bộ dữ liệu toàn cục.
* **Styling:** Tailwind CSS & các UI components hiện đại (Shadcn/ui hoặc Ant Design), hỗ trợ giao diện Responsive hoàn hảo trên Mobile, Tablet và Desktop.

---

## 📂 Cấu trúc Thư mục Dự án

```text
cineverse/
├── Cineverse.Backend/                 # Mã nguồn xử lý Backend (ASP.NET Core)
│   ├── Cineverse.Domain/              # Định nghĩa các thực thể (Entities) và Interfaces cốt lõi
│   ├── Cineverse.Application/         # Logic xử lý nghiệp vụ, DTOs, CQRS/Services
│   ├── Cineverse.Infrastructure/      # Kết nối Database (DbContext), Repositories, Migrations
│   └── Cineverse.API/                 # Controllers tiếp nhận request, Cấu hình Middlewares & appsettings.json
├── cineverse-frontend/                # Mã nguồn xử lý Frontend (React/Next.js)
│   ├── src/
│   │   ├── components/                # Các thành phần giao diện tái sử dụng (Button, Card, Modal...)
│   │   ├── pages/                     # Các trang chức năng chính (Home, MovieDetail, Profile, Admin...)
│   │   ├── services/                  # Xử lý các lệnh gọi API kết nối đến Server (Axios Instance)
│   │   └── store/                     # Cấu hình quản lý luồng dữ liệu (Redux Store)
└── README.md
