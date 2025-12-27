const express = require('express');
const router = express.Router();
const emailService = require('../services/emailService');

// Kiểm tra kết nối SMTP
router.get('/api/email/verify', async (req, res) => {
    const result = await emailService.verifyConnection();
    if (result) {
        res.json({ success: true, message: 'Kết nối SMTP thành công!' });
    } else {
        res.status(500).json({ success: false, message: 'Không thể kết nối SMTP. Vui lòng kiểm tra cấu hình.' });
    }
});

// Gửi email test
router.post('/api/email/test', async (req, res) => {
    const { to, subject, content } = req.body;
    
    if (!to || !subject) {
        return res.status(400).json({ success: false, message: 'Thiếu thông tin email (to, subject)' });
    }
    
    const htmlContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>📧 Email Test</h2>
            <p>${content || 'Đây là email test từ hệ thống.'}</p>
            <hr>
            <p style="color: #666; font-size: 12px;">Gửi từ hệ thống Phụ Kiện Bếp Shop</p>
        </div>
    `;
    
    const result = await emailService.sendCustomEmail(to, subject, htmlContent);
    
    if (result.success) {
        res.json({ success: true, message: 'Email đã được gửi thành công!', messageId: result.messageId });
    } else {
        res.status(500).json({ success: false, message: 'Gửi email thất bại', error: result.error });
    }
});

// Gửi lại email xác nhận đơn hàng
router.post('/api/email/resend-confirmation/:ma_don_hang', async (req, res) => {
    const { ma_don_hang } = req.params;
    const { email } = req.body;
    
    if (!email) {
        return res.status(400).json({ success: false, message: 'Thiếu email người nhận' });
    }
    
    const db = require('../config/config');
    
    // Lấy thông tin đơn hàng
    const sqlOrder = `
        SELECT dh.*, kh.email as customer_email
        FROM don_hang dh 
        LEFT JOIN khach_hang kh ON dh.ma_khach_hang = kh.ma_khach_hang 
        WHERE dh.ma_don_hang = ?
    `;
    
    db.query(sqlOrder, [ma_don_hang], async (err, orderResult) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Lỗi truy vấn database', error: err.message });
        }
        
        if (!orderResult || orderResult.length === 0) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
        }
        
        const order = orderResult[0];
        
        // Lấy chi tiết đơn hàng
        const sqlDetails = "SELECT * FROM chi_tiet_don_hang WHERE ma_don_hang = ?";
        db.query(sqlDetails, [ma_don_hang], async (err, detailsResult) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Lỗi truy vấn chi tiết đơn hàng' });
            }
            
            const emailData = {
                ma_don_hang: order.ma_don_hang,
                ten_khach: order.ten_khach,
                email: email,
                sdt: order.sdt,
                dia_chi: order.dia_chi,
                ngay_dat_hang: order.ngay_dat_hang,
                tong_tien: order.tong_tien,
                loai_thanh_toan: order.loai_thanh_toan,
                ghi_chu: order.ghi_chu,
                chi_tiet_don_hang: detailsResult
            };
            
            const result = await emailService.sendOrderConfirmation(emailData, email);
            
            if (result.success) {
                res.json({ success: true, message: 'Email xác nhận đã được gửi lại!' });
            } else {
                res.status(500).json({ success: false, message: 'Gửi email thất bại', error: result.error });
            }
        });
    });
});

module.exports = router;
