import React, { Fragment, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function Footer() {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState({
    ten_khach: '',
    email: '',
    noi_dung: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFeedbackForm({ ...feedbackForm, [name]: value });
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    
    if (!feedbackForm.ten_khach || !feedbackForm.email || !feedbackForm.noi_dung) {
      toast.error('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post('http://localhost:5000/api/feedback', feedbackForm);
      toast.success('Gửi ý kiến thành công! Cảm ơn bạn đã đóng góp.');
      setFeedbackForm({ ten_khach: '', email: '', noi_dung: '' });
      setShowFeedbackModal(false);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Có lỗi xảy ra, vui lòng thử lại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Fragment>
      <footer className="site-footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-top-left">
              <ul>
                <li className="footer-top-left__heading"><a href="">Khám phá Thế Giới Bếp Điện Tử</a></li>
                <li><a href="">Bếp điện từ đơn</a></li>
                <li><a href="">Bếp điện từ đôi</a></li>
                <li><a href="">Bếp điện hồng ngoại</a></li>
                <li><a href="">Máy hút mùi</a></li>
                <li><a href="">Nồi, chảo điện tử</a></li>
                <li><a href="">Phụ kiện nhà bếp</a></li>
                <li><a href="">Dịch vụ lắp đặt</a></li>
                <li><a href="">Cộng đồng yêu bếp</a></li>
              </ul>
              <ul>
                <li className="footer-top-left__heading"><a href="">Dịch vụ khách hàng</a></li>
                <li><a href="">Hỏi đáp - FAQs</a></li>
                <li><a href="">Chính sách đổi trả 30 ngày</a></li>
                <li><a href="">Liên hệ hỗ trợ</a></li>
                <li><a href="">Dịch vụ bảo hành sản phẩm</a></li>
                <li><a href="">Ưu đãi dành cho khách hàng thân thiết</a></li>
                <li><a href="">Chính sách vận chuyển</a></li>
                <li><a href="">Chính sách bảo mật</a></li>
                <li><a href="">Chính sách bảo mật thanh toán</a></li>
                <li className="footer-top-left__heading mg-top30"><a href="">Kiến thức nhà bếp</a></li>
                <li><a href="">Hướng dẫn chọn bếp điện tử</a></li>
                <li><a href="">Blog ẩm thực & mẹo bếp</a></li>
                <li><a href="">Cộng đồng yêu nấu ăn</a></li>
              </ul>
              <ul>
                <li className="footer-top-left__heading"><a href="">Tài liệu - Tuyển dụng</a></li>
                <li><a href="">Hướng dẫn sử dụng bếp</a></li>
                <li><a href="">Tuyển dụng</a></li>
                <li className="footer-top-left__heading mg-top30"><a href="">Về Chúng Tôi</a></li>
                <li><a href="">Câu chuyện thương hiệu</a></li>
                <li><a href="">Gia nhập đội ngũ chúng tôi</a></li>
                <li><a href="">Hỗ trợ cộng đồng yêu bếp</a></li>
                <li><a href="">Nhà máy sản xuất</a></li>
              </ul>
              <ul>
                <li className="footer-top-left__heading"><a href="">Địa chỉ liên hệ</a></li>
                <li><a href="">Showroom Hà Nội: Số 123, Đường</a></li>
                <li><a href="">Vạn Phúc, Phường Vạn Phúc,</a></li>
                <li><a href="">Quận Hà Đông, TP. Hà Nội</a></li>
                <li><a href="">Showroom Tp HCM: Lầu 2, Số 456</a></li>
                <li><a href="">Trần Trọng Cung, Phường</a></li>
                <li><a href="">Tân Thuận Đông, Quận 7, Tp.</a></li>
                <li><a href="">Hồ Chí Minh</a></li>
              </ul>
            </div>

            <div className="footer-top-right">
              <h3 className="footer-top-right__heading">Chúng tôi luôn lắng nghe bạn!</h3>
              <p className="footer-top-right__content">
                Chúng tôi luôn trân trọng và mong đợi nhận được mọi ý kiến đóng góp từ khách hàng để có thể nâng cao trải nghiệm mua sắm và sử dụng sản phẩm nhà bếp tốt hơn nữa.
              </p>
              <div className="btn btn--feedback" onClick={() => setShowFeedbackModal(true)}>Gửi Ý Kiến</div>
              <div className="footer-contact">
                <div className="footer-contact__icon">
                  <img src="../Images/icon-hotline.svg" alt="" />
                </div>
                <a href="">
                  <p className="footer-conttact__body">
                    Hotline: 19001234
                  </p>
                </a>
              </div>
              <div className="footer-contact">
                <div className="footer-contact__icon">
                  <img src="../Images/icon-email.svg" alt="" />
                </div>
                <a href="">
                  <p className="footer-conttact__body">
                    Email: support@bepstore.vn
                  </p>
                </a>
              </div>
              <div className="footer-society">
                <a href=""><img src="../Images/icon-facebook.svg" alt="" /></a>
                <a href=""><img src="../Images/icon-instar.svg" alt="" /></a>
                <a href=""><img src="../Images/icon-youtube.svg" alt="" /></a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>
              @ CÔNG TY TNHH BẾP STORE VIỆT NAM  
              Mã số doanh nghiệp: 0108617038. Giấy chứng nhận đăng ký doanh nghiệp do Sở Kế hoạch và Đầu tư TP Hà Nội cấp lần đầu ngày 20/02/2019.
            </p>
            <div className="footer-certificate">
              <a href="">
                <img className="footer-certificate__img" src="../Images/handle_cert.png" alt="" />
              </a>
              <a href="">
                <img className="footer-certificate__img" src="../Images/dmca_protected_15_120.png" alt="" />
              </a>
              <a href="">
                <img className="footer-certificate__img" src="../Images/bep-info.png" alt="" />
              </a>
              <a href="">
                <img className="footer-certificate__img" src="../Images/logoSaleNoti.png" alt="" />
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal Gửi Ý Kiến */}
      {showFeedbackModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '30px',
            width: '500px',
            maxWidth: '95%',
            boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
            position: 'relative'
          }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '25px' }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 15px'
              }}>
                <i className="fas fa-comment-dots" style={{ fontSize: '24px', color: 'white' }}></i>
              </div>
              <h2 style={{ color: '#333', margin: 0, fontSize: '22px' }}>Gửi Ý Kiến Của Bạn</h2>
              <p style={{ color: '#666', margin: '8px 0 0', fontSize: '14px' }}>
                Chúng tôi luôn lắng nghe và trân trọng mọi ý kiến đóng góp
              </p>
            </div>

            <form onSubmit={handleSubmitFeedback}>
              {/* Họ tên */}
              <div style={{ marginBottom: '15px' }}>
                <label style={{ color: '#333', fontSize: '14px', display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                  Họ và tên <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="text"
                  name="ten_khach"
                  value={feedbackForm.ten_khach}
                  onChange={handleInputChange}
                  placeholder="Nhập họ tên của bạn"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '15px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.3s'
                  }}
                />
              </div>

              {/* Email */}
              <div style={{ marginBottom: '15px' }}>
                <label style={{ color: '#333', fontSize: '14px', display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                  Email <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={feedbackForm.email}
                  onChange={handleInputChange}
                  placeholder="Nhập email của bạn"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '15px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Nội dung */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: '#333', fontSize: '14px', display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                  Nội dung ý kiến <span style={{ color: 'red' }}>*</span>
                </label>
                <textarea
                  name="noi_dung"
                  value={feedbackForm.noi_dung}
                  onChange={handleInputChange}
                  placeholder="Nhập ý kiến, góp ý hoặc câu hỏi của bạn..."
                  rows="4"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '15px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowFeedbackModal(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#f5f5f5',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#666',
                    fontSize: '15px',
                    cursor: 'pointer'
                  }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    flex: 2,
                    padding: '12px',
                    background: isSubmitting ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isSubmitting ? 'Đang gửi...' : 'Gửi Ý Kiến'}
                </button>
              </div>
            </form>

            {/* Close button */}
            <button
              onClick={() => setShowFeedbackModal(false)}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: '#f5f5f5',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <i className="fa-solid fa-xmark" style={{ color: '#666' }}></i>
            </button>
          </div>
        </div>
      )}
    </Fragment>
  );
}
