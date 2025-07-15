# 🛠 Hướng Dẫn Cài Đặt Backend (FastAPI + PostgreSQL)

---
```bash
cd backend
```
---

## 1. 📦 Tạo và kích hoạt Virtual Environment (venv)

```bash
# Tạo venv tên .venv
python -m venv .venv

# Kích hoạt venv (Windows)
.venv\Scripts\activate

# Hoặc nếu bạn dùng Linux/macOS
source .venv/bin/activate
```

---
## 2. ⬇️ Cài đặt các package cần thiết

```bash
pip install -r requirements.txt
```
---

## 3. ⚙️ Tạo file `.env` từ `.env.example`

```bash
cp .env.example .env      # Trên Linux/macOS

# hoặc nếu bạn dùng Windows
copy .env.example .env
```

> ✅ Đảm bảo đã cập nhật thông tin kết nối `DATABASE_URL` trong file `.env`

---

## 4. ⚙️ Cấu hình Alembic + Migrate database

### a. Tạo file migration (Nếu chưa có file migration)

```bash
alembic revision --autogenerate -m "Initial DB"
```

### b. Thực hiện migration

```bash
alembic upgrade head
```

---

## 5. 🚀 Chạy ứng dụng FastAPI

```bash
uvicorn main:app --reload
```

---

## 📁 Cấu trúc thư mục backend

```
backend/
├── alembic/               # Alembic migrations
│   ├── versions/
│   └── env.py
│
├── apis/                  # Các route / endpoint FastAPI
├── cruds/                 # Hàm thao tác cơ sở dữ liệu
├── dependencies/          # Các hàm phụ thuộc dùng cho FastAPI (Depends)
├── entities/              # Các model SQLAlchemy
├── enums/                 # Các Enum dùng trong DB
├── schemas/               # Pydantic schema (DTO)
├── utils/                 # Các tiện ích (hash, token, ...)
│
├── .env                   # Biến môi trường thực tế
├── .env.example           # Biến môi trường mẫu
├── alembic.ini            # Cấu hình alembic
├── config.py              # Cấu hình chung cho app
├── database.py            # Khởi tạo session, kết nối DB
├── exceptions.py          # Định nghĩa lỗi tùy chỉnh
├── main.py                # Điểm bắt đầu chạy FastAPI
├── requirements.txt       # Danh sách thư viện cần cài
└── README.md              # Hướng dẫn

```