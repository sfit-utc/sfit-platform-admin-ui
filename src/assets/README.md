# Assets Directory

Thư mục này chứa tất cả các tài nguyên tĩnh của ứng dụng SFIT Platform.

## Cấu trúc thư mục

### `/images`
Chứa các hình ảnh được sử dụng trong ứng dụng:

- **`/auth`** - Hình ảnh cho trang đăng nhập, đăng ký
  - `login-illustration.svg` - Hình minh họa trang đăng nhập
  - `register-illustration.svg` - Hình minh họa trang đăng ký
  - `auth-background.jpg` - Hình nền trang authentication

- **`/dashboard`** - Hình ảnh cho dashboard và các trang chính
  - `dashboard-hero.jpg` - Hình hero cho dashboard
  - `student-avatar.png` - Avatar mặc định cho sinh viên
  - `teacher-avatar.png` - Avatar mặc định cho giảng viên

- **`/landing`** - Hình ảnh cho trang landing
  - `hero-image.jpg` - Hình hero chính
  - `features-1.jpg` - Hình minh họa tính năng 1
  - `features-2.jpg` - Hình minh họa tính năng 2
  - `features-3.jpg` - Hình minh họa tính năng 3

### `/icons`
Chứa các icon tùy chỉnh:
- `logo.svg` - Logo chính của SFIT Platform
- `favicon.ico` - Favicon
- `apple-touch-icon.png` - Icon cho iOS

### `/illustrations`
Chứa các hình minh họa:
- `study-online.svg` - Minh họa học trực tuyến
- `collaboration.svg` - Minh họa hợp tác
- `achievement.svg` - Minh họa thành tích

## Quy tắc đặt tên

1. Sử dụng kebab-case cho tên file
2. Tên file phải mô tả rõ nội dung
3. Sử dụng định dạng phù hợp:
   - SVG: cho icons và illustrations
   - PNG: cho images có nền trong suốt
   - JPG: cho photos và images có nền

## Tối ưu hóa

- Nén tất cả images trước khi sử dụng
- Sử dụng WebP khi có thể
- Tạo responsive images cho các kích thước khác nhau
- Sử dụng lazy loading cho images không critical
