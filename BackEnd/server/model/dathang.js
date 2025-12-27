const db = require('../config/config');
const emailService = require('../services/emailService');

const Order = {
    addOrder: (orderData, callback) => {
        const { ma_khach_hang, ngay_dat_hang, tong_tien, trang_thai, ten_khach, dia_chi, ghi_chu, sdt, loai_thanh_toan, trang_thai_thanh_toan, chi_tiet_don_hang, email } = orderData;
        const insertOrderQuery = `
            INSERT INTO don_hang (ma_khach_hang, ngay_dat_hang, tong_tien, trang_thai, ten_khach, dia_chi, ghi_chu, sdt,loai_thanh_toan,trang_thai_thanh_toan)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?,?,?)
        `;

        db.getConnection((err, connection) => {
            if (err) {
                return callback(err);
            }

            connection.beginTransaction((err) => {
                if (err) {
                    connection.release();
                    return callback(err);
                }

                connection.query(
                    insertOrderQuery,
                    [ma_khach_hang, ngay_dat_hang, tong_tien, trang_thai, ten_khach, dia_chi, ghi_chu, sdt, loai_thanh_toan, trang_thai_thanh_toan],
                    (err, result) => {
                        if (err) {
                            return connection.rollback(() => {
                                connection.release();
                                callback(err);
                            });
                        }

                        const ma_don_hang = result.insertId;
                        const insertOrderDetailsQuery = `
                            INSERT INTO chi_tiet_don_hang (ma_don_hang, ma_san_pham, ten_san_pham, so_luong, gia, anh_sanpham)
                            VALUES ?
                        `;
                        
                        console.log(chi_tiet_don_hang)
                        const orderDetailsValues = chi_tiet_don_hang?.map((item) => [
                            ma_don_hang,
                            item.ma_san_pham,
                            item.ten_san_pham,
                            item.so_luong,
                            item.gia,
                            item.anh_sanpham
                        ]);

                        connection.query(insertOrderDetailsQuery, [orderDetailsValues], (err) => {
                            if (err) {
                                return connection.rollback(() => {
                                    connection.release();
                                    callback(err);
                                });
                            }

                            connection.commit(async (err) => {
                                if (err) {
                                    return connection.rollback(() => {
                                        connection.release();
                                        callback(err);
                                    });
                                }

                                connection.release();

                                // Gửi email xác nhận đơn hàng nếu có email
                                if (email) {
                                    const emailData = {
                                        ma_don_hang,
                                        ten_khach,
                                        email,
                                        sdt,
                                        dia_chi,
                                        ngay_dat_hang,
                                        tong_tien,
                                        loai_thanh_toan,
                                        ghi_chu,
                                        chi_tiet_don_hang
                                    };
                                    
                                    // Gửi email bất đồng bộ (không chờ kết quả)
                                    emailService.sendOrderConfirmation(emailData, email)
                                        .then(result => {
                                            if (result.success) {
                                                console.log(`📧 Email xác nhận đã gửi cho đơn hàng #${ma_don_hang}`);
                                            }
                                        })
                                        .catch(err => console.error('Lỗi gửi email:', err));
                                }

                                callback(null, { message: "Thêm đơn hàng thành công", ma_don_hang });
                            });
                        });
                    }
                );
            });
        });
    },

    // Lấy thông tin đơn hàng kèm email khách hàng
    getOrderWithCustomerEmail: (ma_don_hang, callback) => {
        const sql = `
            SELECT dh.*, kh.email 
            FROM don_hang dh 
            LEFT JOIN khach_hang kh ON dh.ma_khach_hang = kh.ma_khach_hang 
            WHERE dh.ma_don_hang = ?
        `;
        db.query(sql, [ma_don_hang], (error, result) => {
            if (error) return callback(error);
            callback(null, result[0]);
        });
    }
};

module.exports = Order;
