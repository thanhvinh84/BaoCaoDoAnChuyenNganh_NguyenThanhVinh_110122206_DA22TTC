const Product = require('../../server/model/sanpham');

exports.getAllProducts = (req, res) => {
    const page = req.query.page
    const pageSize = req.query.pageSize || 10


    Product.getAll({page, pageSize}, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }

        console.log(result);
        res.send(page ?result[0] :result);
    });
};

exports.getProductById = (req, res) => {
    const { ma_san_pham } = req.params;
    Product.getById(ma_san_pham, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send(result);
    });
};

exports.getProductByIdDM = (req, res) => {
    const { ma_danh_muc } = req.params;
    console.log("=== API getspDM được gọi ===");
    console.log("ma_danh_muc:", ma_danh_muc);
    Product.getByIdDM(ma_danh_muc, (err, result) => {
        if (err) {
            console.log("Lỗi:", err);
            return res.status(500).send(err);
        }
        console.log("Số sản phẩm tìm thấy:", result.length);
        console.log("Dữ liệu:", result);
        res.send(result);
    });
};

exports.createProduct = (req, res) => {
    const productData = req.body;
    Product.create(productData, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send("Product added successfully");
    });
};

exports.updateProduct = (req, res) => {
    const { ma_san_pham } = req.params;
    const productData = req.body;
    Product.update(ma_san_pham, productData, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send("Product updated successfully");
    });
};

exports.deleteProduct = (req, res) => {
    const { ma_san_pham } = req.params;
    Product.delete(ma_san_pham, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send("Product deleted successfully");
    });
};

exports.searchProductByName = (req, res) => {
    const { searchTerm } = req.params; 
    Product.searchByName(searchTerm, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send(result);
    });
};

exports.searchServiceByPriceAndName = (req, res) => {
    const { minPrice, maxPrice,  id_danh_muc } = req.query;

    // Gọi hàm tìm kiếm và chắc chắn rằng callback là một hàm
    Product.searchByPriceAndName(minPrice, maxPrice,id_danh_muc, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send(result); // Trả kết quả nếu không có lỗi
    });
};

// Lấy sản phẩm đang khuyến mãi
exports.getSaleProducts = (req, res) => {
    Product.getSaleProducts((err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send(result);
    });
};

// Lấy sản phẩm khuyến mãi theo khoảng giá
exports.getSaleProductsByPrice = (req, res) => {
    const { minPrice, maxPrice } = req.query;
    Product.getSaleProductsByPrice(minPrice, maxPrice, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send(result);
    });
};

// Lấy sản phẩm khuyến mãi theo danh mục
exports.getSaleProductsByCategory = (req, res) => {
    const { ma_danh_muc } = req.params;
    Product.getSaleProductsByCategory(ma_danh_muc, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send(result);
    });
};

// Lấy sản phẩm khuyến mãi theo giá và danh mục
exports.getSaleProductsByPriceAndCategory = (req, res) => {
    const { minPrice, maxPrice, id_danh_muc } = req.query;
    Product.getSaleProductsByPriceAndCategory(minPrice, maxPrice, id_danh_muc, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send(result);
    });
};
