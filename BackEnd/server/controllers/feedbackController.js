const Feedback = require('../model/feedback');

// Tạo feedback mới
exports.createFeedback = (req, res) => {
    const { ten_khach, email, noi_dung } = req.body;
    
    if (!ten_khach || !email || !noi_dung) {
        return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });
    }

    Feedback.create({ ten_khach, email, noi_dung }, (err, result) => {
        if (err) {
            console.error('Error creating feedback:', err);
            return res.status(500).json({ message: 'Lỗi khi gửi ý kiến' });
        }
        res.status(201).json({ message: 'Gửi ý kiến thành công!', id: result.insertId });
    });
};

// Lấy tất cả feedback
exports.getAllFeedback = (req, res) => {
    Feedback.getAll((err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Lỗi khi lấy danh sách feedback' });
        }
        res.json(result);
    });
};

// Lấy feedback chưa đọc
exports.getUnreadFeedback = (req, res) => {
    Feedback.getUnread((err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Lỗi khi lấy feedback chưa đọc' });
        }
        res.json(result);
    });
};

// Đếm số feedback chưa đọc
exports.countUnreadFeedback = (req, res) => {
    Feedback.countUnread((err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Lỗi khi đếm feedback' });
        }
        res.json({ count: result[0].count });
    });
};

// Đánh dấu đã đọc
exports.markAsRead = (req, res) => {
    const { id } = req.params;
    Feedback.markAsRead(id, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Lỗi khi cập nhật' });
        }
        res.json({ message: 'Đã đánh dấu đã đọc' });
    });
};

// Đánh dấu tất cả đã đọc
exports.markAllAsRead = (req, res) => {
    Feedback.markAllAsRead((err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Lỗi khi cập nhật' });
        }
        res.json({ message: 'Đã đánh dấu tất cả đã đọc' });
    });
};

// Xóa feedback
exports.deleteFeedback = (req, res) => {
    const { id } = req.params;
    Feedback.delete(id, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Lỗi khi xóa' });
        }
        res.json({ message: 'Đã xóa feedback' });
    });
};
