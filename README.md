# YouTube Transcript API

Một API đơn giản để lấy transcript/phụ đề từ video YouTube sử dụng Node.js và Express.

## 🚀 Tính năng

- Lấy transcript qua video ID (GET method)
- Lấy transcript qua video URL (POST method)
- Hỗ trợ CORS
- Error handling đầy đủ
- Deploy dễ dàng trên Vercel

## 📦 Cài đặt

```bash
# Clone repository
git clone <your-repo-url>
cd youtube-transcript-api

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Hoặc chạy production
npm start
```

## 🔧 API Endpoints

### 1. GET `/api/transcript/:videoId`

Lấy transcript bằng video ID

**Example:**
```bash
curl https://your-app.vercel.app/api/transcript/dQw4w9WgXcQ
```

### 2. POST `/api/transcript`

Lấy transcript bằng video URL

**Request Body:**
```json
{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}
```

**Example:**
```bash
curl -X POST https://your-app.vercel.app/api/transcript \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'
```

### 3. GET `/`

Thông tin API và hướng dẫn sử dụng

## 📋 Response Format

### Success Response:
```json
{
  "success": true,
  "videoId": "dQw4w9WgXcQ",
  "transcript": [
    {
      "text": "Never gonna give you up",
      "duration": 1840,
      "offset": 0
    }
  ],
  "totalSegments": 1
}
```

### Error Response:
```json
{
  "error": "No transcript found for this video"
}
```

## 🚀 Deploy lên Vercel

### Bước 1: Chuẩn bị code
```bash
# Tạo repository trên GitHub và push code
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### Bước 2: Deploy
1. Truy cập [vercel.com](https://vercel.com)
2. Đăng nhập và kết nối GitHub account
3. Import repository này
4. Vercel sẽ tự động detect và deploy

### Bước 3: Test API
```bash
# Test GET method
curl https://your-app.vercel.app/api/transcript/dQw4w9WgXcQ

# Test POST method
curl -X POST https://your-app.vercel.app/api/transcript \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'
```

## 🛠️ Technologies

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **youtube-transcript** - Library để lấy transcript
- **CORS** - Cross-origin resource sharing
- **ES Modules** - Import/export syntax

## ⚠️ Lưu ý

- Chỉ hoạt động với video có transcript/phụ đề
- Một số video có thể disable transcript
- Rate limit có thể áp dụng tùy theo usage

## 🤝 Sử dụng

Sau khi deploy thành công, bạn có thể gọi API từ frontend:

```javascript
// GET method
const response = await fetch('https://your-app.vercel.app/api/transcript/VIDEO_ID');
const data = await response.json();

// POST method
const response = await fetch('https://your-app.vercel.app/api/transcript', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    url: 'https://www.youtube.com/watch?v=VIDEO_ID'
  })
});
const data = await response.json();
```