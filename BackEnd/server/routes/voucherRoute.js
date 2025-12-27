const express = require('express');
const router = express.Router();
const voucherController = require('../controllers/voucherController');

// Lấy tất cả voucher
router.get('/api/vouchers', voucherController.getAllVoucher);

// Lấy voucher còn hiệu lực (cho client)
router.get('/api/vouchers/active', voucherController.getActiveVoucher);

// Lấy voucher theo ID
router.get('/api/voucher/:id', voucherController.getVoucherById);

// Tạo voucher mới
router.post('/api/voucher', voucherController.createVoucher);

// Cập nhật voucher
router.put('/api/voucher/:id', voucherController.updateVoucher);

// Xóa voucher
router.delete('/api/voucher/:id', voucherController.deleteVoucher);

module.exports = router;
