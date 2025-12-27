import axios from 'axios';
import React, { useEffect, useState } from 'react'

export default function Indexkhohang() {

    const [data ,setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(data.length / itemsPerPage);

    const loadData = async() => {
        try {
            const response = await axios.get("http://localhost:5000/api/getallkhohang");
            setData(response.data);
        } catch (error) {
            console.error("Error loading data", error);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSearch = async (e) => {
        const searchTerm = e.target.value;
        if (!searchTerm) {
            loadData();
        } else {
            // Tìm kiếm local
            const response = await axios.get("http://localhost:5000/api/getallkhohang");
            const filtered = response.data.filter(item => 
                item.ten_san_pham?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setData(filtered);
        }
    };

  return (
    <div>
      <div class="card shadow mb-4">
        <div className="d-flex align-items-center justify-content-between card-header py-3">
            <h6 className="m-0 font-weight-bold text-primary"> Quản Lý Tồn Kho Sản Phẩm</h6>
            <div>
                <span className="badge badge-info mr-2 p-2">Tổng: {data.length} sản phẩm</span>
                <span className="badge badge-danger p-2">Hết hàng: {data.filter(i => (i.so_luong_ton || 0) === 0).length}</span>
            </div>
        </div>
        <div className="d-flex align-items-center  card-header ">
            <form className="d-none d-sm-inline-block form-inline mr-auto my-2 my-md-0 mw-100 navbar-search">
                    <div className="input-group">
                        <label htmlFor="">Tìm kiếm :</label>
                        <input style={{marginLeft:'5px'}}type="text" onChange={handleSearch} className="form-control form-control-sm" placeholder="nhập dữ liệu tìm kiếm" aria-label="Search" aria-describedby="basic-addon2"/>
                    </div>
                </form>
            </div>
        <div class="card-body">
            <div class="table-responsive">
                                                    <div>
                        <label className="mr-2">Số bản ghi/trang:</label>
                        <select
                        className="form-control form-control-sm d-inline-block"
                        style={{ width: "80px" }}
                        value={itemsPerPage}
                        onChange={(e) => {
                            setItemsPerPage(parseInt(e.target.value));
                            setCurrentPage(1); // reset về trang đầu
                        }}
                        >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        </select>
                    </div>
                <table class="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Mã SP</th>
                            <th>Ảnh</th>
                            <th>Tên sản phẩm</th>
                            <th>Giá</th>
                            <th>SL tồn kho</th>
                            <th>Trạng thái</th>
                            <th>Ngày nhập gần nhất</th>
                        </tr>
                    </thead>

                    <tbody>
                        {currentItems.map((item,index)=>{
                            const soLuongTon = item.so_luong_ton || 0;
                            return( 
                            <tr key={item.ma_san_pham}>
                                <td>{indexOfFirstItem + index + 1}</td>
                                <td>#{item.ma_san_pham}</td>
                                <td><img style={{borderRadius: '5px'}} src={item.anh_sanpham?.startsWith('http') ? item.anh_sanpham : `http://localhost:5000${item.anh_sanpham}`} width='50' height='50' className="img img-responsive" alt="" /></td>
                                <td>{item.ten_san_pham}</td>
                                <td>{item.gia?.toLocaleString('vi-VN')}đ</td>
                                <td>
                                    <span style={{ 
                                        fontWeight: '700',
                                        fontSize: '16px',
                                        color: soLuongTon > 10 ? '#28a745' : soLuongTon > 0 ? '#ffc107' : '#dc3545'
                                    }}>
                                        {soLuongTon}
                                    </span>
                                </td>
                                <td>
                                    {soLuongTon > 10 ? (
                                        <span className="badge badge-success p-2">✓ Còn hàng</span>
                                    ) : soLuongTon > 0 ? (
                                        <span className="badge badge-warning p-2">⚠ Sắp hết</span>
                                    ) : (
                                        <span className="badge badge-danger p-2">✗ Hết hàng</span>
                                    )}
                                </td>
                                <td>{item.ngay_san_xuat ? item.ngay_san_xuat.slice(0, 10) : 'Chưa nhập kho'}</td>
                            </tr>)
                        })}
                       
                    </tbody>
                </table>

                                                        <nav>
                        <ul className="pagination justify-content-center mt-3">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}>
                                &laquo;
                            </button>
                            </li>

                            {[...Array(totalPages).keys()].map(number => (
                            <li key={number + 1} className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}>
                                <button onClick={() => setCurrentPage(number + 1)} className="page-link">
                                {number + 1}
                                </button>
                            </li>
                            ))}

                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}>
                                &raquo;
                            </button>
                            </li>
                        </ul>
                    </nav>
            </div>
        </div>
    </div>
    </div>
  )
}
