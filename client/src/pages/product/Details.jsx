import React, { Fragment, useEffect, useState } from 'react'
import Payment from '../../until/detail';
import AddProduct from '../../until/cart';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function Details() {
    Payment();
    AddProduct();

    const [sanpham ,setData] = useState({});
    
    const{ma_san_pham} = useParams();

    useEffect(()=>{
        axios.get(`http://localhost:5000/api/getsp/${ma_san_pham}`)
        .then((resp) => setData({...resp.data[0]}));
    },[ma_san_pham]);

    const formatCurrency = (number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
    };  

    // Hàm xử lý đường dẫn ảnh
    const getImageUrl = (imagePath) => {
        if (!imagePath) return '';
        if (imagePath.startsWith('http')) return imagePath;
        return `http://localhost:5000${imagePath}`;
    };

  return (
    <Fragment>
        <main>
            <div class="container1">
            <div class="container-product-single">
                    <div class="imgs">
                        <div class="link-page">
                            <a href="./index.html" class="link-page__homepage">Trang chủ</a>
                            <span>/</span>
                            <a href="./product-detail.html" class="link-page__currentPage">Sản phẩm</a>
                        </div>
                        <div class="index-img">
                            <div class="index-img__item active"></div>
                            <div class="index-img__item"></div>
                            <div class="index-img__item"></div>
                        </div>
                        <div class="product-single-img">
                            <img class="product-img__main" src={getImageUrl(sanpham.anh_sanpham)} alt=""/>
                            <div class="product-img__option">
                                <div  class="product-img__option-item active">
                                    <img src={getImageUrl(sanpham.anh_sanpham)} alt=""/>
                                </div>
                                <div  class="product-img__option-item active">
                                    <img src={getImageUrl(sanpham.anhhover1)} alt=""/>
                                </div>
                                <div class="product-img__option-item">
                                    <img src={getImageUrl(sanpham.anhhover2)} alt=""/>
    
                                </div>                                                   
                            </div>
                        </div>
                    </div>
                    <div class="content">
                        <h1 class="content__heading">{sanpham.ten_san_pham}</h1>
                        <div class="review-rating">
                            <p class="review-label">
                                Đã bán(web): 15
                            </p>  
                                              
                        </div>
                        <div class="review-rating">
                            <p class="review-label">
                                Số lượng còn: <span class="product-quantity">{sanpham.soluong}</span> sản phẩm
                            </p>  
                        </div>

                        <p class="content__price">{formatCurrency(sanpham.gia)}</p>
                        <div class="content__discount">{sanpham.thongbao}</div>
                        {/* <div class="content__color">
                            <p class="content__color-heading">Màu sắc: <b>Đen</b></p>
                            <div class="content__color-option">
                                <div class="content__color-item active" title='{"color":"Hồng Nhạt","disabled":["36","40","42"]}' >
                                    <div style={{backgroundImage: 'url(https://media3.coolmate.me/cdn-cgi/image/width=160,height=160,quality=80,format=auto/uploads/January2024/mau23CMAW.AT003.8_31.jpg)'}}></div>
                                </div>
                                <div class="content__color-item active" title='{"color":"Trắng","disabled":["36","43","44"]}' >
                                <div   div style={{backgroundImage: 'url(https://media3.coolmate.me/cdn-cgi/image/width=160,height=160,quality=80,format=auto/uploads/October2023/promaxs3_trangg_8.jpg)'}}></div>
                                </div>
                                <div class="content__color-item active" title='{"color":"Xanh Rêu","disabled":["36,40,42"]}' >
                                    <div style={{backgroundImage: 'url(https://media3.coolmate.me/cdn-cgi/image/width=160,height=160,quality=80,format=auto/uploads/January2024/mau23CMAW.AT003.17_62.jpg)'}}></div>
                                </div>
                                <div class="content__color-item active" title='{"color":"Đen","disabled":["36,40,42"]}' >
                                    <div style={{backgroundImage: 'url(https://media3.coolmate.me/cdn-cgi/image/width=160,height=160,quality=80,format=auto/uploads/January2024/mau23CMAW.AT003.23.jpg)'}}></div>
                                </div>
                                <div class="content__color-item active" title='{"color":"Xanh","disabled":["36,40,42"]}' >
                                    <div style={{backgroundImage: 'url(https://media3.coolmate.me/cdn-cgi/image/width=160,height=160,quality=80,format=auto/uploads/March2024/promax_aqua.jpg)'}}></div>
                                </div>
                            </div>
                        </div> */}
                        <div class="content__size">
                            {/* <div class="content__size-header">
                                <span>Kích thước phân khối:(cc)</span>
                            </div>
                            <div class="content__size-option">
                                <div class="btn-size size-36">150</div>
                                <div class="btn-size size-37">350</div>
                                <div class="btn-size size-38">650</div>
                                <div class="btn-size size-43 is-disabled">1000</div>
                                <div class="btn-size size-44 is-disabled">1250</div>
                                </div> */}

                            <div class="product-single__actions">
                                <div class="quantity">
                                    
                                    <button class="btn-decrease">-</button>
                                    <span>1</span>
                                    <button class="btn-increase">+</button>
                                </div>
                                <div class="btn btn-addCart">
                                    Thêm vào giỏ hàng
                                </div>
                            </div>
                        </div>
                        <div class="product-single__policy">
                            <div class="product-policy__item">
                                <div class="product-policy__icon">
                                    <img src="https://www.coolmate.me/images/icons/icon3.svg" alt=""/>
                                </div>
                                <p>Đổi trả cực dễ chỉ cần số điện thoại</p>
                            </div>
                            <div class="product-policy__item">
                                <div class="product-policy__icon">
                                    <img src="https://www.coolmate.me/images/icons/icon4.svg" alt=""/>
                                </div>
                                <p>Miễn phí vận chuyển cho đơn hàng trên 200k</p>
                            </div>
                            <div class="product-policy__item">
                                <div class="product-policy__icon">
                                    <img src="https://www.coolmate.me/images/icons/icon5.svg" alt=""/>
                                </div>
                                <p>60 ngày đổi trả vì bất kỳ lý do gì</p>
                            </div>
                            <div class="product-policy__item">
                                <div class="product-policy__icon">
                                    <img src="https://www.coolmate.me/images/icons/icon2.svg" alt=""/>
                                </div>
                                <p>Hotline 1900.27.27.37 hỗ trợ từ 8h30 - 22h mỗi ngày</p>
                            </div>
                            <div class="product-policy__item">
                                <div class="product-policy__icon">
                                    <img src="https://www.coolmate.me/images/icons/icon1.svg" alt=""/>
                                </div>
                                <p>Đến tận nơi nhận hàng trả, hoàn tiền trong 24h</p>
                            </div>
                            <div class="product-policy__item">
                                <div class="product-policy__icon">
                                    <img src="https://www.coolmate.me/images/icons/icon6.svg" alt=""/>
                                </div>
                                <p>Giao hàng 2-5 ngày(có thể lâu hơn do Covid19)</p>
                            </div>
                        </div>

                    </div>                    
                </div>

                <div className="detail-wrap">
                <div className="compare-container">
                    <div className="detail">
                         <div className="detail__header-row">
                            <h2 className="detail__heading">Chi tiết sản phẩm</h2>
                         </div>
                            <div className="product-header">
                                <img
                                src={getImageUrl(sanpham.anh_sanpham)}
                                alt={sanpham.ten_san_pham}
                                className="product-image"
                                style={{width:"100px",height:"70px"}}
                                />
                                <div className="product-info">
                                <h2 className="product-name">{sanpham.ten_san_pham}</h2>
                                <p className="product-price">Giá: {formatCurrency(sanpham.gia)}</p>
                                </div>
                            </div>
                            <div className="dongco-wrapper">
                                <div className="dongco-title">
                                    <span>Thông số</span>
                                    <div className="dongco-line"></div>
                                </div>
                                <table className="dongco-table">
                                    <tbody>
                                      <tr><td>Thương hiệu</td><td>{sanpham.thuong_hieu}</td></tr>
                                      <tr><td>Model</td><td>{sanpham.model}</td></tr>
                                      <tr><td>Công suất</td><td>{sanpham.cong_suat}</td></tr>
                                      <tr><td>Điện áp</td><td>{sanpham.dien_ap}</td></tr>
                                      <tr><td>Chất liệu</td><td>{sanpham.chat_lieu}</td></tr>
                                      <tr><td>Kích thước</td><td>{sanpham.kich_thuoc}</td></tr>
                                      <tr><td>Trọng lượng</td><td>{sanpham.trong_luong}</td></tr>
                                      <tr><td>Bảo hành</td><td>{sanpham.bao_hanh}</td></tr>
                                      <tr><td>Xuất xứ</td><td>{sanpham.xuat_xu}</td></tr>
                                                              </tbody>
                                </table>
                        </div>
                    </div>
                    
                    {/* Phần mô tả sản phẩm */}
                    <div className="detail-2">
                        <h2 className="detail__heading" style={{ marginBottom: '20px' }}>Mô tả sản phẩm</h2>
                        <div className="dongco-wrapper">
                            <div className="dongco-title">
                                <span>Mô tả chi tiết</span>
                                <div className="dongco-line"></div>
                            </div>
                            <div style={{ 
                                padding: '20px', 
                                backgroundColor: '#f9f9f9', 
                                borderRadius: '8px',
                                lineHeight: '1.8',
                                fontSize: '15px',
                                color: '#333',
                                whiteSpace: 'pre-wrap'
                            }}>
                                {sanpham.mo_ta || 'Chưa có mô tả cho sản phẩm này.'}
                            </div>
                        </div>
                    </div>
                </div>

                    </div>

                    <div class="feedback">
  <div class="review-title">
    <p class="quantity-review">966 Đánh giá</p>
    <div class="quantity-star">
      <span>4.8 / 5</span>
      <i class="fa-solid fa-star"></i>
    </div>
  </div>

  <div class="review-fillter">
    <div class="review-fillter__rating">
      <select name="" id="">
        <option value="">Đánh giá</option>
        <option value="1">1 sao</option>
        <option value="2">2 sao</option>
        <option value="3">3 sao</option>
        <option value="4">4 sao</option>
        <option value="5">5 sao</option>
      </select>
    </div>
    <div class="review-filter__image">
      <select name="" id="">
        <option value="">Ảnh</option>
        <option value="true">Có ảnh</option>
        <option value="false">Không ảnh</option>
      </select>
    </div>
    <div class="review-filter__replied">
      <select name="" id="">
        <option value="">Phản hồi</option>
        <option value="true">Đã phản hồi</option>
        <option value="false">Chưa phản hồi</option>
      </select>
    </div>
  </div>

  <div class="feedback-content">
    <div class="row no-gutters">
      <div class="col p-6">
        <div class="feedback-item">
          <div class="feedback-item__rating">
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star disabled"></i>
          </div>
          <div class="feedback-item__body">
            <b class="feedback-userName">Trần Minh Quân</b>
            <i class="feedback-product-type">Bếp điện từ đôi / Model BEP-2024</i>
            <p class="feedback-of-custom">Bếp nấu nhanh, tiết kiệm điện, mặt kính dễ lau chùi. Thiết kế nhìn sang trọng nữa!</p>
            <p class="feedback-time">08.05.2023</p>
          </div>
        </div>
      </div>

      <div class="col p-6">
        <div class="feedback-item">
          <div class="feedback-item__rating">
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
          </div>
          <div class="feedback-item__body">
            <b class="feedback-userName">Nguyễn Văn Thắng</b>
            <i class="feedback-product-type">Bếp điện từ đơn / Model BEP-1500</i>
            <p class="feedback-of-custom">Bếp nhỏ gọn, phù hợp căn hộ. Nấu nhanh, không bị nóng xung quanh, rất đáng tiền.</p>
            <p class="feedback-time">08.05.2023</p>
          </div>
        </div>
      </div>

      <div class="col p-6">
        <div class="feedback-item">
          <div class="feedback-item__rating">
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star disabled"></i>
          </div>
          <div class="feedback-item__body">
            <b class="feedback-userName">Phạm Ngọc Hà</b>
            <i class="feedback-product-type">Bếp điện hồng ngoại / Model BEP-HN100</i>
            <p class="feedback-of-custom">Bếp nấu ổn, có thể dùng với mọi loại nồi. Hơi tiếc là quạt tản nhiệt hơi ồn một chút.</p>
            <p class="feedback-time">08.05.2023</p>
          </div>
        </div>
      </div>

      <div class="col p-6">
        <div class="feedback-item">
          <div class="feedback-item__rating">
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
          </div>
          <div class="feedback-item__body">
            <b class="feedback-userName">Lê Nhật Tân</b>
            <i class="feedback-product-type">Bếp điện từ đôi / Màu Đen bóng</i>
            <p class="feedback-of-custom">Bếp đun rất nhanh, bảng điều khiển cảm ứng nhạy, dễ sử dụng. Giá hợp lý, rất hài lòng!</p>
            <p class="feedback-time">08.05.2023</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="feedback-page">
    <i class="fa-solid fa-angle-left btn-page-left"></i>
    <span>1/19</span>
    <i class="fa-solid fa-angle-right btn-page-right"></i>
  </div>
</div>

            </div>
        </main>
    </Fragment>
  );
}
