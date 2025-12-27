const express = require('express');
const router = express.Router();
const productController = require('../controllers/sanphamController');

router.get('/api/getallsp', productController.getAllProducts);
router.get('/api/getsp/:ma_san_pham', productController.getProductById);
router.get('/api/getspDM/:ma_danh_muc', productController.getProductByIdDM);
router.get('/api/getspsale', productController.getSaleProducts);
router.get('/api/getspsalebyprice', productController.getSaleProductsByPrice);
router.get('/api/getspsalebycategory/:ma_danh_muc', productController.getSaleProductsByCategory);
router.get('/api/getspsalefilter', productController.getSaleProductsByPriceAndCategory);
router.post('/api/createsp', productController.createProduct);
router.put('/api/updatesp/:ma_san_pham', productController.updateProduct);
router.delete('/api/deletesp/:ma_san_pham', productController.deleteProduct);
router.get('/api/searchsp/:searchTerm', productController.searchProductByName);
router.get('/api/searchgdvprice', productController.searchServiceByPriceAndName);


module.exports = router;
    