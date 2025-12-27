import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { Flip, toast } from 'react-toastify';

export default function IndexHDN() {
    const formatCurrency = (number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
    };  
    
    const [data , setData] = useState([]);
        const [currentPage, setCurrentPage] = useState(1);
        const [itemsPerPage, setItemsPerPage] = useState(5);
    
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
        const totalPages = Math.ceil(data.length / itemsPerPage);

    const loadData =  async() =>{
        const response = await axios.get("http://localhost:5000/api/getallhdn");
        setData(response.data);
    };

        useEffect(()=>{
            loadData();
        },[]);

        const handleSearch = async (e) => {
            const searchTerm = e.target.value;
            try {
                const response = await axios.get(`http://localhost:5000/api/searchdn/${searchTerm}`);
                setData(response.data);
            } catch (error) {
                console.error("Error searching data", error);
            }
        };


        const deleteDH = (ma_hoa_don) =>{
            if(window.confirm("Bạn có muốn xóa danh mục này không ?")){
                axios.delete(`http://localhost:5000/api/deletedonhang/${ma_hoa_don}`);
                toast.success('Xóa đơn hàng thành công !', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Flip,
                    });
                setTimeout(()=>loadData(),500);
            }
        }
  return (
    <div>
        <div className="card shadow mb-4">
        <div className="d-flex align-items-center justify-content-between card-header py-3">
            <h6 className="m-0 font-weight-bold text-primary">Dữ Liệu Hóa Đơn Nhập</h6>
            <Link to="/CreateHDN" className="btn btn-primary">Thêm Hóa Đơn</Link>
        </div>
        <div className="d-flex align-items-center  card-header ">
            <form className="d-none d-sm-inline-block form-inline mr-auto my-2 my-md-0 mw-100 navbar-search">
                    <div className="input-group">
                        <label htmlFor="">Tìm kiếm :</label>
                        <input style={{marginLeft:'5px'}}type="text"onChange={handleSearch} className="form-control form-control-sm" placeholder="nhập dữ liệu tìm kiếm" aria-label="Search" aria-describedby="basic-addon2"/>
                    </div>
                </form>
            </div>
        <div className="card-body">
            <div className="table-responsive">
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
                <table className="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Mã NV</th>
                            <th>Tên NCC</th>
                            <th>SĐT</th>
                            <th>Email</th>
                            <th>Địa chỉ</th>
                            <th>Ngày nhập</th>
                            <th>Tổng tiền</th>
                            <th>Chi Tiết</th>
                            <th>Sửa</th>
                            <th>Xóa</th>
                        </tr>
                    </thead>

                    <tbody>
                {currentItems.map((item,index)=>{
                    return(   
                    <tr key={item.ma_hoa_don}>
                        <td>{index+1}</td>
                        <td>{item.ma_nhan_vien}</td>
                        <td>{item.ten_ncc}</td>
                        <td>{item.sdt}</td>
                        <td>{item.email}</td>
                        <td>{item.dia_chi}</td>
                        <td>{item.ngay_nhap.slice(0, 10)}</td>
                        <td>{formatCurrency(item.tong_tien)}</td>
                        <td><Link to={`/Viewcthdn/${item.ma_hoa_don}`} type="button" class="btn btn-primary">Xem</Link></td>
                        <td><a href="" class="btn btn-warning">Sửa</a></td>
                        <td>
                                <button type='submit' onClick={()=> deleteDH(item.ma_hoa_don)} class='btn btn-danger'>Xóa</button>
                    
                        </td>
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
