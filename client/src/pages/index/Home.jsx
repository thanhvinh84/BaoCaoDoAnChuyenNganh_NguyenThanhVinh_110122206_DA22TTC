import React, { Fragment, useEffect, useState } from 'react'
import Silde from '../../components/slider/silde';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import AddProduct from '../../until/cart';
import { useUser } from '../../until/userContext';
export default function Home() {
    AddProduct();
    const [data,setData] = useState([]);
    const [dataMHM,setDataMHM] = useState([]);
    const [dataMRC,setDataMRC] = useState([]);

    const {user} = useUser();
    const [savedCoupons, setSavedCoupons] = useState([]);
    const [allCoupons, setAllCoupons] = useState([]);

    // Load voucher từ database
    const loadVouchers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/vouchers/active');
            setAllCoupons(response.data);
        } catch (error) {
            console.error('Lỗi khi tải voucher:', error);
        }
    };

    // Load saved coupons khi component mount hoặc user thay đổi
    useEffect(() => {
        loadVouchers();
        const couponsFromStorage = JSON.parse(localStorage.getItem("coupons")) || [];
        setSavedCoupons(couponsFromStorage);
    }, [user]);

    // Lọc ra những coupon mà user chưa lấy
    const availableCoupons = allCoupons.filter(coupon => {
        if (!user) return true; // Nếu chưa đăng nhập, hiển thị tất cả
        // Kiểm tra xem user đã lấy coupon này chưa
        const alreadySaved = savedCoupons.some(
            saved => saved.coupon_name === coupon.coupon_name && saved.id_user === user.id
        );
        return !alreadySaved;
    });

      
      const handleSaveCoupon = (coupon) => {
        if(!user){
            toast.error(`Hãy đăng nhập để lưu mã giảm giá!`, {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            return;
        }

        // Kiểm tra xem user đã lấy coupon này chưa
        const alreadySaved = savedCoupons.some(
            saved => saved.coupon_name === coupon.coupon_name && saved.id_user === user.id
        );
        
        if(alreadySaved){
            toast.error(`Bạn đã lấy mã giảm giá này rồi!`, {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            return;
        }

        if(coupon.remaining_count === 0){
            toast.error(`Mã giảm giá này đã hết số lượng!`, {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            return;
        }

        // Lưu coupon mới
        const newCoupon = { ...coupon, id_user: user.id };
        const updatedCoupons = [...savedCoupons, newCoupon];
        localStorage.setItem("coupons", JSON.stringify(updatedCoupons));
        setSavedCoupons(updatedCoupons);
        
        toast.success(`Mã giảm giá "${coupon.coupon_name}" đã được lưu!`, {
            position: "top-right",
            autoClose: 500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
      };

    const loadData = async() =>{
        const response = await axios.get("http://localhost:5000/api/top5products");
        setData(response.data);
    };

    const loadDataMRC = async() =>{
        const response = await axios.get("http://localhost:5000/api/getspDM/2");
        setDataMRC(response.data);
    };

    const loadDataMHM = async() =>{
        const response = await axios.get("http://localhost:5000/api/getspDM/3");
        setDataMHM(response.data);
    };

    useEffect(()=>{
        loadData();
        loadDataMRC();
        loadDataMHM();

    },[]);

    const formatCurrency = (number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
    }; 

        // ✅ Random số sao trung bình từ 4.5 đến 5.0 (1 chữ số thập phân)
    const getRandomRating = () => {
    const rating = Math.random() * (5 - 4.5) + 4.5; 
    return rating.toFixed(1);
    };

    // ✅ Random số lượt đánh giá từ 15 đến 30
    const getRandomReviewCount = () => {
    return Math.floor(Math.random() * (30 - 15 + 1)) + 15;
    };


      
  return (
        <Fragment>
            <div className="main">
                <Silde/>
                <section id="section-discounts">
                    <div className="container">
                    <div className="section-discounts-wrapper">
                    <div className="homepage-coupon-card">
                        {availableCoupons.length > 0 ? (
                            <>
                            {/* Render 2 lần để tạo hiệu ứng chạy liên tục */}
                            {[...availableCoupons, ...availableCoupons].map((coupon, index) => (
                            <div key={index} className="coupon-card-item">
                            <div className="coupon-card-item-top">
                                <div className="description-amount">
                                <div className="coupon-card-limit">(Còn {coupon.remaining_count} lượt)</div>
                                <p>Giảm {coupon.discount_amount}K</p>
                                </div>
                                <div className="description-info">
                                <p>{coupon.description}</p>
                                <p style={{ display: "none" }}>{coupon.value}</p>
                                </div>
                            </div>
                            <div className="coupon-card-item-bottom">
                                <span className="coupon-card-coupon">{coupon.coupon_name}</span>
                                <span
                                className="btn btnluuma"
                                onClick={() => handleSaveCoupon(coupon)}
                                style={{ cursor: "pointer" }}
                                >
                                Lưu mã
                                </span>
                            </div>
                            </div>
                            ))}
                            </>
                        ) : (
                            user && <p style={{ textAlign: 'center', color: '#fff', padding: '20px' }}>Bạn đã lấy hết tất cả mã giảm giá!</p>
                        )}

                    </div>
                    </div>
                </div>
                </section>
                <section className="homepage-search">
                    <div className="container-medium">
                        <div className="homepage-search-wrapper">
                            <h2 className="homepage-search-heading"> Bạn tìm gì hôm nay? </h2>
                            <div className="homepage-search-inner">
                                <form action="/spotlight" method="GET">
                                    <input type="text" name="keyword" placeholder="Hãy thử bắt đầu với bếp điện xem sao ?" className="homepage-search-control"/>
                                    <button className="homepage-search-submit">
                                        <i className="fa-solid fa-magnifying-glass fa-2xl"></i>
                                    </button>
                                </form>
                            </div>
                            <div className="homepage-search-content">
                                <p className="home-search-description"> Từ khóa nổi bật ngày hôm nay</p>
                                <div className="homepage-search-buttons">
                                    <a href="#" className="homepage-search-button">Phụ kiện bếp</a>
                                    <a href="#" className="homepage-search-button">Máy rửa bát</a>
                                    <a href="#" className="homepage-search-button">Bếp từ</a>
                                    <a href="#" className="homepage-search-button">Khóa điện</a>
                                    <a href="#" className="homepage-search-button">Máy hút mùi</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section>
                <div className="container1">
                <div className="homepage-product__heading">Sản phẩm bán chạy</div>
                    <div className="product-type">
                        <div className="row">
                            {/* Sản phẩm mẫu */}
                            

                            {/* Render sản phẩm từ dữ liệu */}
                            {data.map((item) => (
                                <div key={item.ma_san_pham} className="col p-2-4">
                                    <div id={`${item.ma_san_pham}`} className="product">
                                        <div className="product-img-wrap" style={{ marginBottom: '8px' }}>
                                            <Link to={`/detail/${item.ma_san_pham}`} className="product-img product-img--small">
                                                <img className="product-img-1" src={item.anh_sanpham} alt="" />
                                                <img className="product-img-2" src={item.anhhover1} alt="" />
                                            </Link>
                                            <div className="product-size">
                                                <p>Thêm nhanh vào giỏ hàng +</p>
                                                <div className="btn btn--size">Thêm vào giỏ hàng</div>
                                            </div>
                                        </div>
                                        <div className='product-grid__reviews'>
                                            <div className='reviews-rating'>
                                                <div className='reviews-rating__vote'>{getRandomRating()}</div>
                                                <div className='reviews-rating__star'></div>
                                                <div className='reviews-rating__number'>({getRandomReviewCount()})</div>
                                            </div>
                                        </div>
                                        <div className="product-content">
                                            <div style={{ display: 'none' }} className="product-content__option ">
                                                <div className="product-content__option-item-wrap active">
                                                    <span data={item.mau_sac}></span>
                                                </div>
                                            </div>
                                            <a className="product-name">{item.ten_san_pham}</a>
                                            <div className="product-price-wrap">
                                                <div className="product-price">{formatCurrency(item.gia)}</div>
                                            </div>
                                            <div className="product-discount">
                                                {item.thongbao}
                                            </div>
                                            <div className="sale-tag product-tag">{item.sale}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                </div>
                </section>

                <section className="homepage-product">
                    <div className="container">
                        <div className="homepage-product__heading">Máy rửa chén</div>
                        <div className="bestseller__content active">
                        <div className="row">
                       {/* Render sản phẩm từ dữ liệu */}
                            {dataMRC.map((item) => (
                                <div key={item.ma_san_pham} className="col p-2-4">
                                    <div id={`${item.ma_san_pham}`} className="product">
                                        <div className="product-img-wrap" style={{ marginBottom: '8px' }}>
                                            <Link to={`/detail/${item.ma_san_pham}`} className="product-img product-img--small">
                                                <img className="product-img-1" src={item.anh_sanpham} alt="" />
                                                <img className="product-img-2" src={item.anhhover1} alt="" />
                                            </Link>
                                            <div className="product-size">
                                                <p>Thêm nhanh vào giỏ hàng +</p>
                                                <div className="btn btn--size">Thêm vào giỏ hàng</div>
                                            </div>
                                        </div>
                                        <div className='product-grid__reviews'>
                                            <div className='reviews-rating'>
                                                <div className='reviews-rating__vote'>{getRandomRating()}</div>
                                                <div className='reviews-rating__star'></div>
                                                <div className='reviews-rating__number'>({getRandomReviewCount()})</div>
                                            </div>
                                        </div>
                                        <div className="product-content">
                                            <div style={{ display: 'none' }} className="product-content__option ">
                                                <div className="product-content__option-item-wrap active">
                                                    <span data={item.mau_sac}></span>
                                                </div>
                                            </div>
                                            <a className="product-name">{item.ten_san_pham}</a>
                                            <div className="product-price-wrap">
                                                <div className="product-price">{formatCurrency(item.gia)}</div>
                                            </div>
                                            <div className="product-discount">
                                                {item.thongbao}
                                            </div>
                                            <div className="sale-tag product-tag">{item.sale}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                </div>

                        </div>

                    </div>
                </section>

                <section className="homepage-product">
                <div className="container">
                <div className="homepage-product__heading">Máy hút mùi</div>
                <div className="bestseller__content active">
                    <div className="row">

                                     {/* Render sản phẩm từ dữ liệu */}
                            {dataMHM.map((item) => (
                                <div key={item.ma_san_pham} className="col p-2-4">
                                    <div id={`${item.ma_san_pham}`} className="product">
                                        <div className="product-img-wrap" style={{ marginBottom: '8px' }}>
                                            <Link to={`/detail/${item.ma_san_pham}`} className="product-img product-img--small">
                                                <img className="product-img-1" src={item.anh_sanpham} alt="" />
                                                <img className="product-img-2" src={item.anhhover1} alt="" />
                                            </Link>
                                            <div className="product-size">
                                                <p>Thêm nhanh vào giỏ hàng +</p>
                                                <div className="btn btn--size">Thêm vào giỏ hàng</div>
                                            </div>
                                        </div>
                                        <div className='product-grid__reviews'>
                                            <div className='reviews-rating'>
                                               <div className='reviews-rating__vote'>{getRandomRating()}</div>
                                                <div className='reviews-rating__star'></div>
                                                <div className='reviews-rating__number'>({getRandomReviewCount()})</div>
                                            </div>
                                        </div>
                                        <div className="product-content">
                                            <div style={{ display: 'none' }} className="product-content__option ">
                                                <div className="product-content__option-item-wrap active">
                                                    <span data={item.mau_sac}></span>
                                                </div>
                                            </div>
                                            <a className="product-name">{item.ten_san_pham}</a>
                                            <div className="product-price-wrap">
                                                <div className="product-price">{formatCurrency(item.gia)}</div>
                                            </div>
                                            <div className="product-discount">
                                                {item.thongbao}
                                            </div>
                                            <div className="sale-tag product-tag">{item.sale}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                    </div>
                </div>
            </div>

                </section>
                
                <section className="homepage-basic">
                    <div className="homepage-basic__wrapper">
                        <div className="homepage-basic__content">
                            <h2>
                                Mua sắm cho căn bếp của bạn
                            </h2>

                            <a href="#" className="btn-primary"> Mua ngay</a>
                        </div>
                        <div className="homepage-basic__image">
                            <a href="#">
                                <picture style={{width: '100%'}}>
                                    <img  style={{width: '100%'}} src="../Images/Sukientubep.jpg" alt=""/>
                                </picture>
                            </a>
                        </div>
                    </div>
                </section>

                <section className="homepage-care-and-share">
                    <div className="container--full">
                        <div className="homepage-care-and-share__inner">
                            <a href="#">
                                <div className="homepage-care-and-share__image">
                                    <picture>
                                        <img src="../Images/care and share.png" alt=""/>
                                    </picture>
                                </div>
                                <div className="homepage-care-and-share__content">
                                    <picture>
                                        <img src="https://mcdn.coolmate.me/image/March2023/mceclip8.png" alt=""/>
                                    </picture>
                                    <h2>
                                        Góp phần mang lại <br/> cuộc sống tươi đẹp 
                                        <br className="mobile--hidden"/>
                                        hơn cho tụi nhỏ
                                    </h2>
                                    <div className="btn--primary"> Tìm hiểu thêm về Care&Share</div>
                                </div>
                            </a>
                        </div>
                    </div>
                    
                </section>

                <section className="homepage-hashtag">
                    <div className="container--full">
                        <div className="homepage-hashtag__inner">
                            <p className="homepage-hashtag__left">
                                Các mẫu bếp điện tử chính hãng, chất lượng cao, đáp ứng mọi nhu cầu nấu nướng từ gia đình đến chuyên nghiệp!
                                <br/>
                                Hơn 5 triệu khách hàng đã tin dùng và yêu thích!
                            </p>
                            <p className="homepage-hashtag__title">#BepDienTu</p>
                            <p className="homepage-hashtag__right">
                                Giải pháp nấu ăn thông minh
                                <br/>
                                Dành cho những người yêu bếp và đam mê sáng tạo món ngon
                            </p>
                        </div>
                    </div>
                </section>

                <section className="homepage-service">
                    <div className="container--full">
                        <div className="homepage-service__grid">
                            <div className="homepage-service__item">
                                <div className="infomation-card">
                                    <a href="#" className="infomation-card">
                                        <div className="infomation-card__thumbnail">
                                            <img src="../Images/Cauchuyenbep.jpg" alt=""/>
                                        </div>
                                        <div className="infomation-card__buttons">
                                            <span className="infomation-card__title">Câu chuyện về bếp </span>
                                            <span className="infomation-card__button">
                                                <i className="fa-solid fa-arrow-up fa-rotate-45"></i>
                                            </span>
                                        </div>
                                    </a>
                                </div>
                            </div>
                            <div className="homepage-service__item">
                                <div className="infomation-card">
                                    <a href="#" className="infomation-card">
                                        <div className="infomation-card__thumbnail">
                                            <img src="../Images/Bepdientu1.jpg" alt=""/>
                                        </div>
                                        <div className="infomation-card__buttons">
                                            <span className="infomation-card__title">Dịch vụ hài lòng 100% </span>
                                            <span className="infomation-card__button">
                                                <i className="fa-solid fa-arrow-up fa-rotate-45"></i>
                                            </span>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="homepage-service__list">
                                <div className="homepage-service__card">
                                    <p className="homepage-service__text">
                                        Miễn phí vận chuyển  
                                        <br />
                                        cho phụ kiện xe trên 500k
                                    </p>
                                </div>
                                <div className="homepage-service__card">
                                    <p className="homepage-service__text">
                                        Bảo hành chính hãng  
                                        <br />
                                        lên đến 24 tháng
                                    </p>
                                </div>
                                <div className="homepage-service__card">
                                    <p className="homepage-service__text">
                                        Hỗ trợ sửa chữa  
                                        <br />
                                        tận nơi nhanh chóng
                                    </p>
                                </div>
                                <div className="homepage-service__card">
                                    <p className="homepage-service__text">
                                        Tự hào cung cấp  
                                        <br />
                                        xe & phụ kiện chính hãng
                                    </p>
                                </div>
                            </div>

                        
                    </div>
                </section>
                
            </div>
        </Fragment>
  );
}
