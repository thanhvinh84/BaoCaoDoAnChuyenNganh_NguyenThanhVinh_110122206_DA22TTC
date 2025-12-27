const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();

// Middleware phải đặt trước các routes
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Đường dẫn thư mục lưu ảnh
const uploadDir = path.join(__dirname, '../../client/public/Images');

// Serve static files (ảnh) từ thư mục client/public/Images
app.use('/Images', express.static(uploadDir));

// Tạo thư mục nếu chưa tồn tại
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình multer để upload ảnh
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Giữ nguyên tên file gốc
        cb(null, file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        // Chỉ cho phép upload ảnh
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Chỉ được upload file ảnh!'), false);
        }
    }
});

// API upload ảnh
app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Không có file được upload' });
    }
    console.log('Upload thành công:', req.file.originalname);
    res.json({ 
        success: true,
        imagePath: `/Images/${req.file.originalname}` 
    });
});

// Export router
const sanphamRoutes = require('../server/routes/sanphamRoute');
const danhmucRoutes = require('./routes/danhmucRoute');
const nhanvienRoutes = require('./routes/nhanvienRoute');
const khachhangRoutes = require('./routes/khachhangRoute');
const khohangRoutes = require('./routes/khohangRoute');
const donhangRoutes = require('./routes/hoadonRoute');
const hdnRoutes = require('./routes/hoadonnhapRoute');
const ctdhRoutes = require('./routes/ctdhRoutes');
const taikhoanRoutes = require('./routes/taikhoanRoute');
const dathangRoutes = require('./routes/dathangRoute');
const vnpayRoutes = require('./routes/vnpayRoute');
const voucherRoutes = require('./routes/voucherRoute');
const feedbackRoutes = require('./routes/feedbackRoute');
const emailRoutes = require('./routes/emailRoute');

// Sử dụng route
app.use(sanphamRoutes);
app.use(danhmucRoutes);
app.use(nhanvienRoutes);
app.use(khachhangRoutes);
app.use(khohangRoutes);
app.use(donhangRoutes);
app.use(hdnRoutes);
app.use(ctdhRoutes);
app.use(taikhoanRoutes);
app.use(dathangRoutes);
app.use(vnpayRoutes);
app.use(voucherRoutes);
app.use(feedbackRoutes);
app.use(emailRoutes);

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
