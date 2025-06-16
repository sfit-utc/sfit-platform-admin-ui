
## Đóng góp dự án

### 📋 Quy trình đóng góp

1. **Clone** fork về máy local:
   ```bash
   git clone <url>
   ```

2. **Tạo branch mới** cho feature/bugfix:
   ```bash
   git checkout -b feat/ten-feature-moi
   # hoặc
   git checkout -b fix/ten-bug-fix
   # hoặc theo bài viết đã gửi
   ```

3. **Cài đặt dependencies**:
   ```bash
   npm install
   ```

4. **Thực hiện thay đổi** và test thoroughly

5. **Commit** với message rõ ràng:
   ```bash
   git add .
   git commit -m "feat: thêm component Button mới"
     # hoặc theo bài viết đã gửi
   ```

6. **Merge** nhánh main vào nhánh hiện tại 
- lưu ý pull code mới nhất nhánh main ở remote về local rồi mới tiến hành merge để đảm bảo là phiên bản mới nhất

6. **Push** lên fork của bạn:
   ```bash
   git push origin feature/ten-feature-moi
   ```
7. **Tạo Pull Request** từ GitHub interface
- Nếu xảy ra xung đột thì giải quyết liên hệ với người liên quan để tránh xóa code của nhau
