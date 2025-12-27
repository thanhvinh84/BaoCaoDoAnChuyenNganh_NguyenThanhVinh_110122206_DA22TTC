import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../../until/userContext';
import { toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const Login = () => {

  const { updateUser } = useUser();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username.endsWith('@gmail.com')) {
      setMessage('Tên đăng nhập phải có dạng @gmail.com');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        email: username,
        mat_khau: password,
      });

      if (response.data && response.data.user) {

        const user = response.data.user;
        updateUser({ id: user.id_tai_khoan, name: user.ten_nguoi_dung, username: user.email });
        alert(`Xin chào ${user.ten_nguoi_dung}!`);
        navigate('/');

      } else {
        setMessage('Thông tin tài khoản hoặc mật khẩu không chính xác!');
      }
      
    } catch (error) {
      console.error(error);
      setMessage('Có lỗi xảy ra trong quá trình đăng nhập.');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      
      // Gửi thông tin Google user lên backend
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
      setMessage('Có lỗi xảy ra khi đăng nhập bằng Google.');
    }
  };

  const handleGoogleError = () => {
    setMessage('Đăng nhập Google thất bại. Vui lòng thử lại.');
  };

  return (
    <div className="modal-form">
      <div className="form-login">
        <h2 className="login__heading">Đăng nhập</h2>
        <p className="login__text">
          Nếu đã từng mua hàng trên Website trước đây, bạn có thể dùng tính năng{' '}
          <a href="#">"Lấy mật khẩu"</a> để có thể truy cập vào tài khoản bằng email nhé.
        </p>

        <input
          type="text"
          id="username"
          placeholder="Email/SĐT của bạn"
          className="login__input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          id="password"
          placeholder="Mật khẩu"
          className="login__input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {message && <p style={{ marginBottom: '15px', color: 'red' }} className="login__message">{message}</p>}

        <div className="btn btn--login" onClick={handleLogin}>
          Đăng nhập
        </div>

        <div className="login-separate">
          <span></span>
          Hoặc
          <span></span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            text="signin_with"
            shape="pill"
            size="large"
            width="300"
            logo_alignment="center"
          />
        </div>

        <div className="form-option">
          <Link to="/DangKy">
            <span className="form-option__login">Đăng ký tài khoản mới</span>
          </Link>
          <span>Quên mật khẩu</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
