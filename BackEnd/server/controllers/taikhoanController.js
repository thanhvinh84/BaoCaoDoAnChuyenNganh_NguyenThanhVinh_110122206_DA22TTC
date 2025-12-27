const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Account = require('../model/taikhoan');

const SECRET_KEY = 'your-secret-key'; // Khóa bí mật dùng để mã hóa token (nên lưu trong biến môi trường thực tế)

exports.loginAccount = (req, res) => {
    const { email, mat_khau } = req.body;

    if (!email || !mat_khau) {
        return res.status(400).json({ message: "Vui lòng nhập đầy đủ email và mật khẩu." });
    }

    Account.login(email, mat_khau, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Đã xảy ra lỗi." });
        }

        if (result.message && result.message !== "Đăng nhập thành công.") {
            return res.status(400).json(result);
        }

        // Nếu đăng nhập thành công, tạo token
        const user = result.user;
        const token = jwt.sign(
            {
                id_tai_khoan: user.id_tai_khoan,
                ten_nguoi_dung: user.ten_nguoi_dung,
                email: user.email,
                role:user.type
            },
            SECRET_KEY,
            { expiresIn: '1h' } // Thời gian hết hạn của token là 1 giờ
        );

        // Trả về token cùng với thông tin người dùng
        res.status(200).json({
            message: "Đăng nhập thành công.",
            token: token,
            user: {
                id_tai_khoan: user.id_tai_khoan,
                ten_nguoi_dung: user.ten_nguoi_dung,
                email: user.email,
                role:user.type
            },
        });
    });
};

exports.createAccount = (req, res) => {
    const accountData = req.body;
    Account.create(accountData, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send("Tài khoản được tạo thành công");
    });
};

exports.getAllAccount = (req, res) => {
    Account.getAll((err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send(result);
    });
};




// Toggle trạng thái tài khoản
exports.toggleStatus = (req, res) => {
    const { id } = req.params;
    const { trang_thai } = req.body;

    Account.toggleStatus(id, trang_thai, (err, result) => {
        if (err) {
            console.error('Error toggling account status:', err);
            return res.status(500).json({ message: "Lỗi khi cập nhật trạng thái tài khoản." });
        }
        res.status(200).json({ message: "Cập nhật trạng thái thành công." });
    });
};

// Đăng nhập bằng Google
exports.googleLogin = (req, res) => {
    const { email, ten_nguoi_dung, google_id, avatar } = req.body;

    if (!email || !google_id) {
        return res.status(400).json({ message: "Thiếu thông tin từ Google." });
    }

    Account.googleLogin({ email, ten_nguoi_dung, google_id, avatar }, (err, result) => {
        if (err) {
            console.error('Google login error:', err);
            return res.status(500).json({ message: "Đã xảy ra lỗi khi đăng nhập bằng Google." });
        }

        const user = result.user;
        const token = jwt.sign(
            {
                id_tai_khoan: user.id_tai_khoan,
                ten_nguoi_dung: user.ten_nguoi_dung,
                email: user.email,
                role: user.type
            },
            SECRET_KEY,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: result.message,
            token: token,
            user: {
                id_tai_khoan: user.id_tai_khoan,
                ten_nguoi_dung: user.ten_nguoi_dung,
                email: user.email,
                role: user.type
            },
        });
    });
};
