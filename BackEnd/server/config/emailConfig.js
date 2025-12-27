// Cấu hình SMTP Email
// Hỗ trợ Gmail, Outlook, hoặc SMTP server tùy chỉnh

const emailConfig = {
    // Gmail SMTP (cần bật "Less secure app access" hoặc dùng App Password)
    // ⚠️ QUAN TRỌNG: Thay thế email và app password của bạn vào đây
    gmail: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            // ⚠️ THAY EMAIL GMAIL CỦA BẠN VÀO ĐÂY
            user: process.env.EMAIL_USER || 'thanhlongtv152@gmail.com',
            // App Password đã tạo (bỏ dấu cách)
            pass: process.env.EMAIL_PASS || 'dqeytfshftluedqb'
        }
    },
    
    // Outlook/Hotmail SMTP
    outlook: {
        host: 'smtp-mail.outlook.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER || 'your-email@outlook.com',
            pass: process.env.EMAIL_PASS || 'your-password'
        }
    },

    // Thông tin cửa hàng (hiển thị trong email)
    shopInfo: {
        name: 'Phụ Kiện Bếp Shop',
        address: 'Địa chỉ cửa hàng của bạn',
        phone: '0123 456 789',
        email: 'support@phukienbep.com',
        website: 'https://phukienbep.com'
    }
};

module.exports = emailConfig;
