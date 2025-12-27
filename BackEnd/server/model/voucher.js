const db = require('../config/config.js');

const Voucher = {
    // Lấy tất cả voucher
    getAll: (callback) => {
        const sql = "SELECT * FROM voucher ORDER BY ma_voucher DESC";
        db.query(sql, (error, result) => {
            if (error) return callback(error);
            callback(null, result);
        });
    },

    // Lấy voucher theo ID
    getById: (id, callback) => {
        const sql = "SELECT * FROM voucher WHERE ma_voucher = ?";
        db.query(sql, [id], (error, result) => {
            if (error) return callback(error);
            callback(null, result[0]);
        });
    },

    // Tạo voucher mới
    create: (voucherData, callback) => {
        const { coupon_name, discount_amount, value, remaining_count, description, expiry_date, min_order_value, product_keyword } = voucherData;
        const sql = `INSERT INTO voucher (coupon_name, discount_amount, value, remaining_count, description, expiry_date, min_order_value, product_keyword) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        db.query(sql, [coupon_name, discount_amount, value, remaining_count, description, expiry_date, min_order_value, product_keyword], (error, result) => {
            if (error) return callback(error);
            callback(null, result);
        });
    },

    // Cập nhật voucher
    update: (id, voucherData, callback) => {
        const { coupon_name, discount_amount, value, remaining_count, description, expiry_date, min_order_value, product_keyword } = voucherData;
        const sql = `UPDATE voucher SET coupon_name = ?, discount_amount = ?, value = ?, remaining_count = ?, description = ?, expiry_date = ?, min_order_value = ?, product_keyword = ? 
                     WHERE ma_voucher = ?`;
        db.query(sql, [coupon_name, discount_amount, value, remaining_count, description, expiry_date, min_order_value, product_keyword, id], (error, result) => {
            if (error) return callback(error);
            callback(null, result);
        });
    },

    // Xóa voucher
    delete: (id, callback) => {
        const sql = "DELETE FROM voucher WHERE ma_voucher = ?";
        db.query(sql, [id], (error, result) => {
            if (error) return callback(error);
            callback(null, result);
        });
    },

    // Lấy voucher còn hiệu lực
    getActive: (callback) => {
        const sql = "SELECT * FROM voucher WHERE expiry_date >= CURDATE() AND remaining_count > 0 ORDER BY ma_voucher DESC";
        db.query(sql, (error, result) => {
            if (error) return callback(error);
            callback(null, result);
        });
    }
};

module.exports = Voucher;
