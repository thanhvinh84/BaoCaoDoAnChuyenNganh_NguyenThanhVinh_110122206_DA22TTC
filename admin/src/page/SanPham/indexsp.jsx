import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast, Flip } from 'react-toastify';

export default function Indexsp() {

    const [data,setData] = useState([]);
        const [currentPage, setCurrentPage] = useState(1);
        const [itemsPerPage, setItemsPerPage] = useState(5);
    
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
        const totalPages = Math.ceil(data.length / itemsPerPage);

    const loadData = async() =>{
        const response = await axios.get("http://localhost:5000/api/getallsp");
        setData(response.data);
    };

    useEffect(()=>{
        loadData();
    },[]);

    const handleSearch = async (e) => {
        const searchTerm = e.target.value;
        if (!searchTerm) {
            loadData();
        } else {
            try {
                const response = await axios.get(`http://localhost:5000/api/searchsp/${searchTerm}`);
                setData(response.data);
            } catch (error) {
                console.error("Error searching data", error);
            }
        }
    };
    

    const deleteSP = (ma_san_pham) => {
        if(window.confirm("Bạn có muốn xóa sản phẩm này không ?")){
            axios.delete(`http://localhost:5000/api/deletesp/${ma_san_pham}`)
            toast.success('Xóa sản phẩm thành công !', {
                position: "top-right",
                autoClose: 500,
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
    <div className="card shadow mb-4">
        <div className="d-flex align-items-center justify-content-between card-header py-3">
            <h6 className="m-0 font-weight-bold text-primary">Dữ Liệu Sản Phẩm</h6>
            {/* <!-- Topbar Search --> */}
            
            <Link to="/Createsp" className="btn btn-primary">Thêm sản phẩm</Link>
        </div>
        <div className="d-flex align-items-center  card-header ">
        <form className="d-none d-sm-inline-block form-inline mr-auto my-2 my-md-0 mw-100 navbar-search">
                <div className="input-group">
                    <label htmlFor="">Tìm kiếm :</label>
                    <input style={{marginLeft:'5px'}} onChange={handleSearch} type="text" className="form-control form-control-sm" placeholder="nhập dữ liệu tìm kiếm" aria-label="Search" aria-describedby="basic-addon2"/>
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
                            <th>Hình ảnh</th>
                            <th>Tên sản phẩm</th>
                            <th>Số lượng</th>
                            <th>Chi tiết</th>
                            <th>Sửa</th>
                            <th>Xóa</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((item,index)=>{
                            return(  
                            <tr key={item.ma_san_pham}>
                                <td>{index+1}</td>
                                <td><img style={{borderRadius: '5px'}} src={`http://localhost:5000${item.anh_sanpham}`} width='60' height='60' className="img img-responsive" /></td>
                                <td>{item.ten_san_pham}</td>
                                <td>{item.soluong}</td>
                                <td><Link to={`/Viewsp/${item.ma_san_pham}`} type="button" className="btn btn-primary">Chi Tiết</Link></td>
                                <td><Link to={`/Updatesp/${item.ma_san_pham}`} className="btn btn-warning">Sửa</Link></td>
                                <td>
                                        <button type='submit' onClick={()=> deleteSP(item.ma_san_pham)} className='btn btn-danger'>Xóa</button>
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
  );
}
