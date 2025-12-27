import React, { Fragment, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../../until/userContext';
import { LoadData } from '../../until/cartactive';
import axios from 'axios';

export default function Navbar() {
    const { user, logoutUser } = useUser();
    const navigate = useNavigate();
    const [danhMucList, setDanhMucList] = useState([]);

    // Lấy danh sách danh mục từ API
    useEffect(() => {
        axios.get("http://localhost:5000/api/getalldm")
            .then((response) => {
                setDanhMucList(response.data);
            })
            .catch((error) => {
                console.error("Lỗi khi lấy danh mục:", error);
            });
    }, []);

    const handleLogout = () => {
        logoutUser();
        navigate('/');
        var list = JSON.parse(localStorage.getItem("cart")) || [];
        list = [];
            localStorage.setItem("cart", JSON.stringify(list));
            LoadData();
      };
  return (

      <Fragment>
      <header className="site-header">
        
        <div className="topbar" style={{display: 'block'}}>
            <a href="">Ưu đãi năm mới giảm giá lên đến 30% cho sản phẩm bếp  </a>
            <a href="Allsanpham.html"> " Mua ngay "</a>

        </div>
        <div className="header">
            <div className="header-inner">

                <div className="header__logo">
                    <Link to="/">
                        <img src="../Images/logobep1.png" alt="logo-coolmate"/>
                    </Link>

                </div>
                <div className="header__navbar hide-on-mobile-tablet">

                    <ul className="header__navbar-list">
                        {/* Sản phẩm với dropdown */}
                        <li className="header__navbar-product">
                            <Link to="/product" className="header__navbar-link" style={{ padding: '0 15px' }}>
                                Sản Phẩm
                                <i className="fas fa-chevron-down" style={{ marginLeft: '4px', fontSize: '10px' }}></i>
                            </Link>
                            <div className="header__navbar-product-menu-wrap">
                                <div className="header__navbar-product-menu">
                                    {danhMucList.map((dm) => (
                                        <div key={dm.ma_danh_muc} className="header__navbar-product-col">
                                            <Link to={`/product?danhmuc=${dm.ma_danh_muc}`} className="header__navbar-product-heading">
                                                {dm.ten_danh_muc}
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </li>

                        <li className="header__navbar-item">
                            <Link to="/product?sale=true" className="header__navbar-link" style={{ padding: '0 15px' }}>Khuyến Mãi</Link>
                        </li>

                        <li className="header__navbar-item navbar-item--about-coolmate">
                            <Link to="/about" className="header__navbar-link" style={{ padding: '0 15px' }}>
                                Về Chúng Tôi
                                <i className="fas fa-chevron-down" style={{ marginLeft: '4px', fontSize: '10px' }}></i>
                            </Link>
                            <div className="navbar-item--about-coolmate__menu-wrap">
                                <div className="about-coolmate__menu-inner">
                                    <div className="row">
                                        <div className="col p-3">
                                            <a href="" className="about-motorbike__menu-inner-item">
                                                <p className="about-motorbike__menu-item-name">Công Nghệ</p>
                                                <p className="about-motorbike__menu-item-content">Khám phá các công nghệ hiện đại trên bếp điện tử</p>
                                            </a>
                                        </div>
                                        <div className="col p-3">
                                            <a href="" className="about-motorbike__menu-inner-item">
                                                <p className="about-motorbike__menu-item-name">Độ Bền</p>
                                                <p className="about-motorbike__menu-item-content">Tìm hiểu cách các hãng bếp tối ưu thiết kế</p>
                                            </a>
                                        </div>
                                        <div className="col p-3">
                                            <a href="" className="about-motorbike__menu-inner-item">
                                                <p className="about-motorbike__menu-item-name">Cộng Đồng</p>
                                                <p className="about-motorbike__menu-item-content">Kết nối cộng đồng yêu nấu ăn</p>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>

                        <li className="header__navbar-item">
                            <Link to="/chatai" className="header__navbar-link" style={{ padding: '0 15px' }}>
                                <i className="fas fa-robot" style={{ marginRight: '5px' }}></i>
                                AI Chat
                            </Link>
                        </li>
                    </ul>

                </div>

                <div className="header__actions">
                    <div className="header__actions-search">
                        <a className="header__actions-link">
                            <i className="fa-solid fa-magnifying-glass fa-xl"></i>
                        </a>
                    </div>
                    <div className="header__actions-account">
                    <Link to="/DangNhap" className="header__actions-link">
                        <i className="fa-solid fa-user fa-xl"></i>
                    </Link>
                    <div className="dropdown-menu">
                        {/* Hiển thị thông tin người dùng hoặc "Tên tài khoản" nếu không có người dùng */}
                        {user ? (
                            <>
                                <a href="" className="dropdown-item">
                                    <i className="fas fa-user"></i> {' '}
                                    {user.name}
                                </a>
                                <Link to="/donhang" className="dropdown-item">
                                    <i className="fas fa-shopping-bag"></i> Đơn hàng
                                </Link>
                                <a href="" className="dropdown-item" onClick={handleLogout}>
                                    <i className="fas fa-sign-out-alt"></i> Đăng xuất
                                </a>
                            </>
                        ) : (
                            <>
                                <Link to="/DangNhap" className="dropdown-item">
                                    <i className="fas fa-sign-in-alt"></i> Đăng nhập
                                </Link>
                            </>
                        )}
                    </div>
                </div>
                    <div className="header__actions-cart-icon">
                        <span className="header__actions-cart-notify">0</span>
                        <Link to="/cart" className="header__actions-link">
                            <i className="fa-solid fa-bag-shopping fa-xl"></i>
                        </Link>
                        <div className="mini-cart-wrap">
                            <div className="mini-cart">
                                <div className="mini-cart-head">
                                    <span><span className="added-product"></span>  sản phẩm</span>
                                    <a href="Cart-page.html">Xem tất cả</a>
                                </div>
                                <ul className="mini-cart__list">
                                    
                                </ul>
                            </div>
                        </div>
                        

                    </div>

                </div>
            </div>
            <div className="search" style= {{ display: 'none'}}>
                <div className="search__inner">
                    <input placeholder="Tìm kiếm sản phẩm..." className="search__input" type="text"/>
                    <img className="search__img" style= {{width: '20px'}}  src="/Images/icon-search.svg" alt=""/>
                </div>
            </div>
        </div>

    </header>
      </Fragment>
  )
}
