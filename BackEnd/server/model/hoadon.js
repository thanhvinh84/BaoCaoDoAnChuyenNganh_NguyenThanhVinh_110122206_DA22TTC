const db = require('../config/config');
const emailService = require('../services/emailService');

const Bill = {

    getAll: (callback) => {
        const sqlGet = "SELECT * FROM don_hang";
        db.query(sqlGet, (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },

    getById: (ma_don_hang, callback) => {
        const sqlGet = "SELECT * FROM don_hang WHERE ma_don_hang = ?";
        db.query(sqlGet, [ma_don_hang], (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },

    update: (ma_don_hang, billData, callback) => {
        const { trang_thai, ma_nhan_vien, loai_thanh_toan, trang_thai_thanh_toan } = billData;

        // Lấy trạng thái cũ trước khi cập nhật
        const sqlGetOld = "SELECT trang_thai, trang_thai_thanh_toan, loai_thanh_toan FROM don_hang WHERE ma_don_hang = ?";
        db.query(sqlGetOld, [ma_don_hang], (err, oldData) => {
            if (err) return callback(err);
            
            const oldTrangThai = oldData[0]?.trang_thai;
            const newTrangThai = parseInt(trang_thai);
            
            // Tự động cập nhật trạng thái thanh toán = 2 khi giao hàng thành công
            let finalTrangThaiThanhToan = trang_thai_thanh_toan;
            let finalLoaiThanhToan = loai_thanh_toan;
            
            if (newTrangThai === 4) {
                finalTrangThaiThanhToan = 2; // Đã thanh toán
                // Nếu chưa có loại thanh toán, mặc định là tiền mặt (COD)
                if (!finalLoaiThanhToan || finalLoaiThanhToan === 'BuyLate') {
                    finalLoaiThanhToan = 'BuyLate'; // Tiền mặt khi nhận hàng
                }
            }

            const sqlUpdate = "UPDATE don_hang SET trang_thai = ?, ma_nhan_vien = ?, loai_thanh_toan = ?, trang_thai_thanh_toan = ? WHERE ma_don_hang = ?";
            db.query(sqlUpdate, [trang_thai, ma_nhan_vien, finalLoaiThanhToan, finalTrangThaiThanhToan, ma_don_hang], (error, result) => {
                if (error) {
                    return callback(error);
                }

                // Gửi email thông báo khi trạng thái thay đổi
                if (oldTrangThai !== newTrangThai) {
                    // Lấy thông tin đơn hàng và email từ tài khoản (vì user đăng nhập bằng tai_khoan)
                    const sqlGetOrderInfo = `
                        SELECT dh.*, tk.email 
                        FROM don_hang dh 
                        LEFT JOIN tai_khoan tk ON dh.ma_khach_hang = tk.id_tai_khoan 
                        WHERE dh.ma_don_hang = ?
                    `;
                    db.query(sqlGetOrderInfo, [ma_don_hang], (emailErr, orderInfo) => {
                        if (emailErr) {
                            console.error('Lỗi lấy thông tin đơn hàng:', emailErr);
                            return;
                        }
                        
                        const email = orderInfo[0]?.email;
                        console.log(`📧 Đang gửi email đến: ${email} cho đơn hàng #${ma_don_hang}`);
                        
                        if (email) {
                            const emailData = {
                                ma_don_hang,
                                ten_khach: orderInfo[0].ten_khach,
                                trang_thai: newTrangThai,
                                dia_chi: orderInfo[0].dia_chi,
                                sdt: orderInfo[0].sdt
                            };
                            
                            // Gửi email bất đồng bộ
                            emailService.sendOrderStatusUpdate(emailData, email)
                                .then(res => {
                                    if (res.success) {
                                        console.log(`✅ Email cập nhật trạng thái đã gửi cho đơn hàng #${ma_don_hang}`);
                                    } else {
                                        console.error(`❌ Gửi email thất bại: ${res.error}`);
                                    }
                                })
                                .catch(e => console.error('❌ Lỗi gửi email:', e));
                        } else {
                            console.log(`⚠️ Không tìm thấy email cho đơn hàng #${ma_don_hang}`);
                        }
                    });
                }

                // Chỉ trừ số lượng khi chuyển từ trạng thái khác sang 4 (đã giao thành công)
                // Tránh trừ nhiều lần nếu đã là trạng thái 4 rồi
                if (newTrangThai === 4 && oldTrangThai !== 4) {
                    const sqlGetDetails = "SELECT ma_san_pham, so_luong FROM chi_tiet_don_hang WHERE ma_don_hang = ?";
                    db.query(sqlGetDetails, [ma_don_hang], (error, details) => {
                        if (error) {
                            return callback(error);
                        }

                        // Duyệt từng sản phẩm trong đơn hàng và trừ số lượng
                        let queries = details.map(item => {
                            return new Promise((resolve, reject) => {
                                const sqlUpdateStock = `
                                    UPDATE san_pham 
                                    SET soluong = GREATEST(0, soluong - ?) 
                                    WHERE ma_san_pham = ?
                                `;
                                db.query(sqlUpdateStock, [item.so_luong, item.ma_san_pham], (err, res) => {
                                    if (err) reject(err);
                                    else resolve(res);
                                });
                            });
                        });

                        // Thực hiện tất cả truy vấn
                        Promise.all(queries)
                            .then(() => {
                                console.log(`Đã trừ số lượng tồn kho cho đơn hàng #${ma_don_hang}`);
                                callback(null, result);
                            })
                            .catch(err => {
                                callback(err);
                            });
                    });
                } 
                // Nếu chuyển từ trạng thái 4 về trạng thái khác (hủy giao hàng) -> hoàn lại số lượng
                else if (oldTrangThai === 4 && newTrangThai !== 4) {
                    const sqlGetDetails = "SELECT ma_san_pham, so_luong FROM chi_tiet_don_hang WHERE ma_don_hang = ?";
                    db.query(sqlGetDetails, [ma_don_hang], (error, details) => {
                        if (error) {
                            return callback(error);
                        }

                        let queries = details.map(item => {
                            return new Promise((resolve, reject) => {
                                const sqlUpdateStock = `
                                    UPDATE san_pham 
                                    SET soluong = soluong + ? 
                                    WHERE ma_san_pham = ?
                                `;
                                db.query(sqlUpdateStock, [item.so_luong, item.ma_san_pham], (err, res) => {
                                    if (err) reject(err);
                                    else resolve(res);
                                });
                            });
                        });

                        Promise.all(queries)
                            .then(() => {
                                console.log(`Đã hoàn lại số lượng tồn kho cho đơn hàng #${ma_don_hang}`);
                                callback(null, result);
                            })
                            .catch(err => {
                                callback(err);
                            });
                    });
                }
                else {
                    callback(null, result);
                }
            });
        });
    },


    delete: (ma_don_hang, callback) => {
        const sqlDelete = "DELETE FROM don_hang WHERE ma_don_hang = ?";
        db.query(sqlDelete, [ma_don_hang], (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },
     // Thêm hàm tìm kiếm gần đúng
     searchByName: (searchTerm, callback) => {
        const sqlSearch = "SELECT * FROM don_hang WHERE ten_khach LIKE ?";
        const formattedSearchTerm = `%${searchTerm}%`; // Tìm kiếm gần đúng
        db.query(sqlSearch, [formattedSearchTerm], (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },

    getByNgayDatLich: (ngay_dat_hang, callback) => {
        const sqlGetByNgayDatHang = "SELECT * FROM don_hang WHERE ngay_dat_hang = ?";
        db.query(sqlGetByNgayDatHang, [ngay_dat_hang], (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },

    getByTrangThai: (trang_thai, callback) => {
        const sqlGetByTrangThai = "SELECT * FROM don_hang WHERE trang_thai = ?";
        db.query(sqlGetByTrangThai, [trang_thai], (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },

    // Thống kê doanh thu theo tháng trong năm
    getDoanhThuTheoThang: (year, callback) => {
        const sqlStats = `
            SELECT 
                MONTH(ngay_dat_hang) as thang,
                SUM(tong_tien) as doanh_thu,
                COUNT(*) as so_don_hang
            FROM don_hang 
            WHERE YEAR(ngay_dat_hang) = ? AND trang_thai_thanh_toan = 2
            GROUP BY MONTH(ngay_dat_hang)
            ORDER BY thang
        `;
        db.query(sqlStats, [year], (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },

    // Thống kê tỷ lệ đơn hàng theo trạng thái
    getThongKeTrangThai: (callback) => {
        const sqlStats = `
            SELECT 
                trang_thai,
                COUNT(*) as so_luong
            FROM don_hang 
            GROUP BY trang_thai
        `;
        db.query(sqlStats, (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },

    // Thống kê tổng quan
    getThongKeTongQuan: (callback) => {
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;
        
        const sqlStats = `
            SELECT 
                (SELECT SUM(tong_tien) FROM don_hang WHERE YEAR(ngay_dat_hang) = ? AND MONTH(ngay_dat_hang) = ? AND trang_thai_thanh_toan = 2) as doanh_thu_thang,
                (SELECT SUM(tong_tien) FROM don_hang WHERE YEAR(ngay_dat_hang) = ? AND trang_thai_thanh_toan = 2) as doanh_thu_nam,
                (SELECT COUNT(*) FROM don_hang WHERE trang_thai = 1) as don_chua_xu_ly,
                (SELECT COUNT(*) FROM khach_hang) as tong_khach_hang
        `;
        db.query(sqlStats, [currentYear, currentMonth, currentYear], (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result[0]);
        });
    },

};

module.exports = Bill;