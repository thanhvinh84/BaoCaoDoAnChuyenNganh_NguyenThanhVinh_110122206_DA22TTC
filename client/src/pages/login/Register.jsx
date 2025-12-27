import React, { Fragment, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useUser } from '../../until/userContext';
export default function Register() {
  const { updateUser } = useUser();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    tenNguoiDung: '',
    sdt: '',
    email: '',
    matKhau: '',
    nhapLaiMatKhau: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      
      const response = await axios.post('http://localhost:5000/api/google-login', {
        email: decoded.email,
        ten_nguoi_dung: decoded.name,
        google_id: decoded.sub,
        avatar: decoded.picture
      });

      if (response.data && response.data.user) {
        const user = response.data.user;
        updateUser({ id: user.id_tai_khoan, name: user.ten_nguoi_dung, username: user.email });
        toast.success(`Xin chào ${user.ten_nguoi_dung}!`);
        navigate('/');
      }
    } catch (error) {
      console.error('Google login error:', error);
      setMessage('Có lỗi xảy ra khi đăng ký bằng Google.');
    }
  };

  const handleGoogleError = () => {
    setMessage('Đăng ký Google thất bại. Vui lòng thử lại.');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.matKhau !== formData.nhapLaiMatKhau) {
      alert("Mật khẩu và Nhập lại mật khẩu không khớp.");
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/createaccount', {
        ten_nguoi_dung: formData.tenNguoiDung,
        mat_khau: formData.matKhau,
        email: formData.email,
        sdt: formData.sdt,
      });
      alert(`Đăng ký tài khoản thành công!`);
      setFormData({
        tenNguoiDung: '',
        sdt: '',
        email: '',
        matKhau: '',
        nhapLaiMatKhau: ''
      });
    } catch (error) {
      alert("Đã xảy ra lỗi trong quá trình đăng ký tài khoản.");
      console.error(error);
    }
  };

  return (
    <Fragment>
      <div className="modal-form">
        <form className="form-login1" onSubmit={handleSubmit}>
          <h2 className="login__heading">Đăng kí tài khoản</h2>
          <p className="login__text">
            Nếu đã từng mua hàng trên Website trước đây, bạn có thể dùng tính năng{" "}
            <a href="#">"Lấy mật khẩu"</a> để có thể truy cập vào tài khoản bằng email nhé.
          </p>
          <input
            type="text"
            placeholder="Tên của bạn"
            className="login__input"
            name="tenNguoiDung"
            value={formData.tenNguoiDung}
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="SĐT của bạn"
            className="login__input"
            name="sdt"
            value={formData.sdt}
            onChange={handleChange}
          />
          <input
            type="email"
            placeholder="Email của bạn"
            className="login__input"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <div className="password-input-container">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mật khẩu"
              className="login__input"
              name="matKhau"
              value={formData.matKhau}
              onChange={handleChange}
            />
            <i 
              className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
              onClick={togglePasswordVisibility}
            ></i>
          </div>
          <div className="password-input-container">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Nhập lại mật khẩu"
              className="login__input"
              name="nhapLaiMatKhau"
              value={formData.nhapLaiMatKhau}
              onChange={handleChange}
            />
            <i 
              className={`fa ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}
              onClick={toggleConfirmPasswordVisibility}
            ></i>
          </div>
          <button type="submit" className="btn btn--login1">
            Đăng ký
          </button>
          <div className="login-separate">
            <span></span>
            Hoặc
            <span></span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              text="signup_with"
              shape="pill"
              size="large"
              width="300"
              logo_alignment="center"
            />
          </div>
          {message && <p style={{ marginTop: '15px', color: 'red', textAlign: 'center' }}>{message}</p>}
          <div className="form-option">
            <Link to="/DangNhap">
              <span className="form-option__login1">Đăng nhập</span>
            </Link>
          </div>
        </form>
      </div>
    </Fragment>
  );
}
