import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function IndexFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  const loadFeedbacks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/feedback');
      setFeedbacks(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading feedbacks:', error);
      toast.error('Lỗi khi tải danh sách ý kiến');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const handleMarkAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/feedback/read/${id}`);
      loadFeedbacks();
      toast.success('Đã đánh dấu đã đọc');
    } catch (error) {
      toast.error('Lỗi khi cập nhật');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await axios.put('http://localhost:5000/api/feedback/readall');
      loadFeedbacks();
      toast.success('Đã đánh dấu tất cả đã đọc');
    } catch (error) {
      toast.error('Lỗi khi cập nhật');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa ý kiến này?')) {
      try {
        await axios.delete(`http://localhost:5000/api/feedback/${id}`);
        loadFeedbacks();
        toast.success('Đã xóa ý kiến');
      } catch (error) {
        toast.error('Lỗi khi xóa');
      }
    }
  };

  const unreadCount = feedbacks.filter(f => f.da_doc === 0).length;

  return (
    <div>
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">
          📧 Quản lý ý kiến khách hàng
          {unreadCount > 0 && (
            <span className="badge badge-danger ml-2">{unreadCount} mới</span>
          )}
        </h1>
        <button 
          className="btn btn-primary btn-sm"
          onClick={handleMarkAllAsRead}
          disabled={unreadCount === 0}
        >
          <i className="fas fa-check-double mr-1"></i>
          Đánh dấu tất cả đã đọc
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : feedbacks.length === 0 ? (
        <div className="card shadow">
          <div className="card-body text-center py-5">
            <i className="fas fa-inbox fa-3x text-gray-300 mb-3"></i>
            <p className="text-muted">Chưa có ý kiến nào từ khách hàng</p>
          </div>
        </div>
      ) : (
        <div className="row">
          {/* Danh sách feedback */}
          <div className="col-lg-5">
            <div className="card shadow mb-4">
              <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">
                  Danh sách ý kiến ({feedbacks.length})
                </h6>
              </div>
              <div className="card-body p-0" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                {feedbacks.map((fb) => (
                  <div 
                    key={fb.id}
                    className={`p-3 border-bottom ${selectedFeedback?.id === fb.id ? 'bg-light' : ''}`}
                    style={{ 
                      cursor: 'pointer',
                      backgroundColor: fb.da_doc === 0 ? '#fff8e1' : 'white'
                    }}
                    onClick={() => setSelectedFeedback(fb)}
                  >
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <div className="font-weight-bold">
                          {fb.da_doc === 0 && (
                            <span className="badge badge-warning mr-2">Mới</span>
                          )}
                          {fb.ten_khach}
                        </div>
                        <div className="small text-muted">{fb.email}</div>
                        <div className="text-truncate mt-1" style={{ maxWidth: '250px' }}>
                          {fb.noi_dung}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="small text-muted">{formatDate(fb.ngay_gui)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chi tiết feedback */}
          <div className="col-lg-7">
            <div className="card shadow mb-4">
              <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">Chi tiết ý kiến</h6>
              </div>
              <div className="card-body">
                {selectedFeedback ? (
                  <div>
                    <div className="d-flex justify-content-between align-items-start mb-4">
                      <div>
                        <h5 className="mb-1">
                          <i className="fas fa-user-circle text-primary mr-2"></i>
                          {selectedFeedback.ten_khach}
                        </h5>
                        <p className="text-muted mb-0">
                          <i className="fas fa-envelope mr-2"></i>
                          <a href={`mailto:${selectedFeedback.email}`}>{selectedFeedback.email}</a>
                        </p>
                        <p className="text-muted mb-0">
                          <i className="fas fa-clock mr-2"></i>
                          {formatDate(selectedFeedback.ngay_gui)}
                        </p>
                      </div>
                      <div>
                        {selectedFeedback.da_doc === 0 ? (
                          <span className="badge badge-warning p-2">Chưa đọc</span>
                        ) : (
                          <span className="badge badge-success p-2">Đã đọc</span>
                        )}
                      </div>
                    </div>

                    <hr />

                    <div className="mb-4">
                      <h6 className="font-weight-bold text-gray-800">Nội dung:</h6>
                      <div className="p-3 bg-light rounded" style={{ whiteSpace: 'pre-wrap' }}>
                        {selectedFeedback.noi_dung}
                      </div>
                    </div>

                    <div className="d-flex gap-2">
                      {selectedFeedback.da_doc === 0 && (
                        <button 
                          className="btn btn-success mr-2"
                          onClick={() => handleMarkAsRead(selectedFeedback.id)}
                        >
                          <i className="fas fa-check mr-1"></i>
                          Đánh dấu đã đọc
                        </button>
                      )}
                      <a 
                        href={`mailto:${selectedFeedback.email}?subject=Phản hồi từ Shop Phụ Kiện&body=Chào ${selectedFeedback.ten_khach},%0A%0ACảm ơn bạn đã gửi ý kiến đến chúng tôi.%0A%0A`}
                        className="btn btn-primary mr-2"
                      >
                        <i className="fas fa-reply mr-1"></i>
                        Trả lời qua Email
                      </a>
                      <button 
                        className="btn btn-danger"
                        onClick={() => handleDelete(selectedFeedback.id)}
                      >
                        <i className="fas fa-trash mr-1"></i>
                        Xóa
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-5 text-muted">
                    <i className="fas fa-hand-pointer fa-3x mb-3"></i>
                    <p>Chọn một ý kiến để xem chi tiết</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
