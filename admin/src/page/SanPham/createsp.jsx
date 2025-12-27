import React, { useState ,useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const initiaState = {
    ten_san_pham: "",
    gia: "",
    mau_sac: "",
    anh_sanpham: "",
    ma_danh_muc: "",
    soluong: "",
    mo_ta: "",
    thuong_hieu: "",
    model: "",
    cong_suat: "",
    dien_ap: "",
    chat_lieu: "",
    kich_thuoc: "",
    trong_luong: "",
    bao_hanh: "",
    xuat_xu: "",
    thongbao: "",
    sale: ""
};

export default function Createsp() {

    const [state , setState] = useState(initiaState);
    const [danhmucList, setdanhmucList] = useState([]);  // state lưu danh sách 

  const { ten_san_pham, gia,  mau_sac, anh_sanpham, ma_danh_muc, soluong, mo_ta,  anhhover1,
  thuong_hieu,
  model,
  cong_suat,
  dien_ap,
  chat_lieu,
  kich_thuoc,
  trong_luong,
  bao_hanh,
  xuat_xu, } = state;


    const navigate = useNavigate();

    useEffect(() => {
        // Gọi API để lấy danh sách các khoa
        axios.get("http://localhost:5000/api/getalldm")
            .then((response) => {
                setdanhmucList(response.data);
            })
            .catch((error) => {
                console.error(error);
                toast.error("Lỗi khi lấy danh sách khoa");
            });
    }, []);

const handleSubmit = (e) => {
    e.preventDefault();

    // Kiểm tra thiếu trường nào thì báo lỗi
    if (
        !ten_san_pham || !gia || !mau_sac || !anh_sanpham || !ma_danh_muc || !soluong || !mo_ta 
    ) {
        toast.error("Vui lòng nhập đầy đủ tất cả thông tin sản phẩm.");
    } else {
        // Xử lý giá: loại bỏ dấu chấm và chuyển thành số
        const giaNumber = parseInt(gia.toString().replace(/\./g, ''), 10);
        const dataToSend = { ...state, gia: giaNumber };
        
        axios.post("http://localhost:5000/api/createsp", dataToSend)
            .then(() => {
                setState({
                    ten_san_pham: "", gia: "", size: "", mau_sac: "", anh_sanpham: "", ma_danh_muc: "",
                    soluong: "", mo_ta: ""
                });
                toast.success("Thêm sản phẩm thành công!");
                setTimeout(() => navigate("/Indexsp"), 500);
            })
            .catch((err) => {
                console.error(err);
                toast.error("Đã xảy ra lỗi khi thêm sản phẩm.");
            });
    }
};


    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Upload ảnh lên server
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await axios.post('http://localhost:5000/api/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            if (response.data.success) {
                setState({ ...state, anh_sanpham: response.data.imagePath });
                toast.success('Upload ảnh thành công!');
            }
        } catch (error) {
            console.error('Lỗi upload:', error);
            toast.error('Lỗi khi upload ảnh!');
        }
      };

    const handleInputChange = (e) =>{
        const{name,value} = e.target;
        setState({...state,[name]:value});
    }

    
  return (
    <div>
    <h3 className="mb-0">Thêm sản phẩm</h3>
    <hr />
    <form onSubmit={handleSubmit} enctype="multipart/form-data">
      
        <div className="row mb-3">
            <div className="col">
                <input type="text" name="ten_san_pham" onChange={handleInputChange} value={ten_san_pham} className="form-control" placeholder="Tên sản phẩm "/>
            </div>
            <div className="col">
                <input type="text" name="gia" onChange={handleInputChange} value={gia} className="form-control" placeholder="Giá"/>
            </div>
        </div>
        <div className="row mb-3">

            <div className="col">
                <input
                type="text"
                name="xuat_xu"
                onChange={handleInputChange}
                value={state.xuat_xu}
                className="form-control"
                placeholder="Xuất xứ"
                />
            </div>
           

            <div className="col">
                <input type="text" name="mau_sac" onChange={handleInputChange} value={mau_sac} className="form-control" placeholder="Màu sắc"/>
            </div>

        </div>
        <div className="row mb-3">
            <div className="col">
                <label className="form-label">Ảnh sản phẩm</label>
                <div 
                  style={{
                    position: 'relative',
                    width: '200px',
                    height: '200px',
                    border: '2px dashed #ccc',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f8f9fa'
                  }}
                  onClick={() => document.getElementById('anh_sanpham_input').click()}
                >
                  {state.anh_sanpham ? (
                    <img 
                      src={state.anh_sanpham.startsWith('http') ? state.anh_sanpham : `http://localhost:5000${state.anh_sanpham}`} 
                      alt="Ảnh sản phẩm"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ textAlign: 'center', color: '#999' }}>
                      <i className="fas fa-camera" style={{ fontSize: '40px' }}></i>
                      <p>Click để chọn ảnh</p>
                    </div>
                  )}
                  {state.anh_sanpham && (
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'rgba(0,0,0,0.6)',
                      color: 'white',
                      padding: '5px',
                      textAlign: 'center',
                      fontSize: '12px'
                    }}>
                      Click để đổi ảnh
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  id="anh_sanpham_input"
                  style={{ display: 'none' }}
                  accept="image/*"
                  onChange={handleFileChange}
                />
            </div>
            <div className="col">
                        <label className="form-label">Danh mục</label>
                        <select
                            name="ma_danh_muc"
                            value={ma_danh_muc}
                            onChange={handleInputChange}
                            className="form-control"
                        >
                            <option value="">Chọn danh mục</option>
                            {danhmucList.map((danh_muc) => (
                                <option key={danh_muc.ma_danh_muc} value={danh_muc.ma_danh_muc}>
                                    {danh_muc.ten_danh_muc}
                                </option>
                            ))}
                        </select>
            </div>
        </div>
        <div className="row mb-3">
            <div className="col">
                <input type="text" onChange={handleInputChange} value={soluong} name="soluong" className="form-control" placeholder="Số lượng"/>
            </div>
            <div className="col">
            <textarea name="mo_ta"onChange={handleInputChange} value={mo_ta}  className="form-control" placeholder="Mô tả"></textarea>
            </div>
            
        </div>
<div className="row mb-3">
  <div className="col">
    <input
      type="text"
      name="thuong_hieu"
      onChange={handleInputChange}
      value={state.thuong_hieu}
      className="form-control"
      placeholder="Thương hiệu"
    />
  </div>
  <div className="col">
    <input
      type="text"
      name="model"
      onChange={handleInputChange}
      value={state.model}
      className="form-control"
      placeholder="Model"
    />
  </div>
</div>

<div className="row mb-3">
  <div className="col">
    <input
      type="text"
      name="cong_suat"
      onChange={handleInputChange}
      value={state.cong_suat}
      className="form-control"
      placeholder="Công suất"
    />
  </div>
  <div className="col">
    <input
      type="text"
      name="dien_ap"
      onChange={handleInputChange}
      value={state.dien_ap}
      className="form-control"
      placeholder="Điện áp"
    />
  </div>
</div>

<div className="row mb-3">
  <div className="col">
    <input
      type="text"
      name="chat_lieu"
      onChange={handleInputChange}
      value={state.chat_lieu}
      className="form-control"
      placeholder="Chất liệu"
    />
  </div>
  <div className="col">
    <input
      type="text"
      name="kich_thuoc"
      onChange={handleInputChange}
      value={state.kich_thuoc}
      className="form-control"
      placeholder="Kích thước"
    />
  </div>
</div>

<div className="row mb-3">
  <div className="col">
    <input
      type="text"
      name="trong_luong"
      onChange={handleInputChange}
      value={state.trong_luong}
      className="form-control"
      placeholder="Trọng lượng"
    />
  </div>
  <div className="col">
    <input
      type="text"
      name="bao_hanh"
      onChange={handleInputChange}
      value={state.bao_hanh}
      className="form-control"
      placeholder="Bảo hành"
    />
  </div>
</div>

<div className="row mb-3">
  <div className="col">
    <input
      type="text"
      name="thongbao"
      onChange={handleInputChange}
      value={state.thongbao}
      className="form-control"
      placeholder="Thông báo khuyến mãi (VD: Giảm đẹp mua ngay sale hot)"
    />
  </div>
  <div className="col">
    <input
      type="text"
      name="sale"
      onChange={handleInputChange}
      value={state.sale}
      className="form-control"
      placeholder="Tag Sale (VD: Sale, Hot, New)"
    />
  </div>
</div>

        <div className="row">
            <div className="d-grid">
                <button style={{marginLeft: '10px'}} type="submit" className="btn btn-primary">Thêm</button>
            </div>
        </div>
    </form>
  </div>
  )
}
