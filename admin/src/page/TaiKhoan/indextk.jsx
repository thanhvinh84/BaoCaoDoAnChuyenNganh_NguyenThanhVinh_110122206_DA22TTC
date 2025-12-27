import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function TaiKhoan() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const loadData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/getalltaikhoan");
      setData(response.data);
    } catch (error) {
      console.error("Error loading data", error);
    }
  };

  const handleSearch = async (e) => {
    const searchTerm = e.target.value;
    if (!searchTerm) {
      loadData();
    } else {
      try {
        const response = await axios.get(`http://localhost:5000/api/searchtk/${searchTerm}`);
        setData(response.data);
      } catch (error) {
        console.error("Error searching data", error);
      }
    }
  };

  // Xem chi tiết tài khoản
  const handleViewDetail = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  // Ẩn/Hiện tài khoản
  const handleToggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    const action = newStatus === 0 ? 'khóa' : 'mở khóa';
    
    if (window.confirm(`Bạn có chắc muốn ${action} tài khoản này?`)) {
      try {
        await axios.put(`http://localhost:5000/api/toggletaikhoan/${userId}`, { trang_thai: newStatus });
        toast.success(`Đã ${action} tài khoản thành công!`);
        loadData();
      } catch (error) {
        console.error("Error toggling status", error);
        toast.error(`Lỗi khi ${action} tài khoản`);
      }
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Format ngày
  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa cập nhật';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div>
      <div className="card shadow mb-4">
        <div className="d-flex align-items-center justify-content-between card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Quản Lý Tài Khoản</h6>
        </div>
        <div className="d-flex align-items-center card-header">
          <form className="d-none d-sm-inline-block form-inline mr-auto my-2 my-md-0 mw-100 navbar-search">
            <div className="input-group">
              <label htmlFor="">Tìm kiếm :</label>
              <input
                style={{ marginLeft: '5px' }}
                type="text"
                onChange={handleSearch}
                className="form-control form-control-sm"
                placeholder="nhập dữ liệu tìm kiếm"
              />
            </div>
          </form>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <div className="mb-3">
              <label className="mr-2">Số bản ghi/trang:</label>
              <select
                className="form-control form-control-sm d-inline-block"
                style={{ width: "80px" }}
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(parseInt(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
            <table className="table table-bordered" width="100%" cellSpacing="0">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Email</th>
                  <th>Tên người dùng</th>
                  <th>Trạng thái</th>
                  <th>Chi tiết</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr key={item.id_tai_khoan}>
                    <td>{indexOfFirstItem + index + 1}</td>
                    <td>{item.email}</td>
                    <td>{item.ten_nguoi_dung || 'Chưa cập nhật'}</td>
                    <td>
                      {item.trang_thai === 1 || item.trang_thai === undefined ? (
                        <span className="badge badge-success p-2">
                          <i className="fas fa-check-circle mr-1"></i>Hoạt động
                        </span>
                      ) : (
                        <span className="badge badge-danger p-2">
                          <i className="fas fa-ban mr-1"></i>Đã khóa
                        </span>
                      )}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-info btn-sm"
                        onClick={() => handleViewDetail(item)}
                      >
                        <i className="fas fa-eye mr-1"></i>Xem
                      </button>
                    </td>
                    <td>
                      {item.trang_thai === 1 || item.trang_thai === undefined ? (
                        <button
                          type="button"
                          className="btn btn-warning btn-sm"
                          onClick={() => handleToggleStatus(item.id_tai_khoan, 1)}
                          title="Khóa tài khoản"
                        >
                          <i className="fas fa-lock mr-1"></i>Khóa
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-success btn-sm"
                          onClick={() => handleToggleStatus(item.id_tai_khoan, 0)}
                          title="Mở khóa tài khoản"
                        >
                          <i className="fas fa-unlock mr-1"></i>Mở khóa
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
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

      {/* Modal Chi tiết tài khoản */}
      {showModal && selectedUser && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '30px',
            width: '550px',
            maxWidth: '95%',
            boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
            position: 'relative'
          }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '25px' }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 15px'
              }}>
                {selectedUser.anh_nguoi_dung ? (
                  <img 
                    src={selectedUser.anh_nguoi_dung} 
                    alt="Avatar" 
                    style={{ width: '76px', height: '76px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <i className="fas fa-user" style={{ fontSize: '36px', color: 'white' }}></i>
                )}
              </div>
              <h4 style={{ color: '#333', margin: 0 }}>{selectedUser.ten_nguoi_dung || 'Chưa cập nhật tên'}</h4>
              <p style={{ color: '#666', margin: '5px 0 0' }}>{selectedUser.email}</p>
            </div>

            {/* Thông tin chi tiết */}
            <div style={{ background: '#f8f9fa', borderRadius: '12px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #e9ecef' }}>
                <span style={{ color: '#666' }}>ID tài khoản:</span>
                <span style={{ fontWeight: '600' }}>#{selectedUser.id_tai_khoan}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #e9ecef' }}>
                <span style={{ color: '#666' }}>Email:</span>
                <span style={{ fontWeight: '600' }}>{selectedUser.email}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #e9ecef' }}>
                <span style={{ color: '#666' }}>Tên người dùng:</span>
                <span style={{ fontWeight: '600' }}>{selectedUser.ten_nguoi_dung || 'Chưa cập nhật'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #e9ecef' }}>
                <span style={{ color: '#666' }}>Số điện thoại:</span>
                <span style={{ fontWeight: '600' }}>{selectedUser.sdt || 'Chưa cập nhật'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #e9ecef' }}>
                <span style={{ color: '#666' }}>Loại tài khoản:</span>
                <span style={{ fontWeight: '600' }}>
                  {selectedUser.type === 1 ? (
                    <span className="badge badge-primary">Admin</span>
                  ) : (
                    <span className="badge badge-secondary">Khách hàng</span>
                  )}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #e9ecef' }}>
                <span style={{ color: '#666' }}>Trạng thái:</span>
                <span style={{ fontWeight: '600' }}>
                  {selectedUser.trang_thai === 1 || selectedUser.trang_thai === undefined ? (
                    <span className="badge badge-success">Hoạt động</span>
                  ) : (
                    <span className="badge badge-danger">Đã khóa</span>
                  )}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
                <span style={{ color: '#666' }}>Ngày tạo:</span>
                <span style={{ fontWeight: '600' }}>{formatDate(selectedUser.ngay_tao)}</span>
              </div>
            </div>

            {/* Buttons */}
            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#6c757d',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '15px',
                  cursor: 'pointer'
                }}
              >
                Đóng
              </button>
              {selectedUser.trang_thai === 1 || selectedUser.trang_thai === undefined ? (
                <button
                  onClick={() => {
                    handleToggleStatus(selectedUser.id_tai_khoan, 1);
                    setShowModal(false);
                  }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#dc3545',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '15px',
                    cursor: 'pointer'
                  }}
                >
                  <i className="fas fa-lock mr-1"></i> Khóa tài khoản
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleToggleStatus(selectedUser.id_tai_khoan, 0);
                    setShowModal(false);
                  }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#28a745',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '15px',
                    cursor: 'pointer'
                  }}
                >
                  <i className="fas fa-unlock mr-1"></i> Mở khóa
                </button>
              )}
            </div>

            {/* Close button */}
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: '#f5f5f5',
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
              <i className="fa-solid fa-xmark" style={{ color: '#666' }}></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
