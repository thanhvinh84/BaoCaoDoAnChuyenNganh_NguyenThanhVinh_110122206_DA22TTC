const express = require('express');
const router = express.Router();
const accountController = require('../controllers/taikhoanController');

// Tạo mới tài khoản
router.post('/api/createaccount', accountController.createAccount);

// Đăng nhập tài khoản
router.post('/api/login', accountController.loginAccount);

// Đăng nhập bằng Google
router.post('/api/google-login', accountController.googleLogin);

router.get('/api/getalltaikhoan', accountController.getAllAccount);

// Toggle trạng thái tài khoản (khóa/mở khóa)
router.put('/api/toggletaikhoan/:id', accountController.toggleStatus);

module.exports = router;
