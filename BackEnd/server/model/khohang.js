const db = require('../config/config');

const Warehouse = {
    getAll: (callback) => {
        // Lấy tất cả sản phẩm và gộp thông tin kho hàng (tránh trùng lặp)
        const sqlGet = `
            SELECT 
                sp.ma_san_pham,
                sp.ten_san_pham,
                sp.anh_sanpham,
                sp.soluong as so_luong_ton,
                sp.gia,
                sp.mau_sac,
                MAX(kh.ngay_san_xuat) as ngay_san_xuat,
                SUM(kh.so_luong) as tong_so_luong_nhap,
                COUNT(kh.ma_kho_hang) as so_lan_nhap
            FROM san_pham sp
            LEFT JOIN kho_hang kh ON sp.ma_san_pham = kh.ma_san_pham
            GROUP BY sp.ma_san_pham, sp.ten_san_pham, sp.anh_sanpham, sp.soluong, sp.gia, sp.mau_sac
            ORDER BY sp.ma_san_pham DESC
        `;
        db.query(sqlGet, (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },
    getById: (ma_kho_hang, callback) => {
        const sqlGet = "SELECT * FROM kho_hang WHERE ma_kho_hang = ?";
        db.query(sqlGet, ma_kho_hang, (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },
    create: (warehouseData, callback) => {
        const { ma_san_pham ,ten_san_pham,ngay_san_xuat,so_luong,mau_sac ,kich_co,anh_sanpham} = warehouseData;
        const sqlInsert = "INSERT INTO kho_hang (ma_san_pham ,ten_san_pham,ngay_san_xuat,so_luong,mau_sac ,kich_co,anh_sanpham) VALUES (?, ?, ?, ?,?,?,?)";
        db.query(sqlInsert, [ma_san_pham ,ten_san_pham,ngay_san_xuat,so_luong,mau_sac ,kich_co,anh_sanpham], (error, result) => {
            if (error) {
                return callback(error);
            }
            // Cập nhật số lượng sản phẩm
            if (ma_san_pham) {
                const sqlUpdateProduct = "UPDATE san_pham SET soluong = soluong + ? WHERE ma_san_pham = ?";
                db.query(sqlUpdateProduct, [so_luong, ma_san_pham], (err) => {
                    if (err) console.error("Lỗi cập nhật số lượng sản phẩm:", err);
                });
            }
            callback(null, result);
        });
    },

    update: (ma_kho_hang, warehouseData, callback) => {
        const {ten_san_pham,ngay_san_xuat,so_luong,mau_sac,kich_co,anh_sanpham } = warehouseData;
        
        // Lấy số lượng cũ trước khi cập nhật
        const sqlGetOld = "SELECT so_luong, ma_san_pham FROM kho_hang WHERE ma_kho_hang = ?";
        db.query(sqlGetOld, [ma_kho_hang], (err, oldData) => {
            if (err) return callback(err);
            
            const oldSoLuong = oldData[0]?.so_luong || 0;
            const ma_san_pham = oldData[0]?.ma_san_pham;
            const soLuongChenhLech = so_luong - oldSoLuong;
            
            const sqlUpdate = "UPDATE kho_hang SET ten_san_pham = ?,ngay_san_xuat = ?,so_luong = ?,mau_sac =? ,kich_co=?, anh_sanpham=? WHERE ma_kho_hang = ?";
            db.query(sqlUpdate, [ten_san_pham,ngay_san_xuat,so_luong,mau_sac,kich_co,anh_sanpham, ma_kho_hang], (error, result) => {
                if (error) {
                    return callback(error);
                }
                // Cập nhật số lượng sản phẩm theo chênh lệch
                if (ma_san_pham && soLuongChenhLech !== 0) {
                    const sqlUpdateProduct = "UPDATE san_pham SET soluong = soluong + ? WHERE ma_san_pham = ?";
                    db.query(sqlUpdateProduct, [soLuongChenhLech, ma_san_pham], (err) => {
                        if (err) console.error("Lỗi cập nhật số lượng sản phẩm:", err);
                    });
                }
                callback(null, result);
            });
        });
    },

    delete: (ma_kho_hang, callback) => {
        // Lấy thông tin kho hàng trước khi xóa
        const sqlGet = "SELECT so_luong, ma_san_pham FROM kho_hang WHERE ma_kho_hang = ?";
        db.query(sqlGet, [ma_kho_hang], (err, data) => {
            if (err) return callback(err);
            
            const so_luong = data[0]?.so_luong || 0;
            const ma_san_pham = data[0]?.ma_san_pham;
            
            const sqlDelete = "DELETE FROM kho_hang WHERE ma_kho_hang = ?";
            db.query(sqlDelete, [ma_kho_hang], (error, result) => {
                if (error) {
                    return callback(error);
                }
                // Trừ số lượng sản phẩm khi xóa kho hàng
                if (ma_san_pham && so_luong > 0) {
                    const sqlUpdateProduct = "UPDATE san_pham SET soluong = GREATEST(0, soluong - ?) WHERE ma_san_pham = ?";
                    db.query(sqlUpdateProduct, [so_luong, ma_san_pham], (err) => {
                        if (err) console.error("Lỗi cập nhật số lượng sản phẩm:", err);
                    });
                }
                callback(null, result);
            });
        });
    },

     // Thêm hàm tìm kiếm gần đúng
     searchByName: (searchTerm, callback) => {
        const sqlSearch = "SELECT * FROM kho_hang WHERE ten_san_pham LIKE ?";
        const formattedSearchTerm = `%${searchTerm}%`; // Tìm kiếm gần đúng
        db.query(sqlSearch, [formattedSearchTerm], (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    }
};

module.exports = Warehouse;
