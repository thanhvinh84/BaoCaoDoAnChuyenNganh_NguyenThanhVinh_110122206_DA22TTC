const db = require('../config/config');

const Product = {

    getAll: ({page, pageSize}, callback) => {

        const sqlGet = page ?  `CALL GetProductsByPage(${page}, ${pageSize});` :  "SELECT * FROM san_pham";

        db.query(sqlGet, (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },

    getById: (ma_san_pham, callback) => {
        const sqlGet = "SELECT * FROM san_pham WHERE ma_san_pham = ?";
        db.query(sqlGet, [ma_san_pham], (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },

    getByIdDM: (ma_danh_muc, callback) => {
        const sqlGet = "SELECT * FROM san_pham WHERE ma_danh_muc = ?";
        db.query(sqlGet, [ma_danh_muc], (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },


create: (productData, callback) => {
    const {
        ten_san_pham,
        gia,
        mau_sac,
        anh_sanpham,
        ma_danh_muc,
        soluong,
        mo_ta,
        thuong_hieu,
        model,
        cong_suat,
        dien_ap,
        chat_lieu,
        kich_thuoc,
        trong_luong,
        bao_hanh,
        xuat_xu,
        thongbao,
        sale
    } = productData;

    const sqlInsert = `
        INSERT INTO san_pham (
            ten_san_pham, gia, mau_sac, anh_sanpham, ma_danh_muc, soluong, mo_ta,
            thuong_hieu, model, cong_suat, dien_ap, chat_lieu, kich_thuoc, trong_luong,
            bao_hanh, xuat_xu, thongbao, sale
        )
        VALUES (
            ?,?,?,?,?,?,?,
            ?,?,?,?,?,?,?,?,
            ?,?,?
        )
    `;

    const values = [
        ten_san_pham,
        gia,
        mau_sac,
        anh_sanpham,
        ma_danh_muc,
        soluong,
        mo_ta,
        thuong_hieu,
        model,
        cong_suat,
        dien_ap,
        chat_lieu,
        kich_thuoc,
        trong_luong,
        bao_hanh,
        xuat_xu,
        thongbao,
        sale
    ];

    db.query(sqlInsert, values, (error, result) => {
        if (error) {
            return callback(error);
        }
        callback(null, result);
    });
},


update: (ma_san_pham, productData, callback) => {
    const {
        ten_san_pham,
        gia,
        mau_sac,
        anh_sanpham,
        anhhover1,
        anhhover2,
        anhhover3,
        ma_danh_muc,
        soluong,
        mo_ta,
        thuong_hieu,
        model,
        cong_suat,
        dien_ap,
        chat_lieu,
        kich_thuoc,
        trong_luong,
        bao_hanh,
        xuat_xu,
        thongbao,
        sale,
    } = productData;

    const sqlUpdate = `
        UPDATE san_pham SET
            ten_san_pham = ?, 
            gia = ?, 
            mau_sac = ?, 
            anh_sanpham = ?, 
            anhhover1 = ?, 
            anhhover2 = ?,
            anhhover3 = ?,
            ma_danh_muc = ?, 
            soluong = ?, 
            mo_ta = ?,
            thuong_hieu = ?,
            model = ?,
            cong_suat = ?,
            dien_ap = ?,
            chat_lieu = ?,
            kich_thuoc = ?,
            trong_luong = ?,
            bao_hanh = ?,
            xuat_xu = ?,
            thongbao = ?,
            sale = ?
        WHERE ma_san_pham = ?
    `;

    const values = [
        ten_san_pham,
        gia,
        mau_sac,
        anh_sanpham,
        anhhover1,
        anhhover2,
        anhhover3,
        ma_danh_muc,
        soluong,
        mo_ta,
        thuong_hieu,
        model,
        cong_suat,
        dien_ap,
        chat_lieu,
        kich_thuoc,
        trong_luong,
        bao_hanh,
        xuat_xu,
        thongbao,
        sale,
        ma_san_pham
    ];

    db.query(sqlUpdate, values, (error, result) => {
        if (error) {
            return callback(error);
        }
        callback(null, result);
    });
},

    
    delete: (ma_san_pham, callback) => {
        const sqlDelete = "DELETE FROM san_pham WHERE ma_san_pham = ?";
        db.query(sqlDelete, [ma_san_pham], (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },

     searchByName: (searchTerm, callback) => {
        const sqlSearch = "SELECT * FROM san_pham WHERE ten_san_pham LIKE ?";
        const formattedSearchTerm = `%${searchTerm}%`;
        db.query(sqlSearch, [formattedSearchTerm], (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },

    searchByPriceAndName: (minPrice, maxPrice, id_danh_muc, callback) => {
        let sqlSearch = "SELECT * FROM san_pham WHERE gia BETWEEN ? AND ?";
        let queryParams = [minPrice, maxPrice];

    
        if (id_danh_muc && !isNaN(id_danh_muc)) {
            sqlSearch += " AND ma_danh_muc = ?";
            queryParams.push(id_danh_muc);
        }
    
        db.query(sqlSearch, queryParams, (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },

    // Lấy sản phẩm đang khuyến mãi (chỉ có chữ Sale, không lấy New)
    getSaleProducts: (callback) => {
        const sqlGet = "SELECT * FROM san_pham WHERE sale LIKE '%Sale%'";
        db.query(sqlGet, (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },

    // Lấy sản phẩm khuyến mãi theo khoảng giá
    getSaleProductsByPrice: (minPrice, maxPrice, callback) => {
        const sqlGet = "SELECT * FROM san_pham WHERE sale LIKE '%Sale%' AND gia BETWEEN ? AND ?";
        db.query(sqlGet, [minPrice, maxPrice], (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },

    // Lấy sản phẩm khuyến mãi theo danh mục
    getSaleProductsByCategory: (ma_danh_muc, callback) => {
        const sqlGet = "SELECT * FROM san_pham WHERE sale LIKE '%Sale%' AND ma_danh_muc = ?";
        db.query(sqlGet, [ma_danh_muc], (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },

    // Lấy sản phẩm khuyến mãi theo giá và danh mục
    getSaleProductsByPriceAndCategory: (minPrice, maxPrice, ma_danh_muc, callback) => {
        let sqlGet = "SELECT * FROM san_pham WHERE sale LIKE '%Sale%' AND gia BETWEEN ? AND ?";
        let queryParams = [minPrice, maxPrice];
        
        if (ma_danh_muc && !isNaN(ma_danh_muc)) {
            sqlGet += " AND ma_danh_muc = ?";
            queryParams.push(ma_danh_muc);
        }
        
        db.query(sqlGet, queryParams, (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    }
    
};

module.exports = Product;
