# Hướng dẫn chạy Project trên Docker

## Yêu cầu
- Docker Desktop đã cài đặt
- Docker Compose

## Bước 1: Export Database (Quan trọng!)

Trước khi chạy Docker, bạn cần export database hiện tại:

```bash
mysqldump -u root -p webdodientu > database/init.sql
```

## Bước 2: Chạy Docker Compose

```bash
# Build và chạy tất cả services
docker-compose up --build

# Hoặc chạy ở chế độ background
docker-compose up --build -d
```

## Bước 3: Truy cập ứng dụng

- **Client (Trang khách hàng):** http://localhost:3000
- **Admin Panel:** http://localhost:3001
- **Backend API:** http://localhost:5000
- **MySQL:** localhost:3306

## Các lệnh Docker hữu ích

```bash
# Xem logs
docker-compose logs -f

# Xem logs của service cụ thể
docker-compose logs -f backend

# Dừng tất cả services
docker-compose down

# Dừng và xóa volumes (xóa cả database)
docker-compose down -v

# Rebuild một service cụ thể
docker-compose up --build backend

# Vào container MySQL
docker exec -it webpkbep-mysql mysql -u root -p
```

## Cấu trúc Services

| Service | Port | Mô tả |
|---------|------|-------|
| mysql | 3306 | MySQL Database |
| backend | 5000 | Node.js API Server |
| client | 3000 | React Client App |
| admin | 3001 | React Admin Panel |

## Lưu ý

1. **Lần đầu chạy:** MySQL cần thời gian để khởi tạo database từ file `init.sql`
2. **Images:** Thư mục `client/public/Images` được mount vào container backend
3. **Database:** Dữ liệu MySQL được lưu trong Docker volume `mysql_data`

## Troubleshooting

### Lỗi kết nối database
```bash
# Kiểm tra MySQL đã sẵn sàng chưa
docker-compose logs mysql

# Restart backend sau khi MySQL ready
docker-compose restart backend
```

### Lỗi port đã được sử dụng
Đổi port trong file `docker-compose.yml`, ví dụ:
```yaml
ports:
  - "3002:3000"  # Đổi từ 3000 sang 3002
```
