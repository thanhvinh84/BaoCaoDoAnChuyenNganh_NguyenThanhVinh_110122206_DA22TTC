import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

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
    anhhover1:"",
    anhhover2:"",
    anhhover3:"",
    thongbao: "",
    sale: ""
};

export default function Editsp() {

  const [state, setState] = useState(initiaState);
   const [danhmucList, setdanhmucList] = useState([]);  // state lưu danh sách 

  const [file, setFile] = useState(null);

const {
  ten_san_pham,
  gia,
  mau_sac,
  anhhover1,
  thuong_hieu,
  model,
  cong_suat,
  dien_ap,
  chat_lieu,
  kich_thuoc,
  trong_luong,
  bao_hanh,
  xuat_xu,
  soluong,
  ma_danh_muc,
  mo_ta
} = state;


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

  const {ma_san_pham} = useParams();

  const navigate = useNavigate();

  console.log(state)

  useEffect(()=>{
    axios.get(`http://localhost:5000/api/getsp/${ma_san_pham}`)
    .then((resp) => setState({...resp.data[0]}));
  },[ma_san_pham]);
  
  const handleInputChange = (e) =>{
    const{name, value} = e.target;
    setState({...state,[name]:value});
  }

  const handleFileChange = async (e, type) => {
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
        setState({ ...state, [type]: response.data.imagePath });
        toast.success('Upload ảnh thành công!');
      }
    } catch (error) {
      console.error('Lỗi upload:', error);
      toast.error('Lỗi khi upload ảnh!');
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    // Kiểm tra bắt buộc các trường quan trọng
    if (!state.ten_san_pham || !state.gia ||!state.mau_sac || !state.anh_sanpham || !state.ma_danh_muc || !state.soluong || !state.mo_ta) {
      return toast.error("Vui lòng nhập đầy đủ thông tin");
    }

    if (window.confirm("Bạn có muốn cập nhật thông tin?")) {
      axios.put(`http://localhost:5000/api/updatesp/${ma_san_pham}`, state)
        .then(() => {
          toast.success("Cập nhật sản phẩm thành công!");
          navigate("/Indexsp");
        })
        .catch(err => toast.error(err.response?.data || "Lỗi khi cập nhật sản phẩm"));
    }
  };

  return (
    <div>
      <h3 class="mb-0">Cập nhật sản phẩm</h3>
      <hr />
      <form onSubmit={handleSubmit} enctype="multipart/form-data">
          <div class="row">
              <div class="col mb-3">
                  <label class="form-label">Tên sản phẩm</label>
                  <input type="text" name="ten_san_pham" class="form-control" onChange={handleInputChange} placeholder="Tên sản phẩm" value={ten_san_pham || "" }/>
              </div>
              <div class="col mb-3">
                  <label class="form-label">Giá tiền</label>
                  <input type="text" name="gia" class="form-control" onChange={handleInputChange} placeholder="Giá tiền" value={gia || ""} />
              </div>
          </div>
          <div class="row">
          <div className="col mb-3">
            <label className="form-label">Xuất xứ</label>
            <input
              type="text"
              name="xuat_xu"
              className="form-control"
              onChange={handleInputChange}
              value={state.xuat_xu || ""}
            />
          </div>

              <div class="col mb-3">
                  <label class="form-label">Màu sắc</label>
                  <input type="text" name="mau_sac" class="form-control" onChange={handleInputChange} placeholder="Màu sắc" value={mau_sac || ""} />
              </div>

          </div>
          <div class="row">
              <div class="col mb-3">
                  <label class="form-label">Số lượng</label>
                  <input type="text" name="soluong" class="form-control" onChange={handleInputChange} placeholder="Số lượng" value={soluong || ""} />
              </div>
              <div class="col mb-3">
                  <label class="form-label">Mã danh mục</label>
                           
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
          <div className='row'>
          
              <div class="col mb-3">
                  <label class="form-label">Mô tả</label>
                  <input type="text" name="mo_ta" class="form-control" onChange={handleInputChange} placeholder="Mô tả" value={mo_ta || ""} />
              </div>
          </div>

        <div className="row">
          <div className="col mb-3">
            <label className="form-label">Thương hiệu</label>
            <input
              type="text"
              name="thuong_hieu"
              className="form-control"
              onChange={handleInputChange}
              value={state.thuong_hieu || ""}
            />
          </div>
          <div className="col mb-3">
            <label className="form-label">Model</label>
            <input
              type="text"
              name="model"
              className="form-control"
              onChange={handleInputChange}
              value={state.model || ""}
            />
          </div>
        </div>

        <div className="row">
          <div className="col mb-3">
            <label className="form-label">Công suất</label>
            <input
              type="text"
              name="cong_suat"
              className="form-control"
              onChange={handleInputChange}
              value={state.cong_suat || ""}
            />
          </div>
          <div className="col mb-3">
            <label className="form-label">Điện áp</label>
            <input
              type="text"
              name="dien_ap"
              className="form-control"
              onChange={handleInputChange}
              value={state.dien_ap || ""}
            />
          </div>
        </div>

        <div className="row">
          <div className="col mb-3">
            <label className="form-label">Chất liệu</label>
            <input
              type="text"
              name="chat_lieu"
              className="form-control"
              onChange={handleInputChange}
              value={state.chat_lieu || ""}
            />
          </div>
          <div className="col mb-3">
            <label className="form-label">Kích thước</label>
            <input
              type="text"
              name="kich_thuoc"
              className="form-control"
              onChange={handleInputChange}
              value={state.kich_thuoc || ""}
            />
          </div>
        </div>

        <div className="row">
          <div className="col mb-3">
            <label className="form-label">Trọng lượng</label>
            <input
              type="text"
              name="trong_luong"
              className="form-control"
              onChange={handleInputChange}
              value={state.trong_luong || ""}
            />
          </div>
          <div className="col mb-3">
            <label className="form-label">Bảo hành</label>
            <input
              type="text"
              name="bao_hanh"
              className="form-control"
              onChange={handleInputChange}
              value={state.bao_hanh || ""}
            />
          </div>
        </div>

        <div className="row">
          <div className="col mb-3">
            <label className="form-label">Thông báo khuyến mãi (hiển thị dưới giá)</label>
            <input
              type="text"
              name="thongbao"
              className="form-control"
              onChange={handleInputChange}
              value={state.thongbao || ""}
              placeholder="VD: Giảm đẹp mua ngay sale hot"
            />
          </div>
          <div className="col mb-3">
            <label className="form-label">Tag Sale (hiển thị góc sản phẩm)</label>
            <input
              type="text"
              name="sale"
              className="form-control"
              onChange={handleInputChange}
              value={state.sale || ""}
              placeholder="VD: Sale, Hot, New"
            />
          </div>
        </div>
        
          <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Ảnh sản phẩm chính</label>
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
                </div>
                <input
                  type="file"
                  id="anh_sanpham_input"
                  style={{ display: 'none' }}
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'anh_sanpham')}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Ảnh 2</label>
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
                  onClick={() => document.getElementById('anhhover1_input').click()}
                >
                  {state.anhhover1 ? (
                    <img 
                      src={state.anhhover1.startsWith('http') ? state.anhhover1 : `http://localhost:5000${state.anhhover1}`} 
                      alt="Ảnh 2"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ textAlign: 'center', color: '#999' }}>
                      <i className="fas fa-camera" style={{ fontSize: '40px' }}></i>
                      <p>Click để chọn ảnh</p>
                    </div>
                  )}
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
                </div>
                <input
                  type="file"
                  id="anhhover1_input"
                  style={{ display: 'none' }}
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'anhhover1')}
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Ảnh 3</label>
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
                  onClick={() => document.getElementById('anhhover2_input').click()}
                >
                  {state.anhhover2 ? (
                    <img 
                      src={state.anhhover2.startsWith('http') ? state.anhhover2 : `http://localhost:5000${state.anhhover2}`} 
                      alt="Ảnh 3"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ textAlign: 'center', color: '#999' }}>
                      <i className="fas fa-camera" style={{ fontSize: '40px' }}></i>
                      <p>Click để chọn ảnh</p>
                    </div>
                  )}
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
                </div>
                <input
                  type="file"
                  id="anhhover2_input"
                  style={{ display: 'none' }}
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'anhhover2')}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Ảnh 4</label>
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
                  onClick={() => document.getElementById('anhhover3_input').click()}
                >
                  {state.anhhover3 ? (
                    <img 
                      src={state.anhhover3.startsWith('http') ? state.anhhover3 : `http://localhost:5000${state.anhhover3}`} 
                      alt="Ảnh 4"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ textAlign: 'center', color: '#999' }}>
                      <i className="fas fa-camera" style={{ fontSize: '40px' }}></i>
                      <p>Click để chọn ảnh</p>
                    </div>
                  )}
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
                </div>
                <input
                  type="file"
                  id="anhhover3_input"
                  style={{ display: 'none' }}
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'anhhover3')}
                />
              </div>
            </div>

          <div class="row">
              <div class="d-grid">
                  <button style={{marginLeft: '10px', marginTop: '30px'}} class="btn btn-warning">Cập nhật</button>
              </div>
          </div>
      </form>
    </div>
  )
}
