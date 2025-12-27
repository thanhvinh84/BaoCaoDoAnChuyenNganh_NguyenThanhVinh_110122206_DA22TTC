const db = require('../config/config.js');

const Feedback = {
    // Tạo feedback mới
    create: (data, callback) => {
        const sql = `INSERT INTO feedback (ten_khach, email, noi_dung, ngay_gui, da_doc) VALUES (?, ?, ?, NOW(), 0)`;
        db.query(sql, [data.ten_khach, data.email, data.noi_dung], callback);
    },

    // Lấy tất cả feedback
    getAll: (callback) => {
        const sql = `SELECT * FROM feedback ORDER BY ngay_gui DESC`;
        db.query(sql, callback);
    },

    // Lấy feedback chưa đọc
    getUnread: (callback) => {
        const sql = `SELECT * FROM feedback WHERE da_doc = 0 ORDER BY ngay_gui DESC`;
        db.query(sql, callback);
    },

    // Đếm số feedback chưa đọc
    countUnread: (callback) => {
        const sql = `SELECT COUNT(*) as count FROM feedback WHERE da_doc = 0`;
        db.query(sql, callback);
    },

    // Đánh dấu đã đọc
    markAsRead: (id, callback) => {
        const sql = `UPDATE feedback SET da_doc = 1 WHERE id = ?`;
        db.query(sql, [id], callback);
    },

    // Đánh dấu tất cả đã đọc
    markAllAsRead: (callback) => {
        const sql = `UPDATE feedback SET da_doc = 1`;
        db.query(sql, callback);
    },

    // Xóa feedback
    delete: (id, callback) => {
        const sql = `DELETE FROM feedback WHERE id = ?`;
        db.query(sql, [id], callback);
    }
};

module.exports = Feedback;
