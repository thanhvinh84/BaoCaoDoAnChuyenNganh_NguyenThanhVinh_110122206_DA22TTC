import React, { Fragment, useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { useUser } from '../../until/userContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

export default function Navbar() {
  const { updateUser , user } = useUser();
  const navigate = useNavigate();
  const [pendingOrders, setPendingOrders] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [feedbackCount, setFeedbackCount] = useState(0);

  // Load đơn hàng chưa duyệt
  const loadPendingOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/getalldonhang');
      if (response.data && Array.isArray(response.data)) {
        const pending = response.data.filter(order => order.trang_thai === 1);
        setPendingOrders(pending.slice(0, 5));
        setPendingCount(pending.length);
      }
    } catch (error) {
      console.error('Error loading pending orders:', error);
      // Không hiển thị lỗi, chỉ log
    }
  };

  // Load feedback chưa đọc
  const loadFeedbacks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/feedback/unread');
      if (response.data && Array.isArray(response.data)) {
        setFeedbacks(response.data.slice(0, 5));
        setFeedbackCount(response.data.length);
      }
    } catch (error) {
      console.error('Error loading feedbacks:', error);
      // Không hiển thị lỗi, chỉ log - API feedback có thể chưa có bảng
    }
  };

  useEffect(() => {
    loadPendingOrders();
    loadFeedbacks();
    // Refresh mỗi 30 giây
    const interval = setInterval(() => {
      loadPendingOrders();
      loadFeedbacks();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Format ngày
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  // Format tiền
  const formatVND = (number) => {
    return new Intl.NumberFormat('vi-VN').format(number) + 'đ';
  };

  const logout = () => {
  if (window.confirm("Bạn có muốn đăng xuất không ?")) {

    localStorage.removeItem('token');
    updateUser(null); // hoặc reset state người dùng
    navigate('/login');
    window.location.reload();
 }

};
  return (
<Fragment>
<nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">

{/* <!-- Sidebar Toggle (Topbar) --> */}
<form className="form-inline">
    <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
        <i className="fa fa-bars"></i>
    </button>
</form>


{/* <!-- Topbar Navbar --> */}
<ul className="navbar-nav ml-auto">

    {/* <!-- Nav Item - Search Dropdown (Visible Only XS) --> */}
    <li className="nav-item dropdown no-arrow d-sm-none">
        <a className="nav-link dropdown-toggle" href="#" id="searchDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <i className="fas fa-search fa-fw"></i>
        </a>
        {/* <!-- Dropdown - Messages --> */}
        <div className="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in" aria-labelledby="searchDropdown">
            <form className="form-inline mr-auto w-100 navbar-search">
                <div className="input-group">
                    <input type="text" className="form-control bg-light border-0 small" placeholder="Search for..." aria-label="Search" aria-describedby="basic-addon2"/>
                    <div className="input-group-append">
                        <button className="btn btn-primary" type="button">
                            <i className="fas fa-search fa-sm"></i>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </li>

    {/* <!-- Nav Item - Alerts (Đơn hàng chưa duyệt) --> */}
    <li className="nav-item dropdown no-arrow mx-1">
        <a className="nav-link dropdown-toggle" href="#" id="alertsDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <i className="fas fa-bell fa-fw"></i>
            {/* <!-- Counter - Alerts --> */}
            {pendingCount > 0 && (
              <span className="badge badge-danger badge-counter">
                {pendingCount > 9 ? '9+' : pendingCount}
              </span>
            )}
        </a>
        {/* <!-- Dropdown - Alerts --> */}
        <div className="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="alertsDropdown">
            <h6 className="dropdown-header">
                🔔 Đơn hàng chờ duyệt ({pendingCount})
            </h6>
            {pendingOrders.length > 0 ? (
              pendingOrders.map((order) => (
                <Link 
                  key={order.ma_don_hang} 
                  className="dropdown-item d-flex align-items-center" 
                  to={`/Updatedh/${order.ma_don_hang}`}
                >
                    <div className="mr-3">
                        <div className="icon-circle bg-warning">
                            <i className="fas fa-shopping-cart text-white"></i>
                        </div>
                    </div>
                    <div>
                        <div className="small text-gray-500">{formatDate(order.ngay_dat_hang)}</div>
                        <span className="font-weight-bold">
                          Đơn #{order.ma_don_hang} - {order.ten_khach}
                        </span>
                        <div className="small text-success">{formatVND(order.tong_tien)}</div>
                    </div>
                </Link>
              ))
            ) : (
              <div className="dropdown-item text-center text-muted">
                <i className="fas fa-check-circle text-success mr-2"></i>
                Không có đơn hàng chờ duyệt
              </div>
            )}
            <Link className="dropdown-item text-center small text-gray-500" to="/Indexhd">
              Xem tất cả đơn hàng
            </Link>
        </div>
    </li>

    {/* <!-- Nav Item - Messages (Feedback từ khách hàng) --> */}
    <li className="nav-item dropdown no-arrow mx-1">
        <a className="nav-link dropdown-toggle" href="#" id="messagesDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <i className="fas fa-envelope fa-fw"></i>
            {/* <!-- Counter - Messages --> */}
            {feedbackCount > 0 && (
              <span className="badge badge-danger badge-counter">
                {feedbackCount > 9 ? '9+' : feedbackCount}
              </span>
            )}
        </a>
        {/* <!-- Dropdown - Messages --> */}
        <div className="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="messagesDropdown">
            <h6 className="dropdown-header">
                📧 Ý kiến khách hàng ({feedbackCount})
            </h6>
            {feedbacks.length > 0 ? (
              feedbacks.map((fb) => (
                <div key={fb.id} className="dropdown-item d-flex align-items-center">
                    <div className="dropdown-list-image mr-3">
                        <div className="icon-circle bg-primary" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <i className="fas fa-user text-white"></i>
                        </div>
                    </div>
                    <div style={{ flex: 1 }}>
                        <div className="font-weight-bold text-truncate" style={{ maxWidth: '200px' }}>
                          {fb.noi_dung}
                        </div>
                        <div className="small text-gray-500">
                          {fb.ten_khach} · {formatDate(fb.ngay_gui)}
                        </div>
                        <div className="small text-muted">{fb.email}</div>
                    </div>
                </div>
              ))
            ) : (
              <div className="dropdown-item text-center text-muted">
                <i className="fas fa-inbox mr-2"></i>
                Chưa có ý kiến mới
              </div>
            )}
            <Link className="dropdown-item text-center small text-gray-500" to="/Indexfeedback">
              Xem tất cả ý kiến
            </Link>
        </div>
    </li>

    <div className="topbar-divider d-none d-sm-block"></div>

    {/* <!-- Nav Item - User Information --> */}
    <li className="nav-item dropdown no-arrow">
    
        <a className="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <span className="mr-2 d-none d-lg-inline text-gray-600 small"></span>
            <img className="img-profile rounded-circle" src="/img/undraw_profile.svg"/>
        </a>
        {/* <!-- Dropdown - User Information --> */}
        <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="userDropdown">
            <a className="dropdown-item" href="#">
                <i className="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
                Cài đặt
            </a>
            <a className="dropdown-item" href="#">
                <i className="fas fa-list fa-sm fa-fw mr-2 text-gray-400"></i>
                Hoạt động
            </a>
            <div className="dropdown-divider"></div>
            <a className="dropdown-item" href="#" data-toggle="modal" data-target="#logoutModal" onClick={logout}>
                <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                Đăng xuất
            </a>
        </div>
    </li>
        
</ul>

</nav>
</Fragment>
  )
}
