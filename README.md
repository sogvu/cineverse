# 🎬 Cineverse - Ứng Dụng Khám Phá & Xem Phim Trực Tuyến

**Cineverse** là một ứng dụng web khám phá và xem phim trực tuyến hiện đại, trực quan và đầy tương tác. Dự án được xây dựng hoàn chỉnh trên nền tảng Frontend-only kết hợp với dữ liệu cào trực tiếp từ API nguồn mở (OPhim/RoPhim), mang lại trải nghiệm xem phim chất lượng cao miễn phí với giao diện cao cấp.

---

## ✨ Điểm Nổi Bật Dự Án (Features)

- **Giao diện Cao Cấp & Trực Quan**: Áp dụng phong cách Glassmorphism hiện đại, hiệu ứng ánh sáng Neon và chuyển cảnh mượt mà.
- **Trải nghiệm 3D sống động**: Tích hợp các hạt bụi 3D chuyển động trong không gian bằng Three.js (`@react-three/fiber`).
- **Nhân vật Chibi tương tác**: Các nhân vật Chibi dễ thương tự động di chuyển, ngủ, chào hỏi và nói chuyện ngẫu nhiên với người dùng dựa trên mức cấu hình thiết bị.
- **Xem phim Đa nguồn (Multi-server)**: Phát trực tiếp phim qua link nhúng của server RoPhim (mặc định) hoặc chạy backup video trực tiếp qua hệ thống Cineverse.
- **Bộ lọc & Tìm kiếm mạnh mẽ**: Cho phép lọc phim theo thể loại, quốc gia, năm sản xuất, điểm đánh giá và sắp xếp linh hoạt.
- **Lưu lịch sử & Watchlist**: Quản lý lịch sử xem phim (lưu tiến trình giây xem hiện tại) và lưu danh sách yêu thích cá nhân thông qua Zustand LocalStorage persistence.

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

- **Framework**: Next.js 16 (App Router) & React 19 (TypeScript nghiêm ngặt).
- **Styling**: Tailwind CSS v4 (`@tailwindcss/postcss`) & Custom CSS Modules.
- **Hiệu ứng & 3D**:
  - 3D Rendering: `three`, `@react-three/fiber`, `@react-three/drei`
  - Motion: `framer-motion` (animations UI), `lottie-react` (các hiệu ứng Lottie)
- **State Management**: `zustand` (quản lý state Watchlist, History, UI theme và Movie Filter).
- **Sliders & Carousel**: `swiper` (hiển thị danh sách phim dạng trượt).

---

## 📁 Cấu Trúc Thư Mục (Project Structure)

```text
cineverse/
├── app/                  # Next.js App Router: Cấu trúc routes & pages chính
│   ├── auth/             # Trang đăng nhập / đăng ký
│   ├── category/         # Trang lọc phim theo danh mục (Phim lẻ, Phim bộ, Hoạt hình,...)
│   ├── movie/            # Trang chi tiết phim (thông tin, đạo diễn, diễn viên, bình luận)
│   ├── watch/            # Trang xem phim (tích hợp video player & chuyển tập phim)
│   ├── profile/          # Trang cá nhân quản lý danh sách yêu thích & lịch sử xem
│   ├── search/           # Trang tìm kiếm và bộ lọc nâng cao
│   └── globals.css       # File định nghĩa biến màu css, fonts, và hiệu ứng toàn cục
├── components/           # Các component React tái sử dụng
│   ├── 3d/               # Các hạt chuyển động 3D (Particle Field)
│   ├── characters/       # Logic hành vi & giao diện nhân vật Chibi tương tác
│   ├── home/             # Khung slide đầu trang (Hero) và các hàng phim trang chủ
│   ├── layout/           # Thanh điều hướng (Navbar) và chân trang (Footer)
│   └── movie/            # Thẻ phim (Movie Card) và hộp thoại xem trailer
├── data/                 # Cơ sở dữ liệu phim tĩnh
│   └── mockMovies.ts     # Danh sách phim chính dùng cho toàn web (sinh ra từ script Python)
├── store/                # Quản lý trạng thái toàn cục bằng Zustand
│   ├── movieStore.ts     # Bộ lọc & Tìm kiếm phim
│   ├── uiStore.ts        # Trạng thái giao diện (Dark/Light mode, Trailer, Player mode)
│   └── userStore.ts      # Watchlist, lịch sử xem, thông tin đăng nhập
├── types/                # Định nghĩa Typescript Interfaces (Movie, Genre, User,...)
├── scratch/              # Script Python dùng để cào dữ liệu phim & thử nghiệm
└── package.json          # Quản lý thư viện phụ thuộc và scripts chạy dự án
```

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy (Quick Start)

### 1. Khởi chạy Web Local
Yêu cầu máy tính cài đặt sẵn [Node.js](https://nodejs.org/).

```bash
# Di chuyển vào thư mục cineverse
cd cineverse

# Cài đặt các thư viện phụ thuộc
npm install

# Khởi chạy máy chủ phát triển
npm run dev
```
Mở trình duyệt truy cập: [https://cineverse-songvu.vercel.app/]((https://cineverse-songvu.vercel.app/))

### 2. Cập nhật Cơ sở dữ liệu Phim mới
Yêu cầu máy tính cài đặt sẵn [Python 3](https://www.python.org/).

Thư mục `scratch/` chứa các kịch bản python để kéo dữ liệu mới nhất từ nguồn API về file TypeScript cục bộ của trang web:

- **Cập nhật danh sách từ trang chủ RoPhim** (Lấy các phim mới và nổi bật nhất):
  ```bash
  cd scratch
  python fetch_rophims_all.py
  ```
- **Cập nhật ngẫu nhiên 100 phim đa dạng danh mục** (Phim lẻ, Phim bộ, Hoạt hình):
  ```bash
  cd scratch
  python fetch_100_movies.py
  ```

*Lưu ý: Các script sẽ tự động gọi API và chuyển đổi dữ liệu, ghi đè trực tiếp vào file `data/mockMovies.ts`.*

---

## ⚙️ Quy Tắc Phát Triển & Kiểm Soát (Development Rules)

1. **Quản lý dữ liệu**:
   - Dữ liệu phim luôn được lưu trữ tập trung tại [mockMovies.ts](file:///d:/Vũ/Song%20Vu%20File/Dự%20án%20Web%20Phim/cineverse/data/mockMovies.ts). Không sửa thủ công file này; hãy chạy các công cụ trong `scratch/` để tạo/cập nhật dữ liệu đồng nhất.
   - Khi chỉnh sửa dữ liệu, hãy tuân thủ kiểu dữ liệu `Movie` định nghĩa trong [types/index.ts](file:///d:/V%C5%A9/Song%20Vu%20File/Dự%20án%20Web%20Phim/cineverse/types/index.ts).

2. **Giao diện & Tương tác**:
   - Sử dụng Tailwind CSS kết hợp với CSS Biến số trong `globals.css` để đồng bộ hệ thống màu Neon.
   - Luôn kiểm tra tính tương thích Responsive trên thiết bị di động vì đây là ứng dụng thiên về trải nghiệm người dùng.
   - Các nhân vật Chibi tự động ẩn đi (`isPlayerMode = true`) khi người dùng truy cập trang `/watch` để tránh gây mất tập trung khi xem phim.

3. **Chạy kiểm tra**:
   - Trước khi gửi các thay đổi, chạy lệnh `npm run lint` để kiểm tra các lỗi cú pháp TypeScript và quy tắc viết code.
