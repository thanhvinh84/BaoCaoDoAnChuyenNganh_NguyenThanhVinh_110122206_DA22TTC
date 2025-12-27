const Voucher = require('../model/voucher');

// Lấy tất cả voucher
exports.getAllVoucher = (req, res) => {
    Voucher.getAll((err, result) => {
        if (err) return res.status(500).json({ message: "Lỗi server", error: err });
        res.json(result);
    });
};

// Lấy voucher theo ID
exports.getVoucherById = (req, res) => {
    const { id } = req.params;
    Voucher.getById(id, (err, result) => {
        if (err) return res.status(500).json({ message: "Lỗi server", error: err });
        if (!result) return res.status(404).json({ message: "Không tìm thấy voucher" });
        res.json(result);
    });
};

// Tạo voucher mới
exports.createVoucher = (req, res) => {
    const voucherData = req.body;
    Voucher.create(voucherData, (err, result) => {
        if (err) return res.status(500).json({ message: "Lỗi khi tạo voucher", error: err });
        res.json({ message: "Tạo voucher thành công", id: result.insertId });
    });
};

// Cập nhật voucher
exports.updateVoucher = (req, res) => {
    const { id } = req.params;
    const voucherData = req.body;
    Voucher.update(id, voucherData, (err, result) => {
        if (err) return res.status(500).json({ message: "Lỗi khi cập nhật voucher", error: err });
        res.json({ message: "Cập nhật voucher thành công" });
    });
};

// Xóa voucher
exports.deleteVoucher = (req, res) => {
    const { id } = req.params;
    Voucher.delete(id, (err, result) => {
        if (err) return res.status(500).json({ message: "Lỗi khi xóa voucher", error: err });
        res.json({ message: "Xóa voucher thành công" });
    });
};

// Lấy voucher còn hiệu lực (cho client)
exports.getActiveVoucher = (req, res) => {
    Voucher.getActive((err, result) => {
        if (err) return res.status(500).json({ message: "Lỗi server", error: err });
        res.json(result);
    });
};
