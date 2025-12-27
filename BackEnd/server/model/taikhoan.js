const db = require('../config/config.js')
const bcrypt = require('bcrypt');
const saltRounds = 10;

const Account = {
    // Phương thức tạo tài khoản (đã có)
    create: (accountData, callback) => {
        const { ten_nguoi_dung, mat_khau, email, anh_nguoi_dung, sdt } = accountData;
        bcrypt.hash(mat_khau, saltRounds, (err, hashedPassword) => {
            if (err) {
                return callback(err);
            }

            const sqlInsert = `
                INSERT INTO tai_khoan (
                    ten_nguoi_dung, mat_khau, email, anh_nguoi_dung, sdt
                ) VALUES (?, ?, ?, ?, ?)
            `;
            db.query(sqlInsert, [ten_nguoi_dung, hashedPassword, email, anh_nguoi_dung, sdt], (error, result) => {
                if (error) {
                    return callback(error);
                }
                callback(null, result);
            });
        });
    },
    login: (email, mat_khau, callback) => {
        console.log("Email nhận từ client:", email);
    
        const sqlSelect = `SELECT * FROM tai_khoan WHERE email = ?`;
        db.query(sqlSelect, [email], (error, results) => {
            if (error) {
                console.log("Lỗi khi query:", error);
                return callback(error);
            }
    
            if (results.length === 0) {
                console.log("Tài khoản không tồn tại.");
                return callback(null, { message: "Tài khoản không tồn tại." });
            }
    
            const user = results[0];
            console.log("Tài khoản tìm thấy:", user);
    
            // Kiểm tra tài khoản có bị khóa không
            if (user.trang_thai === 0) {
                console.log("Tài khoản đã bị khóa.");
                return callback(null, { message: "Tài khoản của bạn đã bị khóa do vi phạm chính sách. Vui lòng liên hệ admin." });
            }

            bcrypt.compare(mat_khau, user.mat_khau, (err, isMatch) => {
                if (err) {
                    console.log("Lỗi khi so sánh mật khẩu:", err);
                    return callback(err);
                }
                if (!isMatch) {
                    console.log("Mật khẩu không khớp.");
                    return callback(null, { message: "Mật khẩu không chính xác." });
                }
    
                console.log("Đăng nhập thành công");
                // Nếu mật khẩu đúng, trả về thông tin tài khoản
                callback(null, { message: "Đăng nhập thành công.", user });
            });
        });
    },
    getAll: (callback) => {
        const sqlGet = "SELECT * FROM tai_khoan";
        db.query(sqlGet, (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },

    // Toggle trạng thái tài khoản (khóa/mở khóa)
    toggleStatus: (id, trang_thai, callback) => {
        const sql = `UPDATE tai_khoan SET trang_thai = ? WHERE id_tai_khoan = ?`;
        db.query(sql, [trang_thai, id], (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },

    // Đăng nhập bằng Google
    googleLogin: (googleData, callback) => {
        const { email, ten_nguoi_dung, google_id, avatar } = googleData;
        
        // Kiểm tra xem email đã tồn tại chưa
        const sqlSelect = `SELECT * FROM tai_khoan WHERE email = ?`;
        db.query(sqlSelect, [email], (error, results) => {
            if (error) {
                return callback(error);
            }

            if (results.length > 0) {
                // Nếu tài khoản đã tồn tại
                const user = results[0];
                
                // Kiểm tra tài khoản có bị khóa không
                if (user.trang_thai === 0) {
                    return callback(null, { message: "Tài khoản của bạn đã bị khóa do vi phạm chính sách. Vui lòng liên hệ admin." });
                }
                
                return callback(null, { message: "Đăng nhập thành công.", user });
            }

            // Nếu chưa có tài khoản, tạo mới với mật khẩu random (user đăng nhập bằng Google không cần mật khẩu)
            const randomPassword = google_id + '_google_auth';
            bcrypt.hash(randomPassword, saltRounds, (err, hashedPassword) => {
                if (err) {
                    return callback(err);
                }

                const sqlInsert = `
                    INSERT INTO tai_khoan (ten_nguoi_dung, mat_khau, email, anh_nguoi_dung, google_id)
                    VALUES (?, ?, ?, ?, ?)
                `;
                db.query(sqlInsert, [ten_nguoi_dung, hashedPassword, email, avatar, google_id], (insertError, insertResult) => {
                    if (insertError) {
                        return callback(insertError);
                    }

                    // Lấy thông tin user vừa tạo
                    db.query(sqlSelect, [email], (selectError, newUser) => {
                        if (selectError) {
                            return callback(selectError);
                        }
                        callback(null, { message: "Tạo tài khoản và đăng nhập thành công.", user: newUser[0] });
                    });
                });
            });
        });
    },
    
};

module.exports = Account;

