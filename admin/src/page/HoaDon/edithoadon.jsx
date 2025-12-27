import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

  const initiaState = {
    ten_khach :"",
    ngay_dat_hang:"",
    tong_tien:"",
    trang_thai:"",
    dia_chi:"",
    ghi_chu:"",
    sdt:"",
    ma_nhan_vien:"",
    loai_thanh_toan:"",
    trang_thai_thanh_toan:""
};

export default function EditHD() {

  const [state, setState] = useState(initiaState);


  const{ten_khach , ngay_dat_hang, tong_tien, trang_thai, dia_chi ,ghi_chu ,sdt,ma_nhan_vien,loai_thanh_toan,trang_thai_thanh_toan } = state;

  const {ma_don_hang} = useParams();

  const navigate = useNavigate();


  useEffect(()=>{
    loadDataNV();
    axios.get(`http://localhost:5000/api/gethd/${ma_don_hang}`)
    .then((resp) => setState({...resp.data[0]}));
  },[ma_don_hang]);

    const[datanv,setDataNV] = useState([]);

const loadDataNV = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/getallnv");
    const data = response.data;

    setDataNV(data); // Gán danh sách nhân viên từ API

    const exists = data.some(nv => nv.ma_nhan_vien === parseInt(state.ma_nhan_vien));
    if (!exists) {
      setState(prev => ({
        ...prev,
        ma_nhan_vien: ''
      }));
    }

  } catch (error) {
    console.error("Lỗi khi load dữ liệu nhân viên:", error);
  }
};


  
  const handleInputChange = (e) =>{
    const{name, value} = e.target;
    setState({...state,[name]:value});
  }
  
  const handleSubmit = (e) => {
    e.preventDefault();
  
    if(!trang_thai){
      toast.error("Vui lòng nhập đầy đủ thông tin");
  
    } else{
      if(window.confirm("Bạn có muốn cập nhật thông tin  ?")){
            
      axios.put(`http://localhost:5000/api/updatehd/${ma_don_hang}`,{
       trang_thai,ma_nhan_vien,loai_thanh_toan,trang_thai_thanh_toan
      }).then(()=>{
        setState({trang_thai:""})
      }).catch((err) => toast.error(err.response.data));
      toast.success("Sửa hóa đơn thành công !")
      setTimeout(() => navigate("/Indexhd"),500);
      }

    }
  }
const formatVND = (number) => {
  if (typeof number !== 'number' || isNaN(number)) return '0 ₫';
  return number.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};

// Hàm in đơn hàng
const handlePrintOrder = () => {
  const getTrangThaiText = (tt) => {
    const map = { 1: 'Chờ duyệt', 2: 'Đã duyệt', 3: 'Đang giao', 4: 'Đã giao thành công' };
    return map[tt] || 'Không xác định';
  };

  const getThanhToanText = () => {
    if (trang_thai_thanh_toan === 2) {
      if (loai_thanh_toan === 'ATM') return 'Đã thanh toán (Thẻ ATM)';
      if (loai_thanh_toan === 'VnPay') return 'Đã thanh toán (VnPay)';
      return 'Đã thanh toán (Tiền mặt)';
    }
    return 'Chưa thanh toán (COD)';
  };

  const nhanVienName = datanv.find(nv => nv.ma_nhan_vien === parseInt(ma_nhan_vien))?.ten_nhan_vien || 'Chưa phân công';

  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Đơn hàng #${ma_don_hang}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, sans-serif; padding: 20px; color: #333; }
        .invoice { max-width: 800px; margin: 0 auto; border: 2px solid #333; padding: 30px; }
        .header { text-align: center; border-bottom: 2px dashed #333; padding-bottom: 20px; margin-bottom: 20px; }
        .header h1 { font-size: 28px; color: #2c3e50; margin-bottom: 5px; }
        .header p { color: #666; font-size: 14px; }
        .order-info { display: flex; justify-content: space-between; margin-bottom: 20px; }
        .order-info div { flex: 1; }
        .order-info h3 { font-size: 14px; color: #666; margin-bottom: 5px; text-transform: uppercase; }
        .order-info p { font-size: 15px; font-weight: 500; }
        .section { margin-bottom: 20px; }
        .section-title { background: #2c3e50; color: white; padding: 10px 15px; font-size: 14px; font-weight: 600; }
        .section-content { padding: 15px; border: 1px solid #ddd; border-top: none; }
        .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dotted #ddd; }
        .row:last-child { border-bottom: none; }
        .row .label { color: #666; }
        .row .value { font-weight: 600; }
        .total-section { background: #f8f9fa; padding: 20px; margin-top: 20px; }
        .total-row { display: flex; justify-content: space-between; font-size: 18px; }
        .total-row .amount { font-size: 24px; color: #e74c3c; font-weight: 700; }
        .status-badge { display: inline-block; padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        .status-paid { background: #d4edda; color: #155724; }
        .status-unpaid { background: #fff3cd; color: #856404; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px dashed #333; }
        .footer p { font-size: 13px; color: #666; margin-bottom: 5px; }
        @media print { 
          body { padding: 0; } 
          .invoice { border: none; }
        }
      </style>
    </head>
    <body>
      <div class="invoice">
        <div class="header">
          <h1>🏪 SHOP PHỤ KIỆN</h1>
          <p>Địa chỉ: 123 Đường ABC, Quận XYZ, TP. Cần Thơ</p>
          <p>Hotline: 0123 456 789 | Email: shop@phukien.vn</p>
        </div>

        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="font-size: 22px; color: #2c3e50;">HÓA ĐƠN BÁN HÀNG</h2>
          <p style="color: #666;">Mã đơn hàng: <strong>#${ma_don_hang}</strong></p>
          <p style="color: #666;">Ngày đặt: <strong>${ngay_dat_hang?.slice(0, 10) || ''}</strong></p>
        </div>

        <div class="section">
          <div class="section-title">THÔNG TIN KHÁCH HÀNG</div>
          <div class="section-content">
            <div class="row">
              <span class="label">Họ tên:</span>
              <span class="value">${ten_khach || ''}</span>
            </div>
            <div class="row">
              <span class="label">Số điện thoại:</span>
              <span class="value">${sdt || ''}</span>
            </div>
            <div class="row">
              <span class="label">Địa chỉ:</span>
              <span class="value">${dia_chi || ''}</span>
            </div>
            <div class="row">
              <span class="label">Ghi chú:</span>
              <span class="value">${ghi_chu || 'Không có'}</span>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">THÔNG TIN ĐƠN HÀNG</div>
          <div class="section-content">
            <div class="row">
              <span class="label">Trạng thái đơn hàng:</span>
              <span class="value">${getTrangThaiText(trang_thai)}</span>
            </div>
            <div class="row">
              <span class="label">Nhân viên giao hàng:</span>
              <span class="value">${nhanVienName}</span>
            </div>
            <div class="row">
              <span class="label">Trạng thái thanh toán:</span>
              <span class="value">
                <span class="status-badge ${trang_thai_thanh_toan === 2 ? 'status-paid' : 'status-unpaid'}">
                  ${getThanhToanText()}
                </span>
              </span>
            </div>
          </div>
        </div>

        <div class="total-section">
          <div class="total-row">
            <span>TỔNG TIỀN:</span>
            <span class="amount">${formatVND(tong_tien)}</span>
          </div>
        </div>

        <div class="footer">
          <p>Cảm ơn quý khách đã mua hàng!</p>
          <p>Mọi thắc mắc xin liên hệ hotline: 0123 456 789</p>
          <p style="margin-top: 10px; font-style: italic;">Ngày in: ${new Date().toLocaleDateString('vi-VN')} ${new Date().toLocaleTimeString('vi-VN')}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  printWindow.document.write(printContent);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
  }, 300);
};

  return (
    <div>
      <h3 class="mb-0">Cập nhật đơn hàng</h3>
      <hr />
      <form onSubmit={handleSubmit} enctype="multipart/form-data">
          <div class="row">
              <div class="col mb-3">
                  <label class="form-label">Tên khách hàng</label>
                  <input type="text" name="ten_khach" class="form-control" onChange={handleInputChange} placeholder="Tên khách hàng" value={ten_khach || "" }/>
              </div>
              <div class="col mb-3">
                  <label class="form-label">Số điện thoại</label>
                  <input type="text" name="sdt" class="form-control" onChange={handleInputChange} placeholder="Số điện thoại" value={sdt || ""} />
              </div>
          </div>
          <div class="row">
              <div class="col mb-3">
                  <label class="form-label">Ngày đặt hàng</label>
                  <input type="text" name="ngay_dat_hang" class="form-control" onChange={handleInputChange} placeholder="Ngày đặt hàng" value={ngay_dat_hang?.slice(0, 10) || ""} />
              </div>
              <div class="col mb-3">
              <select
                style={{ marginTop: '31px'}}
                name="trang_thai"
                className="form-control"
                onChange={handleInputChange}
                value={trang_thai}
              >
                <option value="2">Đã Duyệt</option>
                <option value="1">Chưa Duyệt</option>
                <option value="3">Đang giao</option>
                <option value="4">Đã giao thành công</option>

              </select>
              </div>
          </div>
          <div class="row">
              <div class="col mb-3">
                  <label class="form-label">Địa chỉ</label>
                  <input type="text" name="soluong" class="form-control" onChange={handleInputChange} placeholder="Địa chỉ" value={dia_chi || ""} />
              </div>
              <div class="col mb-3">
                  <label class="form-label">Tổng tiền</label>
                  <input type="text" name="ma_danh_muc" class="form-control" onChange={handleInputChange} placeholder="Tổng tiền" value={formatVND(tong_tien) || ""} />
              </div>
          </div>
          <div className='row'>
          
              <div class="col mb-3">
                  <label class="form-label">Mô tả</label>
                  <input type="text" name="ghi_chu" class="form-control" onChange={handleInputChange} placeholder="Ghi chú" value={ghi_chu || ""} />
              </div>
              <div className="col mb-3">
                  <label className="form-label">Nhân viên giao hàng</label>
                  <select
                    name="ma_nhan_vien"
                    className="form-control"
                    onChange={handleInputChange}
                    value={ma_nhan_vien} // hoặc state bạn đang dùng
                  >
                    <option value="">-- Chọn nhân viên --</option>
                    {datanv.map(nv => (
                      <option key={nv.ma_nhan_vien} value={nv.ma_nhan_vien}>
                        {nv.ten_nhan_vien}
                      </option>
                    ))}
                  </select>
                </div>

          </div>

                <div className="row">
                  <div className="col mb-3">
                    <label className="form-label">Trạng thái thanh toán</label>
                    <select
                        name="combined_thanh_toan"
                        className="form-control"
                        value={`${trang_thai_thanh_toan}|${loai_thanh_toan}`}
                        onChange={(e) => {
                        const [trang_thai, loai] = e.target.value.split("|");
                        setState({
                            ...state,
                            trang_thai_thanh_toan: parseInt(trang_thai),
                            loai_thanh_toan: loai
                        });
                        }}
                    >
                        <option value="1|BuyLate">Chưa thanh toán (COD)</option>
                        <option value="2|ATM">Đã thanh toán qua thẻ ATM</option>
                        <option value="2|VnPay">Đã thanh toán qua VnPay</option>
                        <option value="2|BuyLate">Đã thanh toán bằng tiền mặt</option>
                    </select>
                    </div>

                    {/* Hiển thị trạng thái thanh toán hiện tại */}
                    <div className="col mb-3">
                      <label className="form-label">Phương thức thanh toán</label>
                      <div className="form-control" style={{ 
                        backgroundColor: trang_thai_thanh_toan === 2 ? '#d4edda' : '#fff3cd',
                        color: trang_thai_thanh_toan === 2 ? '#155724' : '#856404',
                        fontWeight: '600'
                      }}>
                        {trang_thai_thanh_toan === 2 ? (
                          <span>
                            <i className="fas fa-check-circle" style={{ marginRight: '8px' }}></i>
                            Đã thanh toán {loai_thanh_toan === 'ATM' ? '(Thẻ ATM)' : loai_thanh_toan === 'VnPay' ? '(VnPay)' : '(Tiền mặt)'}
                          </span>
                        ) : (
                          <span>
                            <i className="fas fa-clock" style={{ marginRight: '8px' }}></i>
                            Chưa thanh toán (Thanh toán khi nhận hàng)
                          </span>
                        )}
                      </div>
                    </div>
                </div>
          <div class="row">
              <div class="d-grid">
                  <button type="submit" style={{marginLeft: '10px', marginTop: '30px'}} class="btn btn-warning">Cập nhật</button>
              </div>
              <div class="d-grid">
                  <button type="button" onClick={handlePrintOrder} style={{marginLeft: '10px', marginTop: '30px'}} class="btn btn-info">
                    <i className="fas fa-print" style={{ marginRight: '8px' }}></i>In Đơn
                  </button>
              </div>
          </div>
      </form>
    </div>
  )
}
