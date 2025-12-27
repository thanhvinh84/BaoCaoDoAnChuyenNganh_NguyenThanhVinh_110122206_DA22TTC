const nodemailer = require('nodemailer');
const emailConfig = require('../config/emailConfig');

// Tạo transporter với cấu hình Gmail (có thể đổi sang outlook)
const transporter = nodemailer.createTransport(emailConfig.gmail);

// Kiểm tra kết nối SMTP
const verifyConnection = async () => {
    try {
        await transporter.verify();
        console.log('✅ Kết nối SMTP thành công!');
        return true;
    } catch (error) {
        console.error('❌ Lỗi kết nối SMTP:', error.message);
        return false;
    }
};

// Format tiền VND
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
};

// Format ngày tháng
const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// Tạo HTML cho danh sách sản phẩm
const generateProductListHTML = (products) => {
    if (!products || products.length === 0) return '';
    
    return products.map(item => `
        <tr>
            <td style="padding: 12px; border-bottom: 1px solid #eee;">
                <img src="${item.anh_sanpham}" alt="${item.ten_san_pham}" 
                     style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;">
            </td>
            <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.ten_san_pham}</td>
            <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.so_luong}</td>
            <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">${formatCurrency(item.gia)}</td>
            <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">${formatCurrency(item.gia * item.so_luong)}</td>
        </tr>
    `).join('');
};


// Template email xác nhận đơn hàng
const orderConfirmationTemplate = (orderData) => {
    const { ma_don_hang, ten_khach, email, sdt, dia_chi, ngay_dat_hang, tong_tien, loai_thanh_toan, chi_tiet_don_hang, ghi_chu } = orderData;
    const shop = emailConfig.shopInfo;
    
    const paymentMethod = loai_thanh_toan === 'VNPay' ? 'VNPay (Đã thanh toán)' : 'Thanh toán khi nhận hàng (COD)';
    
    return {
        subject: `✅ Xác nhận đơn hàng #${ma_don_hang} - ${shop.name}`,
        html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">🛒 ${shop.name}</h1>
            <p style="color: #ffffff; opacity: 0.9; margin: 10px 0 0 0;">Cảm ơn bạn đã đặt hàng!</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 30px;">
            <div style="background-color: #d4edda; border: 1px solid #c3e6cb; border-radius: 8px; padding: 15px; margin-bottom: 25px;">
                <h2 style="color: #155724; margin: 0; font-size: 18px;">✅ Đơn hàng đã được xác nhận!</h2>
                <p style="color: #155724; margin: 10px 0 0 0;">Mã đơn hàng: <strong>#${ma_don_hang}</strong></p>
            </div>
            
            <!-- Thông tin khách hàng -->
            <h3 style="color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px;">📋 Thông tin giao hàng</h3>
            <table style="width: 100%; margin-bottom: 25px;">
                <tr><td style="padding: 8px 0; color: #666;">Họ tên:</td><td style="padding: 8px 0;"><strong>${ten_khach}</strong></td></tr>
                <tr><td style="padding: 8px 0; color: #666;">Số điện thoại:</td><td style="padding: 8px 0;"><strong>${sdt}</strong></td></tr>
                <tr><td style="padding: 8px 0; color: #666;">Địa chỉ:</td><td style="padding: 8px 0;"><strong>${dia_chi}</strong></td></tr>
                <tr><td style="padding: 8px 0; color: #666;">Ngày đặt:</td><td style="padding: 8px 0;"><strong>${formatDate(ngay_dat_hang)}</strong></td></tr>
                <tr><td style="padding: 8px 0; color: #666;">Thanh toán:</td><td style="padding: 8px 0;"><strong>${paymentMethod}</strong></td></tr>
                ${ghi_chu ? `<tr><td style="padding: 8px 0; color: #666;">Ghi chú:</td><td style="padding: 8px 0;"><em>${ghi_chu}</em></td></tr>` : ''}
            </table>
            
            <!-- Chi tiết đơn hàng -->
            <h3 style="color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px;">🛍️ Chi tiết đơn hàng</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
                <thead>
                    <tr style="background-color: #f8f9fa;">
                        <th style="padding: 12px; text-align: left;">Ảnh</th>
                        <th style="padding: 12px; text-align: left;">Sản phẩm</th>
                        <th style="padding: 12px; text-align: center;">SL</th>
                        <th style="padding: 12px; text-align: right;">Đơn giá</th>
                        <th style="padding: 12px; text-align: right;">Thành tiền</th>
                    </tr>
                </thead>
                <tbody>
                    ${generateProductListHTML(chi_tiet_don_hang)}
                </tbody>
            </table>
            
            <!-- Tổng tiền -->
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; text-align: right;">
                <p style="margin: 0; font-size: 20px; color: #333;">
                    Tổng cộng: <strong style="color: #e74c3c;">${formatCurrency(tong_tien)}</strong>
                </p>
            </div>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #333; color: #fff; padding: 25px; text-align: center;">
            <p style="margin: 0 0 10px 0;"><strong>${shop.name}</strong></p>
            <p style="margin: 0 0 5px 0; font-size: 14px; opacity: 0.8;">📍 ${shop.address}</p>
            <p style="margin: 0 0 5px 0; font-size: 14px; opacity: 0.8;">📞 ${shop.phone}</p>
            <p style="margin: 0; font-size: 14px; opacity: 0.8;">✉️ ${shop.email}</p>
        </div>
    </div>
</body>
</html>
        `
    };
};


// Template email cập nhật trạng thái đơn hàng
const orderStatusUpdateTemplate = (orderData) => {
    const { ma_don_hang, ten_khach, trang_thai, dia_chi, sdt } = orderData;
    const shop = emailConfig.shopInfo;
    
    // Map trạng thái
    const statusMap = {
        1: { text: 'Chờ xác nhận', icon: '⏳', color: '#f39c12', description: 'Đơn hàng của bạn đang chờ được xác nhận.' },
        2: { text: 'Đã xác nhận', icon: '✅', color: '#27ae60', description: 'Đơn hàng đã được xác nhận và đang chuẩn bị.' },
        3: { text: 'Đang giao hàng', icon: '🚚', color: '#3498db', description: 'Đơn hàng đang trên đường giao đến bạn.' },
        4: { text: 'Đã giao thành công', icon: '🎉', color: '#27ae60', description: 'Đơn hàng đã được giao thành công. Cảm ơn bạn!' },
        5: { text: 'Đã hủy', icon: '❌', color: '#e74c3c', description: 'Đơn hàng đã bị hủy.' }
    };
    
    const status = statusMap[trang_thai] || { text: 'Không xác định', icon: '❓', color: '#95a5a6', description: '' };
    
    return {
        subject: `${status.icon} Cập nhật đơn hàng #${ma_don_hang} - ${status.text}`,
        html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">🛒 ${shop.name}</h1>
            <p style="color: #ffffff; opacity: 0.9; margin: 10px 0 0 0;">Cập nhật trạng thái đơn hàng</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 30px;">
            <p style="color: #333; font-size: 16px;">Xin chào <strong>${ten_khach}</strong>,</p>
            
            <!-- Status Box -->
            <div style="background-color: ${status.color}15; border: 2px solid ${status.color}; border-radius: 12px; padding: 25px; margin: 25px 0; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 15px;">${status.icon}</div>
                <h2 style="color: ${status.color}; margin: 0 0 10px 0; font-size: 22px;">${status.text}</h2>
                <p style="color: #666; margin: 0;">${status.description}</p>
            </div>
            
            <!-- Order Info -->
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                <h3 style="color: #333; margin: 0 0 15px 0;">📦 Thông tin đơn hàng</h3>
                <table style="width: 100%;">
                    <tr><td style="padding: 8px 0; color: #666;">Mã đơn hàng:</td><td style="padding: 8px 0;"><strong>#${ma_don_hang}</strong></td></tr>
                    <tr><td style="padding: 8px 0; color: #666;">Người nhận:</td><td style="padding: 8px 0;"><strong>${ten_khach}</strong></td></tr>
                    <tr><td style="padding: 8px 0; color: #666;">Số điện thoại:</td><td style="padding: 8px 0;"><strong>${sdt}</strong></td></tr>
                    <tr><td style="padding: 8px 0; color: #666;">Địa chỉ:</td><td style="padding: 8px 0;"><strong>${dia_chi}</strong></td></tr>
                </table>
            </div>
            
            <!-- Timeline -->
            <h3 style="color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px;">📍 Trạng thái vận chuyển</h3>
            <div style="margin: 20px 0;">
                ${[1, 2, 3, 4].map(step => {
                    const stepStatus = statusMap[step];
                    const isActive = step <= trang_thai && trang_thai !== 5;
                    const isCurrent = step === trang_thai;
                    return `
                        <div style="display: flex; align-items: center; margin-bottom: 15px;">
                            <div style="width: 30px; height: 30px; border-radius: 50%; background-color: ${isActive ? stepStatus.color : '#ddd'}; 
                                        display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 14px;">
                                ${isActive ? '✓' : step}
                            </div>
                            <div style="margin-left: 15px; ${isCurrent ? 'font-weight: bold;' : ''} color: ${isActive ? '#333' : '#999'};">
                                ${stepStatus.text}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 25px;">
                Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua số điện thoại <strong>${shop.phone}</strong> 
                hoặc email <strong>${shop.email}</strong>.
            </p>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #333; color: #fff; padding: 25px; text-align: center;">
            <p style="margin: 0 0 10px 0;"><strong>${shop.name}</strong></p>
            <p style="margin: 0 0 5px 0; font-size: 14px; opacity: 0.8;">📍 ${shop.address}</p>
            <p style="margin: 0 0 5px 0; font-size: 14px; opacity: 0.8;">📞 ${shop.phone}</p>
            <p style="margin: 0; font-size: 14px; opacity: 0.8;">✉️ ${shop.email}</p>
        </div>
    </div>
</body>
</html>
        `
    };
};


// Gửi email xác nhận đơn hàng
const sendOrderConfirmation = async (orderData, customerEmail) => {
    try {
        const template = orderConfirmationTemplate(orderData);
        
        const mailOptions = {
            from: `"${emailConfig.shopInfo.name}" <${emailConfig.gmail.auth.user}>`,
            to: customerEmail,
            subject: template.subject,
            html: template.html
        };
        
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email xác nhận đơn hàng #${orderData.ma_don_hang} đã gửi đến ${customerEmail}`);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Lỗi gửi email xác nhận đơn hàng:', error.message);
        return { success: false, error: error.message };
    }
};

// Gửi email cập nhật trạng thái đơn hàng
const sendOrderStatusUpdate = async (orderData, customerEmail) => {
    try {
        const template = orderStatusUpdateTemplate(orderData);
        
        const mailOptions = {
            from: `"${emailConfig.shopInfo.name}" <${emailConfig.gmail.auth.user}>`,
            to: customerEmail,
            subject: template.subject,
            html: template.html
        };
        
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email cập nhật trạng thái đơn hàng #${orderData.ma_don_hang} đã gửi đến ${customerEmail}`);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Lỗi gửi email cập nhật trạng thái:', error.message);
        return { success: false, error: error.message };
    }
};

// Gửi email tùy chỉnh
const sendCustomEmail = async (to, subject, htmlContent) => {
    try {
        const mailOptions = {
            from: `"${emailConfig.shopInfo.name}" <${emailConfig.gmail.auth.user}>`,
            to: to,
            subject: subject,
            html: htmlContent
        };
        
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email đã gửi đến ${to}`);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Lỗi gửi email:', error.message);
        return { success: false, error: error.message };
    }
};

module.exports = {
    verifyConnection,
    sendOrderConfirmation,
    sendOrderStatusUpdate,
    sendCustomEmail,
    formatCurrency,
    formatDate
};
