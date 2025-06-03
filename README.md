# KidStudy Server API

KidStudy Server là phần backend của ứng dụng học tiếng Anh cho trẻ em, được xây dựng với Express.js, PostgreSQL và Drizzle ORM.

## 🚀 Tính Năng Chính

- **RESTful API**: Cung cấp các endpoint cho việc quản lý bài học, thử thách và tiến độ học tập
- **Xác thực & Phân quyền**: Hệ thống bảo mật cho người dùng với Clerk
- **Quản lý dữ liệu**: CRUD operations cho units, lessons, challenges ...
- **Theo dõi tiến độ**: Hệ thống lưu trữ và cập nhật tiến độ học tập
- **Tương tác**: Hỗ trợ hệ thống chat và tương tác
- **Tối ưu hiệu suất**: Caching và rate limiting
- **Bảo mật**: Input validation và security headers

## 🛠️ Công Nghệ Sử Dụng

- **Backend Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Authentication**: Clerk
- **API Documentation**: Swagger/OpenAPI
- **Validation**: Zod
- **Testing**: Jest
- **Logging**: Winston
- **File Storage**: Cloudinary
- **Text-to-Speech**: ElevenLabs

## 📁 Cấu Trúc Dự Án

```
src/
├── config/         # Cấu hình ứng dụng
├── controllers/    # Xử lý logic API
├── middlewares/    # Middleware Express
├── models/         # Schema database
├── repositories/   # Tầng truy cập dữ liệu
├── routes/         # Định nghĩa routes
├── services/       # Business logic
└── utils/          # Tiện ích
```

## 🚀 Cài Đặt và Chạy Dự Án

### Yêu cầu hệ thống

- Node.js >= 18.x
- PostgreSQL >= 14.x
- npm >= 8.x

### Cài đặt

1. **Clone repository**
   git clone https://github.com/Tanh1603/kidstudy-server.git

2. **Cài đặt PostgreSQL**

   - Tạo database `kidstudy`
   - Chạy file schema trong `database/schema.sql`
   - Cấu trúc database ![ERD_WebKidStudy](https://github.com/user-attachments/assets/301450c7-3add-43bf-b29a-0ecad3b76ea6)

3. **Cài đặt dependencies**

   npm install

4. **Cấu hình môi trường**
   Các biến môi trường cần thiết:

   PORT=8080
   DATABASE_URL=...
   CLERK_PUBLISHABLE_KEY=...
   CLERK_SECRET_KEY=sk_test_5bi33nGFc0BOKWT8XD3MN4iYJHwbchPlTtV0XPUVIV
   ELEVENLABS_API_KEY=sk_15a6f8b03b54e6264e5309cb6f38d14957439229be8d0efd
   ELEVENLABS_VOICE_ID=TmNxSYapUjI5AdYSUASB
   CLOUDINARY_CLOUD_NAME=..
   CLOUDINARY_API_KEY=...
   CLOUDINARY_API_SECRET=...
   CLOUDINARY_FOLDER_NAME=..
   CLOUDINARY_URL=...

5. **Chạy server**

   # Development mode

   npm run dev

   # Production mode

   npm start

## 📡 API Endpoints

### Topics (Chủ đề)

- `GET /api/topics` - Lấy tất cả chủ đề
- `POST /api/topics` - Tạo chủ đề mới (yêu cầu icon)
- `PATCH /api/topics/:id/title` - Cập nhật tiêu đề chủ đề
- `PATCH /api/topics/:id/icon` - Cập nhật icon chủ đề
- `DELETE /api/topics/:id` - Xóa chủ đề

### Mini Games (Trò chơi nhỏ)

- `GET /minigames` - Lấy câu hỏi trò chơi ngẫu nhiên
  - Query params:
    - `gameType`: Loại trò chơi
    - `difficulty`: Độ khó
    - `topicId`: ID chủ đề
    - `limit`: Số lượng câu hỏi (mặc định: 20)
- `GET /admin/minigames` - Lấy tất cả câu hỏi trò chơi (Admin)
  - Query params:
    - `gameType`: Loại trò chơi
- `POST /admin/minigames` - Tạo câu hỏi trò chơi mới (Admin)
- `PUT /admin/minigames/:id` - Cập nhật câu hỏi trò chơi (Admin)
- `DELETE /admin/minigames/:id` - Xóa câu hỏi trò chơi (Admin)

### Quests (Nhiệm vụ)

#### Admin Endpoints

- `GET /admin/quests` - Lấy tất cả nhiệm vụ
- `POST /admin/quests` - Tạo nhiệm vụ mới
- `PUT /admin/quests/:id` - Cập nhật nhiệm vụ
- `DELETE /admin/quests/:id` - Xóa nhiệm vụ

#### User Endpoints

- `GET /quests` - Lấy nhiệm vụ của người dùng
  - Query params:
    - `userId`: ID người dùng
- `PUT /quests/daily-points` - Cập nhật điểm nhiệm vụ hàng ngày
  - Body:
    - `userId`: ID người dùng
    - `points`: Số điểm
- `POST /quests/reset` - Tạo lại nhiệm vụ hàng ngày cho người dùng
  - Body:
    - `userId`: ID người dùng

### Units (Đơn vị học)

#### Admin Endpoints

- `GET /admin/units` - Lấy tất cả units
- `GET /admin/units/:id` - Lấy unit theo ID
- `POST /admin/units` - Tạo unit mới
- `PUT /admin/units/:id` - Cập nhật unit
- `DELETE /admin/units/:id` - Xóa unit
- `GET /admin/units/:id/is-completed` - Kiểm tra unit đã hoàn thành chưa

#### User Endpoints

- `GET /units` - Lấy tất cả units cho người dùng

### Lessons (Bài học)

#### Admin Endpoints

- `GET /admin/lessons` - Lấy tất cả lessons
- `GET /admin/lessons/:id` - Lấy lesson theo ID
- `POST /admin/lessons` - Tạo lesson mới
- `PUT /admin/lessons/:id` - Cập nhật lesson
- `DELETE /admin/lessons/:id` - Xóa lesson
- `GET /admin/lessons/:id/is-completed` - Kiểm tra lesson đã hoàn thành chưa

#### User Endpoints

- `GET /lessons/first-incomplete` - Lấy lesson chưa hoàn thành đầu tiên
- `GET /lessons/:id/is-completed` - Kiểm tra lesson đã hoàn thành chưa
- `GET /lessons/:id/percentage` - Lấy phần trăm hoàn thành của lesson
- `GET /lessons/:id` - Lấy thông tin lesson cho người dùng

### Challenges (Thử thách)

#### Admin Endpoints

- `GET /admin/challenges` - Lấy tất cả challenges
- `GET /admin/challenges/:id` - Lấy challenge theo ID
- `POST /admin/challenges` - Tạo challenge mới
- `PUT /admin/challenges/:id` - Cập nhật challenge
- `DELETE /admin/challenges/:id` - Xóa challenge

#### Challenge Options Endpoints

- `GET /admin/challenge-options` - Lấy options của challenge
- `POST /admin/challenge-options` - Thêm option mới cho challenge
- `PUT /admin/challenge-options/:id` - Cập nhật option
- `DELETE /admin/challenge-options/:id` - Xóa option

#### User Challenge Progress Endpoints

- `PUT /challenges/:id/progress/upsert` - Tạo/cập nhật tiến độ challenge
- `PUT /challenges/:id/progress` - Cập nhật tiến độ challenge

### User Progress (Tiến độ học)

- `GET /user-progress/:userId` - Lấy profile người dùng
- `GET /user-progress/:userId/challenges` - Lấy tiến độ challenges
- `POST /user-progress` - Tạo/Cập nhật profile
- `PUT /user-progress/:userId/challenge/:challengeId` - Cập nhật tiến độ challenge
- `PUT /user-progress/:userId/hearts` - Cập nhật hearts
- `PUT /user-progress/:userId/points` - Cập nhật points
- `PUT /user-progress/:userId/active-unit` - Cập nhật unit đang học

## 🔒 Bảo Mật

- Clerk
- Input Validation với Zod
- CORS Configuration
- Security Headers (Helmet)
- SQL Injection Prevention
- XSS Protection

## 🧪 Testing

```bash
# Chạy tests
npm test

# Chạy tests với coverage
npm run test:coverage

# Chạy tests trong watch mode
npm run test:watch
```

## 📦 Deployment
- Vercel
