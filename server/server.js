const express = require('express');
const path = require('path');
const app = express();
const sellerRoutes = require('./routes/sellerRoutes'); // Phải gọi file route của bạn vào đây
const db = require('./config/db');

// Middleware cực kỳ quan trọng để nhận dữ liệu từ form Thêm món
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// 1. Phục vụ file tĩnh (CSS, JS)
app.use(express.static(path.join(__dirname, '../client')));

// 2. CHỖ THIẾU NÀY: Kích hoạt API
// Bây giờ các đường dẫn trong sellerRoutes sẽ bắt đầu bằng /FoodO/seller
app.use('/FoodO/seller', sellerRoutes); 

// 3. Route cho giao diện (SPA)
app.get('/FoodO/seller/:id', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/views/index.html'));
});

// Trang chủ
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/views/index.html'));
});

app.listen(3000, () => console.log("Server running at http://localhost:3000"));