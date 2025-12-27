import React, { Fragment, useEffect, useState } from 'react'
import ActiveCart, { LoadData } from '../../until/cartactive';
import axios from "axios";
import { useUser } from '../../until/userContext';
import { toast } from 'react-toastify';


export default function Cartpage() {

    ActiveCart();

    var list = JSON.parse(localStorage.getItem("cart")) || [];

    const { user } = useUser();
    const [coupons, setCoupons] = useState([]);
    const [updateTotalTrigger, setUpdateTotalTrigger] = useState(0);
    const [selectedPayment, setSelectedPayment] = useState("BuyLate");
    const [showATMModal, setShowATMModal] = useState(false);
    const [atmForm, setAtmForm] = useState({
        cardNumber: '',
        cardHolder: '',
        expiryDate: ''
    });
    const [atmLoading, setAtmLoading] = useState(false);

    const [state, setState] = useState({
        
        ten_khach_hang: '',
        sdt: '',
        dia_chi: '',
        tinh_thanh: '',
        quan_huyen: '',
        phuong_xa: '',
        ghi_chu: '',
        tong_tien:0
    });
         
    const { ten_khach_hang, sdt, dia_chi, tinh_thanh, quan_huyen, phuong_xa, ghi_chu,tong_tien } = state;
    
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setState({ ...state, [name]: value });
    };

    const handlePayment = (e) =>{
        e.preventDefault();

        if (!user) {
            alert("Vui lòng đăng nhập để đặt dịch vụ!");
            return;
        }

        // Validate thông tin giao hàng
        if (!ten_khach_hang || !sdt || !dia_chi || !tinh_thanh || !quan_huyen || !phuong_xa) {
            toast.error('Vui lòng nhập đầy đủ thông tin giao hàng!');
            return;
        }

        const paymentMethod = selectedPayment;

        // Nếu chọn ATM, mở modal nhập thẻ trước
        if(paymentMethod === "ATM"){
            setShowATMModal(true);
            return;
        }

    if(window.confirm("Xác nhận lại thông tin đơn hàng , xác nhận đặt hàng ?")){

    if(paymentMethod === "BuyLate"){
        const orderData = {
            ma_khach_hang: user.id, // Thay đổi giá trị này thành ID của khách hàng
            ngay_dat_hang: new Date().toLocaleDateString('en-CA'), // Lấy ngày hiện tại theo múi giờ local (YYYY-MM-DD)
            tong_tien: tong_tien, // Tổng tiền
            trang_thai: 1,
            ten_khach: ten_khach_hang,
            dia_chi: `${dia_chi}, ${phuong_xa}, ${quan_huyen}, ${tinh_thanh}`,
            ghi_chu: ghi_chu,
            sdt: sdt,
            loai_thanh_toan:paymentMethod,
            trang_thai_thanh_toan:1,
            email: user.username, // Email từ tài khoản đã đăng nhập để gửi email xác nhận
        
            chi_tiet_don_hang: list.map(item => ({
              ma_san_pham: Number(item.id),
              ten_san_pham: item.name, 
              so_luong: item.quantity,
              gia: item.price,
              anh_sanpham:item.img
            }))
        }
        console.log(orderData)
        axios.post("http://localhost:5000/api/addOrder", orderData)
        .then( () => {setState({ten_khach_hang :"",sdt:"",dia_chi:"",tinh_thanh:"",phuong_xa:"",quan_huyen:"",ghi_chu:""})
            list = [];
            localStorage.setItem("cart", JSON.stringify(list));
            
            // Xóa voucher đã sử dụng (nếu có)
            const usedVoucher = JSON.parse(localStorage.getItem('voucher_sale')) || {};
            if (usedVoucher.coupon_name && usedVoucher.coupon_name !== "novoucher") {
                removeUsedCoupon(usedVoucher.coupon_name);
            }
            
            const vocher = {coupon_name: "novoucher", value: 0}
            localStorage.setItem("voucher_sale", JSON.stringify(vocher));
            LoadData();
          alert("Bạn đã đặt hàng thành công");

        })
        .catch(error => {
          console.error(error);
          alert("Đã có lỗi xảy ra, vui lòng thử lại sau");
        });
    }

  }
}    
    useEffect(() => {
        const tongTienElement = document.querySelector('.btn-pay--price');
        if (tongTienElement) {
          const value = tongTienElement.innerText || tongTienElement.textContent;
          const numberValue = parseInt(value.replace(/[^\d]/g, ''), 10); // Loại bỏ các ký tự không phải số và chuyển đổi sang số nguyên
          setState((prevState) => ({ ...prevState, tong_tien: numberValue }));
        }
    }, [updateTotalTrigger]);
    console.log(tong_tien)


    useEffect(() => {
        // Load phiếu giảm giá từ localStorage - chỉ lấy của user đang đăng nhập
        const allCoupons = JSON.parse(localStorage.getItem('coupons')) || [];
        const userCoupons = user ? allCoupons.filter(c => c.id_user === user.id) : [];
        setCoupons(userCoupons);
        const vocher = {coupon_name: "novoucher", value: 0}
        localStorage.setItem("voucher_sale", JSON.stringify(vocher));
        LoadData();
     }, [user]);
    
    const handleSelectCoupon = (coupon) => {
        // Lấy danh sách sản phẩm trong giỏ hàng
        const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
        
        // Tính tổng tiền giỏ hàng
        const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Kiểm tra giá trị đơn hàng tối thiểu
        if (coupon.min_order_value && cartTotal < coupon.min_order_value) {
            toast.error(`Đơn hàng phải từ ${coupon.min_order_value.toLocaleString('vi-VN')}đ để áp dụng mã này!`, {
                position: "top-right",
                autoClose: 2000,
            });
            return;
        }
        
        // Kiểm tra loại sản phẩm (nếu có điều kiện)
        if (coupon.product_keyword) {
            const keywords = coupon.product_keyword.toLowerCase().split(',');
            const hasMatchingProduct = cartItems.some(item => {
                const productName = item.name.toLowerCase();
                return keywords.some(keyword => productName.includes(keyword.trim()));
            });
            
            if (!hasMatchingProduct) {
                toast.error(`Mã giảm giá này chỉ áp dụng cho sản phẩm: ${coupon.product_keyword}!`, {
                    position: "top-right",
                    autoClose: 2000,
                });
                return;
            }
        }
        
        // Nếu đủ điều kiện, áp dụng voucher
        const voucherData = {
            coupon_name: coupon.coupon_name,
            value: coupon.value,
        };
        localStorage.setItem("voucher_sale", JSON.stringify(voucherData));
        LoadData();
        setUpdateTotalTrigger(prev => prev + 1);
        toast.success(`Áp dụng mã "${coupon.coupon_name}" thành công!`, {
            position: "top-right",
            autoClose: 1000,
        });
    };

    // Xóa voucher đã sử dụng sau khi đặt hàng thành công
    const removeUsedCoupon = (usedCouponName) => {
        const allCoupons = JSON.parse(localStorage.getItem('coupons')) || [];
        const updatedCoupons = allCoupons.filter(
            c => !(c.coupon_name === usedCouponName && c.id_user === user.id)
        );
        localStorage.setItem("coupons", JSON.stringify(updatedCoupons));
        const userCoupons = updatedCoupons.filter(c => c.id_user === user.id);
        setCoupons(userCoupons);
    };
    
    const handlePaymentChange = (e) => {
        setSelectedPayment(e.target.value);
    };

    // Xử lý form ATM
    const handleATMInputChange = (e) => {
        const { name, value } = e.target;
        setAtmForm({ ...atmForm, [name]: value });
    };

    // Validate và xử lý thanh toán ATM
    const handleATMPayment = () => {
        const { cardNumber, cardHolder, expiryDate } = atmForm;

        // Danh sách thẻ test
        const testCards = {
            '9704198526191432198': { status: 'success', name: 'NGUYEN VAN A', expiry: '07/15' },
            '9704195798459170488': { status: 'insufficient', name: 'NGUYEN VAN A', expiry: '07/15' },
            '9704192181368742': { status: 'inactive', name: 'NGUYEN VAN A', expiry: '07/15' }
        };

        // Validate thông tin thẻ
        if (!cardNumber || !cardHolder || !expiryDate) {
            toast.error('Vui lòng nhập đầy đủ thông tin thẻ!');
            return;
        }

        const card = testCards[cardNumber.replace(/\s/g, '')];
        
        if (!card) {
            toast.error('Số thẻ không hợp lệ!');
            return;
        }

        if (cardHolder.toUpperCase() !== card.name) {
            toast.error('Tên chủ thẻ không khớp!');
            return;
        }

        if (expiryDate !== card.expiry) {
            toast.error('Ngày phát hành không đúng!');
            return;
        }

        // Kiểm tra trạng thái thẻ
        if (card.status === 'insufficient') {
            toast.error('Thẻ không đủ số dư để thanh toán!');
            return;
        }

        if (card.status === 'inactive') {
            toast.error('Thẻ chưa được kích hoạt. Vui lòng liên hệ ngân hàng!');
            return;
        }

        // Thanh toán thành công
        setAtmLoading(true);
        
        setTimeout(() => {
            // Tạo đơn hàng
            const orderData = {
                ma_khach_hang: user.id,
                ngay_dat_hang: new Date().toLocaleDateString('en-CA'),
                tong_tien: tong_tien,
                trang_thai: 1,
                ten_khach: ten_khach_hang,
                dia_chi: `${dia_chi}, ${phuong_xa}, ${quan_huyen}, ${tinh_thanh}`,
                ghi_chu: ghi_chu,
                sdt: sdt,
                loai_thanh_toan: 'ATM',
                trang_thai_thanh_toan: 2,
                email: user.username, // Email từ tài khoản đã đăng nhập để gửi email xác nhận
                chi_tiet_don_hang: list.map(item => ({
                    ma_san_pham: Number(item.id),
                    ten_san_pham: item.name,
                    so_luong: item.quantity,
                    gia: item.price,
                    anh_sanpham: item.img
                }))
            };

            axios.post("http://localhost:5000/api/addOrder", orderData)
                .then(() => {
                    setState({ ten_khach_hang: "", sdt: "", dia_chi: "", tinh_thanh: "", phuong_xa: "", quan_huyen: "", ghi_chu: "" });
                    localStorage.setItem("cart", JSON.stringify([]));
                    
                    const usedVoucher = JSON.parse(localStorage.getItem('voucher_sale')) || {};
                    if (usedVoucher.coupon_name && usedVoucher.coupon_name !== "novoucher") {
                        removeUsedCoupon(usedVoucher.coupon_name);
                    }
                    
                    localStorage.setItem("voucher_sale", JSON.stringify({ coupon_name: "novoucher", value: 0 }));
                    LoadData();
                    
                    setShowATMModal(false);
                    setAtmForm({ cardNumber: '', cardHolder: '', expiryDate: '' });
                    setAtmLoading(false);
                    
                    toast.success('Thanh toán thành công! Cảm ơn bạn đã mua hàng.');
                })
                .catch(error => {
                    console.error(error);
                    setAtmLoading(false);
                    toast.error('Đã có lỗi xảy ra, vui lòng thử lại sau');
                });
        }, 2000);
    };

    // Đóng modal ATM
    const closeATMModal = () => {
        setShowATMModal(false);
        setAtmForm({ cardNumber: '', cardHolder: '', expiryDate: '' });
    };

  return (
    <Fragment>
        <div className="main">

                {/* <!-- Phần container --> */}
                <div className="cartPage-container">
                    <form className="info">
                        <div className="info-header">
                            <h2>Thông tin vận chuyển</h2>
                        </div>
                        <div className="row info-body">
                            <div className="col p-6">
                                <input className="input-name"name="ten_khach_hang" onChange={handleInputChange} value={ten_khach_hang} placeholder="Họ tên" type="text" />
                            </div>
                            <div className="col p-6">
                                <input className="input-phone" name="sdt" onChange={handleInputChange} value={sdt} placeholder="Số điện thoại" type="text"/>
                            </div>
                            <div className="col p-12">
                                <input className="input-adress" name="dia_chi" onChange={handleInputChange} value={dia_chi} placeholder="Địa chỉ" type="text"/>
                            </div>
                            <div className="adress col p-4">
                                <select onChange={handleInputChange} value={tinh_thanh} name="tinh_thanh">
                                    <option value="">Chọn Tỉnh/Thành Phố</option>
                                    <option value="TP. Cần Thơ">TP. Cần Thơ</option>
                                    <option value="An Giang">An Giang</option>
                                    <option value="Bạc Liêu">Bạc Liêu</option>
                                    <option value="Bến Tre">Bến Tre</option>
                                    <option value="Cà Mau">Cà Mau</option>
                                    <option value="Đồng Tháp">Đồng Tháp</option>
                                    <option value="Hậu Giang">Hậu Giang</option>
                                    <option value="Kiên Giang">Kiên Giang</option>
                                    <option value="Long An">Long An</option>
                                    <option value="Sóc Trăng">Sóc Trăng</option>
                                    <option value="Tiền Giang">Tiền Giang</option>
                                    <option value="Trà Vinh">Trà Vinh</option>
                                    <option value="Vĩnh Long">Vĩnh Long</option>
                                </select>
                            </div>
                            <div className="adress col p-4">
                                <select onChange={handleInputChange} value={quan_huyen} name="quan_huyen">
                                    <option value="">Chọn Quận/Huyện</option>
                                    <option value="Ninh Kiều">Ninh Kiều</option>
                                    <option value="Bình Thủy">Bình Thủy</option>
                                    <option value="Cái Răng">Cái Răng</option>
                                    <option value="Ô Môn">Ô Môn</option>
                                    <option value="Thốt Nốt">Thốt Nốt</option>
                                    <option value="Phong Điền">Phong Điền</option>
                                    <option value="Cờ Đỏ">Cờ Đỏ</option>
                                    <option value="Vĩnh Thạnh">Vĩnh Thạnh</option>
                                    <option value="Thới Lai">Thới Lai</option>
                                    <option value="Long Xuyên">Long Xuyên</option>
                                    <option value="Châu Đốc">Châu Đốc</option>
                                    <option value="Cao Lãnh">Cao Lãnh</option>
                                    <option value="Sa Đéc">Sa Đéc</option>
                                    <option value="Mỹ Tho">Mỹ Tho</option>
                                    <option value="Rạch Giá">Rạch Giá</option>
                                </select>
                            </div>
                            <div className="adress col p-4">
                                <select onChange={handleInputChange} value={phuong_xa} name="phuong_xa">
                                    <option value="">Chọn Phường/Xã</option>
                                    <option value="Phường An Hòa">Phường An Hòa</option>
                                    <option value="Phường An Nghiệp">Phường An Nghiệp</option>
                                    <option value="Phường An Cư">Phường An Cư</option>
                                    <option value="Phường An Bình">Phường An Bình</option>
                                    <option value="Phường An Phú">Phường An Phú</option>
                                    <option value="Phường Xuân Khánh">Phường Xuân Khánh</option>
                                    <option value="Phường Hưng Lợi">Phường Hưng Lợi</option>
                                    <option value="Phường Cái Khế">Phường Cái Khế</option>
                                    <option value="Phường Tân An">Phường Tân An</option>
                                    <option value="Phường An Lạc">Phường An Lạc</option>
                                    <option value="Xã Mỹ Khánh">Xã Mỹ Khánh</option>
                                    <option value="Xã Giai Xuân">Xã Giai Xuân</option>
                                </select>
                            </div>
                            <div className="col p-12">
                                <input onChange={handleInputChange} value={ghi_chu} name="ghi_chu" className="input-adress" placeholder="Ghi chú thêm" type="text"/>
                            </div>
                        </div>
                        <div className="payments">
                            <h2 className="payments">Hình thức thanh toán
                            </h2>
                            <div className={`payments-item ${(selectedPayment === "BuyLate") ? "active" : ""}`}>
                                    <input
                                    type="radio"
                                    className="check"
                                    name="paymentMethod" // Group name cho các radio
                                    value="BuyLate"
                                    onClick={handlePaymentChange}
                                    />
                                    <img style={{height:'25px',width:'25px',marginRight:"60px"}} src="https://sohala.vn/upload/news/thanh-toan-khi-nhan-hang-6272.jpg" alt="" />
                                    <p className="payments-item__text">Thanh toán sau</p>
                                </div>

                                {/* ATM trực tiếp */}
                                <div className={`payments-item ${(selectedPayment === "ATM") ? "active" : ""}`}>
                                    <input
                                    type="radio"
                                    className="check"
                                    name="paymentMethod"
                                    value="ATM"
                                    onClick={handlePaymentChange}
                                    />
                                    <img
                                    style={{ width: "45px", marginRight: "10px" }}
                                    src="https://img.icons8.com/color/96/bank-card-back-side.png"
                                    alt=""
                                    />
                                    <div className="payments-item__text">
                                    <p>Thanh toán thẻ ATM nội địa</p>
                                    <p>Hỗ trợ NCB, Vietcombank, BIDV, Agribank...</p>
                                    </div>
                                </div>
                            <p style={{paddingLeft: '5px'}}>Nếu bạn không hài lòng với sản phẩm của chúng tôi? Bạn hoàn toàn có thể trả lại sản phẩm. Tìm hiểu thêm <a style={{fontWeight:'700'}} href="">tại đây</a>.</p>
                            <button type="button" onClick={handlePayment} className="btn-pay">Thanh toán <span className="btn-pay--price"></span>(<span className="type-payment">{selectedPayment === "ATM" ? "ATM" : selectedPayment === "BuyLate" ? "COD" : "Online"}</span>)</button>
                        </div>
                    </form>

                    {/* <!-- tạo khuôn đổ dữ liệu --> */}
                    <div className="list-product">
                        <div className="list-product__inner">
                            <h2>Giỏ hàng</h2>
                            <div className="list-product__item">
                                    <div className="list-product__item-img">
                                    <img src="https://media.coolmate.me/uploads/March2022/tshirtxcool-4-copy_160x181.jpg" alt=""/>
                                    </div>

                                    <div className="list-product__item-content">
                                    <div className="list-product__item-name">Áo thun cổ tròn Excool</div>
                                    <div className="list-product__item-type">Đen/L</div>
                                    <div style={{display:'flex', justifyContent: 'flex-start', margin: '28px 0 6px'}} className="">
                                        <div className="single-product-color single-product-select">
                                            <span>Đen</span>
                                            <i className="fa-solid fa-angle-down"></i>
                                        </div>
                                        <div className="single-product-size single-product-select">
                                            <span>L</span>
                                            <i className="fa-solid fa-angle-down"></i>
                                        </div >                          
                                    </div>
                                    <div style={{display:'flex',justifyContent: 'space-between',alignItems: 'center'}}>  
                                        <div className="quantity-product">
                                            <button>
                                                <svg data-v-0d8807a2="" width="16" height="16" xmlns="http://www.w3.org/2000/svg"><g data-v-0d8807a2=""><line data-v-0d8807a2="" stroke-width="1.5" id="svg_6" y2="8" x2="10" y1="8" x1="5" stroke="#000000" fill="none"></line></g></svg>
                                            </button>
                                            <span>1</span>
                                            <button>
                                                <svg data-v-0d8807a2="" width="16" height="16" xmlns="http://www.w3.org/2000/svg"><g data-v-0d8807a2=""><line data-v-0d8807a2="" stroke-width="1.5" y2="8" x2="12.9695" y1="8" x1="3.0305" stroke="#000000" fill="none"></line> <line data-v-0d8807a2="" stroke-width="1.5" transform="rotate(90, 8, 8)" y2="8" x2="13" y1="8" x1="3" stroke="#000000" fill="none"></line></g></svg>
                                            </button>
                                        </div>
                                        <div className="product-price">
                                            <div className="product-new-price">254.000đ</div>
                                            <div className="product-old-price">299.000đ</div>
                                        </div>
                                    </div>
                                    <div className="list-product__close">
                                        <i className="fa-solid fa-xmark"></i>
                                    </div>
                                </div>
                                </div>
                                
                                
                            </div>   
                        <div className='cart-viewing-users mgt--10'>
                            <i>
                                <span>Có </span>
                                <b>5</b>
                                <span> người đang thêm cùng sản phẩm giống bạn vào giỏ hàng.</span>
                            </i>
                        </div>
                          <div className='discount-block'>
                             <div className="coupon-container">
                             {coupons.map((coupon, index) => (
                                <div className="coupon-card" key={index}>
                                    <div className="coupon-header">
                                        <span className="coupon-code">{coupon.coupon_name}</span>
                                        <span className="coupon-remaining">(Còn {coupon.remaining_count})</span>
                                    </div>
                                    <div className="coupon-description">
                                        <p>{coupon.description}</p>
                                        <p style={{ display: "none" }}>{coupon.value}</p>
                                    </div>
                                    <div className="coupon-footer">
                                        <span>HSD: {coupon.expiry_date}</span>
                                        <a href="#" className="coupon-conditions">{coupon.conditions}</a>
                                    </div>
                                    <div className="coupon-radio">
                                        <input onClick={() => handleSelectCoupon(coupon)} type="radio" name="coupon-select" />   
                                    </div>
                                </div>
                            ))}
                            </div>  
                              <div className='discount-box'>
                                    <input data-v-48bbe076 type="text"  placeholder='Nhập mã giảm giá'/>
                                    <button data-v-48bbe076 disabled = "disabled"> Áp dụng</button>
                              </div>
                              <div className='discount-block'>
                                <p className='discount-heading mb-4'>
                                    Sử dụng Voucher

                                    <span>
                                        <img src="https://mcdn.coolmate.me/image/April2023/mceclip0_92.png" alt="" />
                                        <button className='text-gray-light cursor-pointer btn-gray'>Nhập mã</button>
                                    </span>
                                </p>
                              </div>
                              
                        </div>
                        <div style={{    marginTop: '10px'}} className="cost-detail">
                            <span>Tạm tính</span>
                            <span className="tamTinh"></span>
                        </div>
                        <div className="cost-detail">
                            <span>Giảm giá</span>
                            <span className="sale-off">0đ</span>
                        </div>
                        <div className="cost-detail">
                            <span>Phí giao hàng</span>
                            <span className="delever-cost">Miễn phí</span>
                        </div>
                        <div className="total">
                            <span>Tổng</span>
                            <span className="total__price"></span>
                        </div>        
                        </div>
                       
                    </div>
                    
                </div>

                {/* Modal thanh toán ATM */}
                {showATMModal && (
                    <div className="atm-modal-overlay" style={{
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
                        <div className="atm-modal" style={{
                            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                            borderRadius: '20px',
                            padding: '30px',
                            width: '450px',
                            maxWidth: '95%',
                            boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
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
                                    <i className="fa-solid fa-credit-card" style={{ fontSize: '24px', color: 'white' }}></i>
                                </div>
                                <h2 style={{ color: 'white', margin: 0, fontSize: '22px' }}>
                                    Thanh toán thẻ ATM
                                </h2>
                                <p style={{ color: '#8892b0', margin: '8px 0 0', fontSize: '14px' }}>
                                    Nhập thông tin thẻ ngân hàng của bạn
                                </p>
                            </div>

                            {/* Số tiền thanh toán */}
                            <div style={{
                                background: 'rgba(102, 126, 234, 0.1)',
                                border: '1px solid rgba(102, 126, 234, 0.3)',
                                borderRadius: '12px',
                                padding: '15px',
                                marginBottom: '20px',
                                textAlign: 'center'
                            }}>
                                <span style={{ color: '#8892b0', fontSize: '13px' }}>Số tiền thanh toán</span>
                                <div style={{ color: '#667eea', fontSize: '28px', fontWeight: '700' }}>
                                    {tong_tien.toLocaleString('vi-VN')}đ
                                </div>
                            </div>

                            {/* Form nhập thông tin thẻ */}
                            <div>
                                {/* Ngân hàng */}
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ color: '#8892b0', fontSize: '13px', display: 'block', marginBottom: '6px' }}>
                                        Ngân hàng
                                    </label>
                                    <select style={{
                                        width: '100%',
                                        padding: '14px 16px',
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '10px',
                                        color: 'white',
                                        fontSize: '15px',
                                        outline: 'none'
                                    }}>
                                        <option value="NCB" style={{ background: '#1a1a2e' }}>NCB - Ngân hàng Quốc Dân</option>
                                        <option value="VCB" style={{ background: '#1a1a2e' }}>Vietcombank</option>
                                        <option value="BIDV" style={{ background: '#1a1a2e' }}>BIDV</option>
                                        <option value="AGR" style={{ background: '#1a1a2e' }}>Agribank</option>
                                    </select>
                                </div>

                                {/* Số thẻ */}
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ color: '#8892b0', fontSize: '13px', display: 'block', marginBottom: '6px' }}>
                                        Số thẻ
                                    </label>
                                    <input
                                        type="text"
                                        name="cardNumber"
                                        value={atmForm.cardNumber}
                                        onChange={handleATMInputChange}
                                        placeholder="Nhập số thẻ ATM"
                                        style={{
                                            width: '100%',
                                            padding: '14px 16px',
                                            background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '10px',
                                            color: 'white',
                                            fontSize: '15px',
                                            outline: 'none',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>

                                {/* Tên chủ thẻ */}
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ color: '#8892b0', fontSize: '13px', display: 'block', marginBottom: '6px' }}>
                                        Tên chủ thẻ
                                    </label>
                                    <input
                                        type="text"
                                        name="cardHolder"
                                        value={atmForm.cardHolder}
                                        onChange={handleATMInputChange}
                                        placeholder="VD: NGUYEN VAN A"
                                        style={{
                                            width: '100%',
                                            padding: '14px 16px',
                                            background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '10px',
                                            color: 'white',
                                            fontSize: '15px',
                                            outline: 'none',
                                            textTransform: 'uppercase',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>

                                {/* Ngày phát hành */}
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ color: '#8892b0', fontSize: '13px', display: 'block', marginBottom: '6px' }}>
                                        Ngày phát hành (MM/YY)
                                    </label>
                                    <input
                                        type="text"
                                        name="expiryDate"
                                        value={atmForm.expiryDate}
                                        onChange={handleATMInputChange}
                                        placeholder="VD: 07/15"
                                        maxLength="5"
                                        style={{
                                            width: '100%',
                                            padding: '14px 16px',
                                            background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '10px',
                                            color: 'white',
                                            fontSize: '15px',
                                            outline: 'none',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Buttons */}
                            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                                <button
                                    onClick={closeATMModal}
                                    style={{
                                        flex: 1,
                                        padding: '14px',
                                        background: 'rgba(255,255,255,0.1)',
                                        border: 'none',
                                        borderRadius: '10px',
                                        color: 'white',
                                        fontSize: '15px',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleATMPayment}
                                    disabled={atmLoading}
                                    style={{
                                        flex: 2,
                                        padding: '14px',
                                        background: atmLoading 
                                            ? 'rgba(102, 126, 234, 0.5)' 
                                            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        border: 'none',
                                        borderRadius: '10px',
                                        color: 'white',
                                        fontSize: '15px',
                                        fontWeight: '600',
                                        cursor: atmLoading ? 'not-allowed' : 'pointer',
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    {atmLoading ? (
                                        <span>
                                            <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
                                            Đang xử lý...
                                        </span>
                                    ) : 'Xác nhận thanh toán'}
                                </button>
                            </div>

                            {/* Security note */}
                            <div style={{
                                marginTop: '20px',
                                padding: '12px',
                                background: 'rgba(255,255,255,0.03)',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <i className="fa-solid fa-shield-halved" style={{ color: '#667eea' }}></i>
                                <span style={{ color: '#8892b0', fontSize: '12px' }}>
                                    Giao dịch được bảo mật bởi SSL 256-bit
                                </span>
                            </div>

                            {/* Close button */}
                            <button
                                onClick={closeATMModal}
                                style={{
                                    position: 'absolute',
                                    top: '15px',
                                    right: '15px',
                                    background: 'rgba(255,255,255,0.1)',
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
                                <i className="fa-solid fa-xmark" style={{ color: 'white' }}></i>
                            </button>
                        </div>
                    </div>
                )}
    </Fragment>
  );
}
